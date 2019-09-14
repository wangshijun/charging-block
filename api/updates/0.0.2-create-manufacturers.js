/* eslint no-console:"off" */
const keystone = require('keystone');
const { fromRandom } = require('@arcblock/forge-wallet');

const Manufacturer = keystone.list('Manufacturer').model;

module.exports = done => {
  const manus = [
    { name: '富电科技', address: '中国上海市延安东路222号' },
    { name: '普天新能源', address: '上海市静安区铜仁路299号47楼' },
    { name: '万马', address: '上海市嘉定区安亭镇安拓路56弄20幢' },
    { name: '国电南瑞', address: '上海市浦东新区海科路99号' },
    { name: '深圳金宏威', address: '中国上海市闵行区顾戴路108号' },
    { name: '山东鲁能', address: '中国上海市浦东新区世纪公园银霄路393号' },
    { name: '深圳聚电', address: '中国陕西北路33号' },
    { name: '特斯拉', address: '上海市浦东新区花木路1378号浦东嘉里中心L139' },
    { name: '依威能源', address: '中国上海市闵行区沪星路289号' },
    { name: '国网普瑞特', address: '中国上海市青浦区沪青平公路1815号' },
    { name: '江苏银河同智', address: '中国上海市闵行区天山西路2666号' },
    { name: '上海一电集团', address: '中国上海市徐汇区船厂路183号' },
    { name: '北京昊瑞昌科技', address: '中国上海市长宁区水城南路268号' },
    { name: '深圳国电科技', address: '中国上海市静安区长寿路943-951号' },
    { name: '比亚迪', address: '中国上海市浦东新区世纪公园浦建路1138号' },
    { name: '南方电力集团', address: '中国上海市杨浦区军工路1599号' },
    { name: '东方电子', address: '中国上海市松江区新效路128号' },
    { name: '车电网', address: '中国上海市杨浦区民庆路208号' },
  ];

  // 4. insert source into target
  const tasks = manus.map(
    info =>
      new Promise(resolve => {
        const wallet = fromRandom();
        const { pk, sk } = wallet.toJSON();
        info.publicKey = pk;
        info.secretKey = sk;
        const manufacturer = new Manufacturer(info);

        manufacturer.save(err => {
          (err ? console.error : console.log)(
            `insert manufacturer ${err ? 'failed' : 'success'}`,
            JSON.stringify({ info, err })
          );
          resolve(manufacturer);
        });
      })
  );

  Promise.all(tasks)
    .then(() => {
      console.log('manufacturer list initialize completed');
      done();
    })
    .catch(e => {
      console.error('manufacturer list initialize failed', e);
      done();
    });
};
