/* eslint no-console:"off" */
const keystone = require('keystone');
const poles = require('./charging-poles-data');

const ChargingPole = keystone.list('ChargingPole').model;
const carModels = [
  'Tesla',
  '小鹏',
  '比亚迪',
  '威马',
  '广汽新能源',
  '蔚来',
  '北汽新能源',
  '捷豹',
  '几何汽车',
  '天际',
  '吉利',
  '江淮',
  '野马',
  '腾势',
  '长安',
  '云度',
  '上汽荣威',
  '东风风行',
  '广汽三菱',
];

module.exports = done => {
  // 4. insert source into target
  const tasks = poles.map(
    info =>
      new Promise(resolve => {
        info.name = `${info.address}充电桩`;
        info.description = `${info.address}充电桩`;
        info.price = (1.2 + Math.random()).toFixed(2);
        info.power = parseInt(90 + 50 * Math.random(), 10);
        const start = Math.floor(Math.random() * carModels.length) + 2;
        info.supportedCarModels = carModels.slice(start, start * Math.ceil(Math.random() * 10));

        const chargingPole = new ChargingPole(info);

        chargingPole.save(err => {
          (err ? console.error : console.log)(
            `insert ChargingPole ${err ? 'failed' : 'success'}`,
            JSON.stringify({ info, err })
          );

          resolve(chargingPole);
        });
      })
  );

  Promise.all(tasks)
    .then(() => {
      console.log('ChargingPole list initialize completed');
      done();
    })
    .catch(e => {
      console.error('ChargingPole list initialize failed', e);
      done();
    });
};
