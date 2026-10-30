
const mongoose = require('mongoose');
const { ORDER_STATUSES, PAYMENT_STATUSES } = require('../utils/constants');

const itemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    slug: String,
    image: String,
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    size: { type: String, default: '' },
    colour: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    idempotencyKey: { type: String },
    orderItems: { type: [itemSchema], required: true },
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      required: true,
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'Pending',
    },
    statusHistory: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    stockReduced: { type: Boolean, default: false },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deliveredAt: Date,
    returnReason: String,
  },
  { timestamps: true }
);

orderSchema.index(
  { user: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: { $type: 'string' },
    },
  }
);

module.exports = mongoose.model('Order', orderSchema);
