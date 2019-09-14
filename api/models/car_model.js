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
  model: {
    type: types.Text,
    label: '车型',
    required: true,
    initial: true,
  },
  subModel: {
    type: types.Text,
    label: '子型号',
    required: true,
    initial: true,
  },
  brand: {
    type: types.Text,
    label: '品牌',
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

CarModel.defaultColumns = 'model, subModel, brand, createdAt, updatedAt';
CarModel.register();
