const keystone = require('keystone');

const types = keystone.Field.Types;

const Transaction = new keystone.List('Transaction', {
  label: '交易',
  plural: '交易',
  track: true,
  noedit: true,
  nodelete: true,
  searchFields: 'name address publicKey secretKey',
  defaultSort: '-createdAt',
  schema: { collection: 'transactions' },
});

Transaction.add({
  chargingPole: {
    type: types.Relationship,
    ref: 'ChargingPole',
    size: 'small',
    label: '充电桩',
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
  amount: {
    type: types.Number,
    label: '支付金额',
    required: true,
    initial: true,
  },
  carDid: {
    type: types.Text,
    label: '车的 DID',
    required: true,
    initial: true,
  },
  carOwnerDid: {
    type: types.Text,
    label: '车主 DID',
    required: true,
    initial: true,
  },
});

Transaction.defaultColumns = 'chargingPole, supplier, location, amount, carDid, carOwnerDid, updatedAt';
Transaction.register();
