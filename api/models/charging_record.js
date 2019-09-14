const keystone = require('keystone');

const types = keystone.Field.Types;

const ChargingRecord = new keystone.List('ChargingRecord', {
  label: '充电记录',
  plural: '充电记录',
  track: true,
  searchFields: 'carDid chargingPole',
  defaultSort: '-createdAt',
  schema: { collection: 'charging-records' },
});

ChargingRecord.add({
  carDid: {
    type: types.Text,
    label: '车DID',
    required: true,
    initial: true,
  },
  chargingPoleDid: {
    type: types.Text,
    label: '充电桩DID',
    required: true,
    initial: true,
  },
  chargingPole: {
    type: types.Relationship,
    ref: 'ChargingPole',
    label: '充电桩',
    required: true,
    initial: true,
  },
  status: {
    type: types.Text,
    label: '状态',
    default: 'charing',
    required: true,
    initial: true,
  },
  connectedAt: {
    type: types.Datetime,
    label: '开始充电时间',
    required: true,
    initial: true,
  },
  disconnectedAt: {
    type: types.Datetime,
    label: '结束充电时间',
  },
});

ChargingRecord.defaultColumns = 'model, subModel, brand, createdAt, updatedAt';
ChargingRecord.register();
