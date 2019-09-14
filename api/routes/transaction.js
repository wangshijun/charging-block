/* eslint-disable no-shadow */
/* eslint-disable object-curly-newline */
const base64 = require('base64-url');
const keystone = require('keystone');
const ForgeSDK = require('@arcblock/forge-sdk');
const env = require('../libs/env');

module.exports = {
  init(app) {
    // send aggregation transaction
    app.post('/api/transaction', async (req, res) => {
      const Transaction = keystone.list('Transaction').model;
      const ChargingPole = keystone.list('ChargingPole').model;

      const { wallet, amount, owner, poleDid } = req.body;
      console.log('send aggregate start:', req.body);
      if (!wallet) {
        return res.status(400).jsonp({ error: 'Car wallet invalid' });
      }
      if (!owner) {
        return res.status(400).jsonp({ error: 'Car owner invalid' });
      }

      // const pole = await ChargingPole.findOne({ did: poleDid })
      const pole = await ChargingPole.findOne({ did: 'zjdo3xRfMUPq95iH1iZ4GUmgS2CiCSy2w4tF' })
        .populate('manufacturer')
        .populate('supplier')
        .populate('location');
      if (!pole) {
        return res.status(400).jsonp({ error: 'Charging pole not found' });
      }

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
          encoded = res.object;
          encoded.signature = wallet.sign(ForgeSDK.Util.bytesToHex(encodeRes.buffer));
        }

        const txObj = ForgeSDK.Message.createMessage('Transaction', encoded);
        const txBytes = txObj.serializeBinary();
        const txStr = base64.escape(Buffer.from(txBytes).toString('base64'));

        return new Promise(async (resolve, reject) => {
          try {
            const { hash } = await this.sendTx({ tx: txStr });
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
        poleId: poleDid,
        carId: wallet.address,
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

      res.json({ transaction: tx.toJSON() });
    });
  },
};
