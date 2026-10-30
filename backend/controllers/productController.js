
const Product = require('../models/Product');
const { CATEGORIES } = require('../utils/constants');

const csv = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Build safe MongoDB filter for customer product browsing
const buildFilter = (q) => {
  const filter = { isActive: true };

  const categories = csv(q.category).filter((category) =>
    CATEGORIES.includes(category)
  );

  if (categories.length) {
    filter.category = { $in: categories };
  }

  if (csv(q.sub).length) {
    filter.subcategory = { $in: csv(q.sub) };
  }

  if (csv(q.size).length) {
    filter.sizes = { $in: csv(q.size) };
  }

  if (csv(q.colour).length) {
    filter.colours = { $in: csv(q.colour) };
  }

  if (csv(q.slugs).length) {
    filter.slug = { $in: csv(q.slugs) };
  }

  const min = Number(q.minPrice);
  const max = Number(q.maxPrice);

  if (q.minPrice !== undefined && q.minPrice !== '' && !Number.isNaN(min)) {
    filter.price = { ...filter.price, $gte: min };
  }

  if (q.maxPrice !== undefined && q.maxPrice !== '' && !Number.isNaN(max)) {
    filter.price = { ...filter.price, $lte: max };
  }

  const rating = Number(q.rating);

  if (rating > 0) {
    filter.rating = { $gte: rating };
  }

  if (q.newArrival === 'true') filter.isNewArrival = true;
  if (q.bestSeller === 'true') filter.isBestSeller = true;
  if (q.featured === 'true') filter.isFeatured = true;

  if (q.onSale === 'true') {
    filter.$expr = {
      $gt: ['$originalPrice', '$price'],
    };
  }

  const text = String(q.q || '').trim().slice(0, 80);

  if (text) {
    filter.$and = text.split(/\s+/).map((word) => {
      const regex = new RegExp(escapeRegex(word), 'i');

      return {
        $or: [
          { name: regex },
          { description: regex },
          { subcategory: regex },
          { category: regex },
        ],
      };
    });
  }

  return filter;
};

const SORTS = {
  popularity: { isBestSeller: -1, numReviews: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  newest: { createdAt: -1 },
  rating: { rating: -1, numReviews: -1 },
};

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 12, 1),
      48
    );

    const filter = buildFilter(req.query);
    const sort = SORTS[req.query.sort] || SORTS.popularity;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      products,
      total,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      limit,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/categories
exports.getCategories = async (req, res, next) => {
  try {
    const all = await Product.find({ isActive: true }).select(
      'category subcategory colours sizes'
    );

    const categories = CATEGORIES.map((slug) => {
      const items = all.filter((product) => product.category === slug);
      const subcategories = {};

      items.forEach((product) => {
        subcategories[product.subcategory] =
          (subcategories[product.subcategory] || 0) + 1;
      });

      return {
        slug,
        count: items.length,
        subcategories: Object.entries(subcategories).map(
          ([name, count]) => ({ name, count })
        ),
        colours: [...new Set(items.flatMap((product) => product.colours))],
        sizes: [...new Set(items.flatMap((product) => product.sizes))],
      };
    });

    res.json({
      success: true,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:idOrSlug
exports.getProduct = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isId = /^[a-f\d]{24}$/i.test(idOrSlug);

    const product = await Product.findOne(
      isId
        ? { _id: idOrSlug, isActive: true }
        : { slug: idOrSlug.toLowerCase(), isActive: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

exports.buildFilter = buildFilter;
