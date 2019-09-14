/* eslint-disable no-console */
const keystone = require('keystone');
// const ForgeSDK = require('@arcblock/forge-sdk');

const ChargingPole = keystone.list('ChargingPole').model;

module.exports = {
  init(app) {
    // list charging pole
    app.get('/api/chargingPoles', async (req, res) => {
      const dbPoles = await ChargingPole.find();
      if (!Array.isArray(dbPoles) || dbPoles.length === 0) {
        res.json({ chargingPoles: [] });
      }

      const size = 20;
      const length = Math.floor(Math.random() * size) + 1;
      const start = Math.floor(Math.random() * dbPoles.length);
      const randomPoles = dbPoles.slice(start, start + length);
      const poles = randomPoles
        .map(pole => {
          const tmp = pole.toObject();
          tmp.distance = 100 + parseInt(Math.random() * 5 * 1000, 10);
          return tmp;
        })
        .sort((x, y) => x.distance - y.distance);

      res.json({ chargingPoles: poles });
    });

    // Register charging pole
    app.post('/api/chargingPoles', async (req, res) => {
      try {
        const chargingPole = new ChargingPole(req.body);
        const result = await chargingPole.save();
        console.log('initialize charing pole', result);
        res.status(200).json(chargingPole.toJSON());
      } catch (err) {
        res.status(500).jsonp({ error: 'Cannot initialize charging pole' });
      }
    });
  },
};
