/* eslint no-console:"off" */
const keystone = require('keystone');
const { fromRandom } = require('@arcblock/forge-wallet');

const Location = keystone.list('Location').model;

module.exports = done => {
  const manus = [
    { name: '浦东新区电站', address: '上海市浦东新区花木路1378号浦东嘉里中心L139' },
    { name: '静安区电站', address: '上海市静安区铜仁路299号47楼' },
    { name: '嘉定区电站', address: '上海市嘉定区安亭镇安拓路56弄20幢' },
  ];

  // 4. insert source into target
  const tasks = manus.map(
    info =>
      new Promise(resolve => {
        const wallet = fromRandom();
        const { pk, sk, address } = wallet.toJSON();
        info.publicKey = pk;
        info.secretKey = sk;
        info.address = address;
        const location = new Location(info);

        location.save(err => {
          (err ? console.error : console.log)(
            `insert location ${err ? 'failed' : 'success'}`,
            JSON.stringify({ info, err })
          );
          resolve(location);
        });
      })
  );

  Promise.all(tasks)
    .then(() => {
      console.log('Location list initialize completed');
      done();
    })
    .catch(e => {
      console.error('Location list initialize failed', e);
      done();
    });
};
