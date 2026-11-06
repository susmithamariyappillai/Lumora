const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  orderItems: [
    {
      name: String,
      price: Number,
      qty: Number,
      image: String
    }
  ],

  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String
  },

  paymentMethod: {
    type: String,
    default: 'COD'
  },

  paymentStatus: {
    type: String,
    default: 'Pending'
  },

  orderStatus: {
    type: String,
    default: 'Pending'
  },

  totalPrice: {
    type: Number,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);