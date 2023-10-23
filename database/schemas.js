const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
module.exports = [
  {
    name: 'users',
    fields: {
      email: String,
      name: String,
      password: String,
    },
  },
  {
    name: 'products',
    fields: {
      userId: { type: ObjectId, ref: 'users' },
      label: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  },
  {
    name: 'orders',
    fields: {
      userId: { type: ObjectId, ref: 'users' },
      products: [{
        _id: ObjectId,
        label: String,
        image: String,
        price: Number,
        quantity: Number,
      }],
      deliveryData: {
        address: String,
        addressNumber: String,
        cep: String,
        neighborhood: String,
        city: String,
        state: String,
        phoneNumber: String,
        responsible: String,
      },
      billingData: {
        cpf: String,
        address: String,
        addressNumber: String,
        cep: String,
        neighborhood: String,
        city: String,
        state: String,
        phoneNumber: String,
        responsible: String,
      },
      paymentMethod: {
        type: String,
        enum: ['CASH', 'PIX', 'CREDIT_CARD'],
      },
      status: {
        type: String,
        enum: ['PENDING', 'CANCELLED', 'DONE'],
      },
    },
  },
];
