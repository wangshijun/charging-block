const keystone = require('keystone');

const ChargingRecord = keystone.list('ChargingRecord').model;
const ChargingPole = keystone.list('ChargingPole').model;

module.exports = {
  init(app) {
    app.post('/api/charging', async (req, res) => {
      try {
        const { carDid, chargingPoleDid } = req.body;
        if (!carDid) {
          return res.status(400).json('carDid is required');
        }

        if (!chargingPoleDid) {
          return res.status(400).json('chargingPoleDid is required');
        }

        const chargingPole = await ChargingPole.findOne({ did: chargingPoleDid });

        const existedRecord = await ChargingRecord.findOne({ status: 'charging', $or: [{ carDid }, { chargingPole }] });
        if (existedRecord) {
          return res.status(400).json('Current is charging');
        }

        if (!chargingPole) {
          return res.status(400).json(`Charging pole ${chargingPoleDid} is not found`);
        }

        const record = new ChargingRecord({
          chargingPole,
          status: 'charging',
          connectedAt: new Date(),
          carDid,
        });

        await record.save();

        return res.json(record);
      } catch (err) {
        console.error('api.charging.error', err);
        return res.json(null);
      }
    });
  },
};
