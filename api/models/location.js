const keystone = require('keystone');

const types = keystone.Field.Types;

const Location = new keystone.List('Location', {
  label: '电站',
  plural: '电站',
  track: true,
  searchFields: 'name address publicKey secretKey',
  defaultSort: '-createdAt',
  schema: { collection: 'locations' },
});

Location.add({
  name: {
    type: types.Text,
    label: '名字',
    required: true,
    initial: true,
  },
  address: {
    type: types.Text,
    label: '地址',
    required: true,
    initial: true,
  },
  publicKey: {
    type: types.Text,
    label: 'publicKey',
    required: true,
    initial: true,
  },
  secretKey: {
    type: types.Text,
    label: 'secretKey',
    required: true,
    initial: true,
  },
});

Location.defaultColumns = 'name, address, publicKey, createdAt, updatedAt';
Location.register();
