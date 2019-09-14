/* eslint no-console:"off" */
const keystone = require('keystone');
const { poles } = require('./data');

const ChargingPole = keystone.list('ChargingPole').model;
const CarModel = keystone.list('CarModel').model;
const Manufacturer = keystone.list('Manufacturer').model;
const Supplier = keystone.list('Supplier').model;
const Location = keystone.list('Location').model;

const random = (lists = []) => {
  if (lists.length === 0) {
    return null;
  }

  const index = Math.ceil(Math.random() * (lists.length - 1));
  return lists[index];
};

module.exports = done => {
  // 4. insert source into target
  Promise.all([CarModel.find().select('model'), Manufacturer.find(), Supplier.find(), Location.find()]).then(
    ([carModels, manufacturers, suppliers, locations]) => {
      const models = carModels.map(x => x.model);
      const tasks = poles.map(
        info =>
          new Promise(resolve => {
            info.description = info.address;
            info.price = (1.2 + Math.random()).toFixed(2);
            info.power = parseInt(90 + 50 * Math.random(), 10);

            const start = Math.floor(Math.random() * models.length);
            info.supportedCarModels = models.slice(start, 2 + start * Math.ceil(Math.random() * 10));
            info.manufacturer = random(manufacturers);
            info.location = random(locations);
            info.supplier = random(suppliers);

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
    }
  );
};
