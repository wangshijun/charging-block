const keystone = require('keystone');
const base64 = require('base64-url');
const ForgeSDK = require('@arcblock/forge-sdk');
const auth = require('../libs/auth');
const env = require('../libs/env');

module.exports = {
  init: async () => {
    const Transaction = keystone.list('Transaction').model;
    const ChargingPole = keystone.list('ChargingPole').model;

    const { wallet, amount, owner, poleDid } = {
      wallet: {
        type: {
          role: 'ROLE_ACCOUNT',
          pk: 'ED25519',
          hash: 'SHA3',
          address: 'BASE58',
        },
        sk:
          '0x48d3a6089d5837e3b65fab6ccf5397c8e11b22c7e9df18b9e0ab19bb9710a4b1605c7db811d1138ecb399aa74f0c8b3de2c02b24072e230e16392ee9df2f18e8',
        pk: '0x605c7db811d1138ecb399aa74f0c8b3de2c02b24072e230e16392ee9df2f18e8',
        address: 'z1dU5DQNZQ1rpfFywciqDVFamnLxamh4E6x',
      },
      amount: '100',
      owner: 'z1d6kuGm2QQCVnY5EonPZNBcKVE5eg1MeRM',
      poleDid: 'zjdsfNgQCia3B5ntboy3Gf5jrBXNshxrVocE',
    };

    // const pole = await ChargingPole.findOne({ did: poleDid })
    const pole = await ChargingPole.findOne({ _id: '5d7cec173163fae938dc9ebd' })
      .populate('manufacturer')
      .populate('supplier')
      .populate('location');
    console.log(pole.toJSON());

    const car = ForgeSDK.Wallet.fromJSON(wallet);

    const txEncodeFn = async ({ tx, type, wallet, delegatee }) => {
      // Determine sender address
      const address = tx.from || wallet.toAddress();
      const pk = tx.pk || wallet.publicKey;

      // Determine chainId & nonce, only attach new one when not exist
      const nonce = typeof tx.nonce === 'undefined' ? Date.now() : tx.nonce;
      let chainId = tx.chainId || env.chainId;
      if (!chainId) {
        const { info } = await this.getChainInfo();
        chainId = info.network;
      }

      // Determine signatures for multi sig
      let signatures = [];
      if (Array.isArray(tx.signatures)) {
        // eslint-disable-next-line prefer-destructuring
        signatures = tx.signatures;
      }
      if (Array.isArray(tx.signaturesList)) {
        signatures = tx.signaturesList;
      }

      // Determine itx
      let itx = null;
      if (tx.itx.typeUrl && tx.itx.value) {
        // eslint-disable-next-line prefer-destructuring
        itx = tx.itx;
      } else {
        itx = { type, value: tx.itx };
      }

      const txObj = ForgeSDK.Message.createMessage('Transaction', {
        from: delegatee || address,
        nonce,
        pk,
        chainId,
        signature: tx.signature || Buffer.from([]),
        signatures,
        delegator: delegatee ? address : '',
        itx,
      });
      const txToSignBytes = txObj.serializeBinary();

      return { object: txObj.toObject(), buffer: Buffer.from(txToSignBytes) };
    };

    const txSendFn = async ({ tx, type, wallet, signature, delegatee }) => {
      let encoded;
      if (signature) {
        encoded = tx;
        encoded.signature = signature;
      } else if (tx.signature) {
        const encodeRes = await txEncodeFn({ tx, type, wallet, delegatee });
        encoded = encodeRes.object;
      } else {
        const encodeRes = await txEncodeFn({ tx, type, wallet, delegatee });
        // eslint-disable-next-line prefer-destructuring
        encoded = encodeRes.object;
        encoded.signature = wallet.sign(ForgeSDK.Util.bytesToHex(encodeRes.buffer));
      }

      const txObj = ForgeSDK.Message.createMessage('Transaction', encoded);
      const txBytes = txObj.serializeBinary();
      const txStr = base64.escape(Buffer.from(txBytes).toString('base64'));

      return new Promise(async (resolve, reject) => {
        try {
          const { hash } = await ForgeSDK.sendTx({ tx: txStr });
          resolve(hash);
        } catch (err) {
          if (Array.isArray(err.errors)) {
            const code = err.errors[0].message;
            reject(code);
            return;
          }

          reject(err);
        }
      });
    };

    const itx = {
      poleid: poleDid,
      carid: wallet.address,
      value: ForgeSDK.Util.fromTokenToUnit(amount / 4, 18),
      operator: pole.operator,
      manufacturer: pole.manufacturer.address,
      location: pole.location.address,
      supplier: pole.supplier.address,
    };
    console.log('send aggregate itx:', itx);

    const hash = await txSendFn({
      tx: { itx },
      type: 'AggregateTx',
      wallet: car,
      delegatee: owner,
    });
    console.log('send aggregate tx:', hash);

    const tx = new Transaction({
      chargingPole: pole,
      operator: pole.operator,
      manufacturer: pole.manufacturer,
      location: pole.location,
      supplier: pole.supplier,
      amount,
      carDid: wallet.address,
      carOwnerDid: owner,
      txHash: hash,
    });
    await tx.save();
  },
};
