const keystone = require('keystone');

const Location = keystone.list('Location').model;
const Supplier = keystone.list('Supplier').model;
const CarModel = keystone.list('CarModel').model;

module.exports = {
  init(app) {
    // list transaction by charging pole
    app.get('/api/meta', async (req, res) => {
      const locations = await Location.find({});
      const suppliers = await Supplier.find({});
      const models = await CarModel.find({});
      res.json({ locations, suppliers, models });
    });
  },
};
