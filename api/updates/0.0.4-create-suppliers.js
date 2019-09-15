/* eslint no-console:"off" */
const keystone = require('keystone');
const { fromRandom } = require('@arcblock/forge-wallet');
const ForgeSDK = require('@arcblock/forge-sdk');

const Supplier = keystone.list('Supplier').model;

module.exports = done => {
  const suppliers = [{ name: '国家电网', address: '中国北京市' }];

  // 4. insert source into target
  const tasks = suppliers.map(
    info =>
      new Promise(async resolve => {
        const wallet = fromRandom();
        const { pk, sk, address } = wallet.toJSON();
        info.publicKey = pk;
        info.secretKey = sk;
        info.address = address;
        const supplier = new Supplier(info);

        await ForgeSDK.sendDeclareTx({
          tx: {
            itx: { moniker: `c_${wallet.toAddress()}`, data: { typeUrl: 'json', value: { role: 'supplier' } } },
          },
          wallet,
        });

        supplier.save(err => {
          (err ? console.error : console.log)(
            `insert supplier ${err ? 'failed' : 'success'}`,
            JSON.stringify({ info, err })
          );
          resolve(supplier);
        });
      })
  );

  Promise.all(tasks)
    .then(() => {
      console.log('Supplier list initialize completed');
      done();
    })
    .catch(e => {
      console.error('Supplier list initialize failed', e);
      done();
    });
};
