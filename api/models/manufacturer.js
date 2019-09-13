const keystone = require('keystone');

const types = keystone.Field.Types;

const Manufacturer = new keystone.List('Manufacturer', {
  label: '制造商',
  plural: '制造商',
  track: true,
  searchFields: 'name address publicKey secretKey',
  defaultSort: '-createdAt',
  schema: { collection: 'manufacturers' },
});

Manufacturer.add({
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

Manufacturer.defaultColumns = 'name, address, publicKey, createdAt, updatedAt';
Manufacturer.register();
