/* eslint-disable no-console */
const keystone = require('keystone');
// const ForgeSDK = require('@arcblock/forge-sdk');

const ChargingPole = keystone.list('ChargingPole').model;

module.exports = {
  init(app) {
    // list charging pole
    app.get('/api/chargingPoles', async (req, res) => {
      res.json({ chargingPoles: [] });
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
