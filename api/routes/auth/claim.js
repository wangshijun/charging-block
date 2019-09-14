/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
const multibase = require('multibase');
const keystone = require('keystone');
const ForgeSDK = require('@arcblock/forge-sdk');

const auth = require('../../libs/auth');

const wallet = ForgeSDK.Wallet.fromJSON(auth.wallet);

const getPole = async cpid => {
  const ChargingPole = keystone.list('ChargingPole').model;
  const pole = await ChargingPole.findById(cpid);
  if (!pole) {
    throw new Error('Charging pole info does not exist yet');
  }
  if (pole.operator) {
    throw new Error('Charging pole already have an operator');
  }

  return pole;
};

const getAsset = async (cpid, owner) => {
  const pole = await getPole(cpid);

  const asset = {
    moniker: `charging_pole_${cpid}`,
    readonly: true,
    transferrable: true,
    issuer: wallet.toAddress(),
    parent: '',
    data: {
      typeUrl: 'json',
      value: {
        model: 'ChargingPole',
        cpid,
        owner,
      },
    },
  };

  asset.address = ForgeSDK.Util.toAssetAddress(asset, wallet.toAddress());

  pole.did = asset.address;
  await pole.save();

  return asset;
};

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

module.exports = {
  action: 'claim',
  claims: {
    signature: async ({ userDid, userAddress, userPkHex, extraParams: { cpid } }) => {
      const asset = await getAsset(cpid, userDid);
      // Create ticket if not exists
      const { state } = await ForgeSDK.getAssetState({ address: asset.address });
      if (state) {
        console.log('claim.onReq.skipAsset', { assetAddress: asset.address, userAddress });
      } else {
        const hash = await ForgeSDK.sendCreateAssetTx({ tx: { itx: asset }, wallet });
        console.log('claim.onReq.createAsset', { asset, hash, userAddress });

        // Wait for ticket state consolidates on chain
        await sleep(3000);
      }

      // assemble exchange tx
      const exchange = {
        itx: {
          to: userAddress,
          sender: {
            assets: [asset.address],
          },
          receiver: {
            value: ForgeSDK.Util.fromTokenToUnit(0),
          },
        },
      };

      const signed = await ForgeSDK.signExchangeTx({
        tx: exchange,
        wallet,
      });

      signed.signaturesList = [
        {
          pk: userPkHex,
          signer: userAddress,
        },
      ];

      console.log('claim.signed', signed);
      return {
        wallet,
        txType: 'ExchangeTx',
        txData: signed,
        description: 'Sign this transaction to finish initialization of the charging pole',
      };
    },
  },

  onAuth: async ({ claims, userDid, userAddress, extraParams: { cpid } }) => {
    const pole = await getPole(cpid);

    const claim = claims.find(x => x.type === 'signature');
    const tx = ForgeSDK.decodeTx(multibase.decode(claim.origin));
    console.log('claim.onAuth.payload', { tx, claim });

    tx.signatures = tx.signaturesList;
    const userSig = tx.signatures.find(x => x.signer === userAddress);
    if (userSig) {
      userSig.signature = claim.sig;
    }
    console.log('claim.onAuth.multisig', userSig);

    const hash = await ForgeSDK.sendExchangeTx({
      tx,
      wallet,
      signature: tx.signature,
    });
    console.log('claim.hash', { userDid, userAddress, hash, cpid });

    await sleep(3000);
    const res = await ForgeSDK.getTx({ hash });
    console.log('claim.tx', res);
    pole.operator = userAddress;
    pole.claimTx = hash;
    await pole.save();

    return { hash, tx: claim.origin };
  },
};
