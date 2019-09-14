/* eslint no-console:"off" */
const keystone = require('keystone');
const { carModels } = require('./data');

const CarModel = keystone.list('CarModel').model;

module.exports = done => {
  // 4. insert source into target
  const tasks = carModels.map(
    info =>
      new Promise(resolve => {
        const carModel = new CarModel(info);

        carModel.save(err => {
          (err ? console.error : console.log)(
            `insert CarModel ${err ? 'failed' : 'success'}`,
            JSON.stringify({ info, err })
          );

          resolve(carModel);
        });
      })
  );

  Promise.all(tasks)
    .then(() => {
      console.log('CarModel list initialize completed');
      done();
    })
    .catch(e => {
      console.error('CarModel list initialize failed', e);
      done();
    });
};
