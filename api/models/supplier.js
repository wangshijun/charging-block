const keystone = require('keystone');

const types = keystone.Field.Types;

const Supplier = new keystone.List('Supplier', {
  label: '电网',
  plural: '电网',
  track: true,
  searchFields: 'name address publicKey secretKey',
  defaultSort: '-createdAt',
  schema: { collection: 'suppliers' },
});

Supplier.add({
  name: {
    type: types.Text,
    label: '名称',
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

Supplier.defaultColumns = 'name, address, publicKey, createdAt, updatedAt';
Supplier.register();
