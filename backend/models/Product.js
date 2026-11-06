const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  description: String,

  category: String,

  price: {
    type: Number,
    required: true
  },

  originalPrice: Number,

  images: [String],

  colours: [String],

  sizes: [String],

  rating: {
    type: Number,
    default: 0
  },

  stock: {
    type: Number,
    default: 0
  },

  isNewArrival: {
    type: Boolean,
    default: false
  },

  isBestSeller: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);