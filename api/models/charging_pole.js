const keystone = require('keystone');

const types = keystone.Field.Types;

const ChargingPole = new keystone.List('ChargingPole', {
  label: '充电桩',
  plural: '充电桩',
  track: true,
  searchFields: 'name owner',
  defaultSort: '-createdAt',
  schema: { collection: 'charging_poles' },
});

ChargingPole.add({
  name: {
    type: types.Text,
    label: '名字',
    required: true,
    initial: true,
  },
  description: {
    type: types.Text,
    label: '描述',
    required: true,
    initial: true,
  },
  address: { type: types.Text, label: '地址', required: false },
  latitude: { type: types.Number, label: '维度', required: false },
  longitude: { type: types.Number, label: '经度', required: false },
  price: { type: types.Number, label: '单价（度）', required: false },
  power: { type: types.Number, label: '功率（A）', required: false },
  supportedCarModels: { type: types.TextArray, label: '兼容的车型', required: false },
  connectedCars: { type: types.TextArray, label: '绑定的车' },

  operator: {
    type: types.Text,
    size: 'small',
    label: '桩主',
    index: true,
  },
  claimHash: {
    type: types.Text,
    size: 'small',
    label: '初始化 Tx',
    index: true,
  },
  manufacturer: {
    type: types.Relationship,
    ref: 'Manufacturer',
    label: '制造商',
    index: true,
  },
  location: {
    type: types.Relationship,
    ref: 'Location',
    label: '场地',
    index: true,
  },
  supplier: {
    type: types.Relationship,
    ref: 'Supplier',
    label: '电网',
    index: true,
  },
  did: {
    type: types.Text,
    label: 'DID',
    default: '',
  },
});

ChargingPole.defaultColumns =
  'name, latitude, longitude, address, owner, manufacturer, location, supplier, createdAt, updatedAt';
ChargingPole.register();
