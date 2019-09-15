/* eslint-disable no-console */
const keystone = require('keystone');
// const ForgeSDK = require('@arcblock/forge-sdk');

const ChargingPole = keystone.list('ChargingPole').model;

module.exports = {
  init(app) {
    // Get charging pole
    app.get('/api/chargingPoles/:id', async (req, res) => {
      try {
        const pole = await ChargingPole.findById(req.params.id);
        res.status(200).json(pole);
      } catch (err) {
        res.status(500).jsonp({ error: 'Cannot initialize charging pole' });
      }
    });

    // list charging pole
    app.get('/api/chargingPoles', async (req, res) => {
      try {
        const dbPoles = await ChargingPole.find({ did: { $not: { $eq: '' } } }).sort({ createdAt: -1 });
        if (!Array.isArray(dbPoles) || dbPoles.length === 0) {
          return res.json({ chargingPoles: [] });
        }

        const size = 10;
        const length = Math.floor(Math.random() * size) + 10;
        const start = Math.floor(Math.random() * dbPoles.length);
        const latestPole = dbPoles.shift().toObject();
        const randomPoles = dbPoles.slice(start, start + length);
        const poles = randomPoles
          .map(pole => {
            const tmp = pole.toObject();
            tmp.distance = 100 + parseInt(Math.random() * 5 * 1000, 10);
            return tmp;
          })
          .sort((x, y) => x.distance - y.distance);

        latestPole.distance = 100;
        poles.unshift(latestPole);

        return res.json(poles);
      } catch (error) {
        console.error(error);
        return res.status(500).jsonp({ error: 'Get charging poles failed' });
      }
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
