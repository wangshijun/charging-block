const keystone = require('keystone');

const ChargingRecord = keystone.list('ChargingRecord').model;
const ChargingPole = keystone.list('ChargingPole').model;

module.exports = {
  init(app) {
    app.get('/api/charging/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const record = await ChargingRecord.findById(id);
        if (!record) {
          return res.status(400).json(`Record ${id} not found`);
        }

        return res.json(record);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'get charging failed' });
      }
    });

    app.put('/api/charging/:id/disconnect', async (req, res) => {
      try {
        const { id } = req.params;
        const record = await ChargingRecord.findById(id);
        if (!record) {
          return res.status(400).json(`Record ${id} not found`);
        }

        if (record.status === 'finished') {
          return res.json(record);
        }

        await record.update({ status: 'finished', disconnectedAt: new Date() });
        const tmp = await ChargingPole.update({}, { $set: { status: 'idle' } }, { multi: true });
        console.log('----');
        console.log(tmp);
        const result = await ChargingRecord.findById(record._id); // eslint-disable-line
        return res.json(result);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'disconnect charging failed' });
      }
    });

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
          return res.json({ error: 'Current is charging', status: 400 });
        }

        if (!chargingPole) {
          return res.status(400).json(`Charging pole ${chargingPoleDid} is not found`);
        }

        const record = new ChargingRecord({
          chargingPoleDid: chargingPole.did,
          chargingPole,
          status: 'charging',
          connectedAt: new Date(),
          carDid,
        });

        await record.save();
        const tmp = await ChargingPole.update({}, { $set: { status: 'charging' } }, { multi: true });
        console.log('----');
        console.log(tmp);

        return res.json(record);
      } catch (err) {
        console.error('api.charging.error', err);
        return res.status(500).json({ error: 'charging failed' });
      }
    });
  },
};
