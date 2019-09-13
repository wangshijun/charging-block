const keystone = require('keystone');
const types = keystone.Field.Types;

const ChargingPole = new keystone.List('ChargingPole', {
  label: '充电桩',
  plural: '充电桩',
  track: true,
  noedit: true,
  nodelete: true,
  map: { name: 'did' },
  searchFields: 'did name email',
  defaultSort: '-createdAt',
  schema: { collection: 'charging_poles' },
});

ChargingPole.add({
  did: {
    type: types.Text,
    label: '用户ID',
    required: true,
    initial: true,
  },
  name: { type: types.Text, label: '用户名', required: false },
  email: { type: types.Text, label: '邮箱', required: false },
});

ChargingPole.defaultColumns = 'did, name, email, createdAt, updatedAt';
ChargingPole.register();
