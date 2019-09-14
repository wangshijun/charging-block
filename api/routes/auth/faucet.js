/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
const multibase = require('multibase');
const ForgeSDK = require('@arcblock/forge-sdk');

const auth = require('../../libs/auth');

const wallet = ForgeSDK.Wallet.fromJSON(auth.wallet);

module.exports = {
  action: 'faucet',
  claims: {
    signature: async ({ userAddress, userPkHex }) => {
      // assemble exchange tx
      const exchange = {
        itx: {
          to: userAddress,
          sender: {
            value: ForgeSDK.Util.fromTokenToUnit(10000, 18),
          },
          receiver: {
            value: ForgeSDK.Util.fromTokenToUnit(0, 18),
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

      console.log('faucet.signed', signed);
      return {
        wallet,
        txType: 'ExchangeTx',
        txData: signed,
        description: 'Sign this transaction to get 10000 test token',
      };
    },
  },

  onAuth: async ({ claims, userDid, userAddress }) => {
    const claim = claims.find(x => x.type === 'signature');
    const tx = ForgeSDK.decodeTx(multibase.decode(claim.origin));
    console.log('faucet.onAuth.payload', { tx, claim });

    tx.signatures = tx.signaturesList;
    const userSig = tx.signatures.find(x => x.signer === userAddress);
    if (userSig) {
      userSig.signature = claim.sig;
    }
    console.log('faucet.onAuth.multisig', userSig);

    const hash = await ForgeSDK.sendExchangeTx({
      tx,
      wallet,
      signature: tx.signature,
    });
    console.log('faucet.hash', { userDid, userAddress, hash });

    return { hash, tx: claim.origin };
  },
};
