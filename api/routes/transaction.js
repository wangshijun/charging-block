/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-shadow */
/* eslint-disable object-curly-newline */
// const base64 = require('base64-url');
const keystone = require('keystone');
const ForgeSDK = require('@arcblock/forge-sdk');
// const env = require('../libs/env');

module.exports = {
  init(app) {
    // send aggregation transaction
    app.post('/api/transaction', async (req, res) => {
      const Transaction = keystone.list('Transaction').model;
      const ChargingPole = keystone.list('ChargingPole').model;

      const { wallet, amount, owner, poleDid } = req.body;
      console.log('send aggregate start:', req.body);
      if (!wallet) {
        return res.jsonp({ status: 400, error: 'Car wallet invalid' });
      }
      if (!owner) {
        return res.jsonp({ status: 400, error: 'Car owner invalid' });
      }

      const pole = await ChargingPole.findOne({ did: poleDid })
        // const pole = await ChargingPole.findOne({ did: 'zjdsfNgQCia3B5ntboy3Gf5jrBXNshxrVocE' })
        .populate('manufacturer')
        .populate('supplier')
        .populate('location');
      if (!pole) {
        return res.jsonp({ status: 400, error: 'Charging pole not found' });
      }

      const car = ForgeSDK.Wallet.fromJSON(wallet);

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

      const receivers = [pole.operator, pole.manufacturer.address, pole.location.address, pole.supplier.address];
      const hashes = await Promise.all(
        receivers.filter(Boolean).map(x =>
          ForgeSDK.sendTransferTx({
            tx: { itx: { to: x, value: ForgeSDK.Util.fromTokenToUnit(amount / 4, 18) } },
            wallet: car,
            delegatee: owner,
          })
        )
      );
      console.log('bulk transfer', hashes);

      // const hash = await txSendFn({
      //   tx: { itx },
      //   type: 'AggregateTx',
      //   wallet: car,
      //   delegatee: owner,
      // });
      // console.log('send aggregate tx:', hash);

      const tx = new Transaction({
        chargingPole: pole,
        operator: pole.operator,
        manufacturer: pole.manufacturer,
        location: pole.location,
        supplier: pole.supplier,
        amount,
        carDid: wallet.address,
        carOwnerDid: owner,
        txHash: '',
      });
      await tx.save();

      res.json({ status: 200, transaction: tx.toJSON() });
    });
  },
};
