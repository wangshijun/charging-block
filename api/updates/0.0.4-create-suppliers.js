/* eslint no-console:"off" */
const keystone = require('keystone');
const { fromRandom } = require('@arcblock/forge-wallet');

const Supplier = keystone.list('Supplier').model;

module.exports = done => {
  const suppliers = [{ name: '国家电网', address: '中国北京市' }];

  // 4. insert source into target
  const tasks = suppliers.map(
    info =>
      new Promise(resolve => {
        const wallet = fromRandom();
        const { pk, sk } = wallet.toJSON();
        info.publicKey = pk;
        info.secretKey = sk;
        const supplier = new Supplier(info);

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
