// const keystone = require('keystone');
// const ForgeSDK = require('@arcblock/forge-sdk');

module.exports = {
  init(app) {
    // list charging pole
    app.get('/api/chargingPoles', async (req, res) => {
      res.json({ chargingPoles: [] });
    });

    // Register charging pole
    app.post('/api/chargingPoles', async (req, res) => {
      res.json({ chargingPole: {} });
    });
  },
};
