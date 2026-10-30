const mongoose = require('mongoose');
const { CATEGORIES } = require('../utils/constants');

// NOTE: the brief asked for "isNew", but Mongoose reserves that name on documents,
// so this project uses "isNewArrival" instead.
const productSchema = new mongoose.Schema(
  {
    sku: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 1000 },
    category: { type: String, required: true, enum: CATEGORIES },
    subcategory: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    originalPrice: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    colours: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('discountPercent').get(function () {
  return this.originalPrice > this.price ? Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100) : 0;
});

productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
