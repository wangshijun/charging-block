const keystone = require('keystone');

const types = keystone.Field.Types;

const CarModel = new keystone.List('CarModel', {
  label: '车型',
  plural: '车型',
  track: true,
  searchFields: 'name ',
  defaultSort: '-createdAt',
  schema: { collection: 'car-models' },
});

CarModel.add({
  name: {
    type: types.Text,
    label: '名字',
    required: true,
    initial: true,
  },
  model: {
    type: types.Text,
    label: '地址',
    required: true,
    initial: true,
  },
  subModel: {
    type: types.Text,
    label: '子型号',
    required: true,
    initial: true,
  },
  endurance: {
    type: types.Number,
    label: '续航',
    required: true,
    initial: true,
  },
});

CarModel.defaultColumns = 'name, address, publicKey, createdAt, updatedAt';
CarModel.register();
