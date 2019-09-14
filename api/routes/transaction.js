// const keystone = require('keystone');
// const ForgeSDK = require('@arcblock/forge-sdk');

module.exports = {
  init(app) {
    // list transaction by charging pole
    app.get('/api/transactions/chargingPole/:id', async (req, res) => {
      res.json({ transactions: [] });
    });

    // send aggregation transaction
    app.post('/api/transactions', async (req, res) => {
      res.json({ transaction: {} });
    });
  },
};
