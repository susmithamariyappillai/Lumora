
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

const {
  CANCELLABLE,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  RETURN_WINDOW_DAYS,
  MAX_QTY_PER_LINE,
} = require('../utils/constants');

const bad = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });

const makeOrderNumber = () =>
  `LUM-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

// Build order items using actual database prices
async function buildLines(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'Your cart is empty.' };
  }

  if (items.length > 30) {
    return { error: 'Too many items in one order.' };
  }

  const slugs = [...new Set(items.map((i) => String(i.slug || '')))];
  const products = await Product.find({
    slug: { $in: slugs },
    isActive: true,
  });

  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const qtyPerProduct = {};
  const lines = [];

  for (const item of items) {
    const p = bySlug[item.slug];

    if (!p) {
      return { error: 'One of the products in your cart is no longer available.' };
    }

    const qty = Number(item.qty);

    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
      return { error: `Invalid quantity for ${p.name}.` };
    }

    const size = String(item.size || '');
    const colour = String(item.colour || '');

    if (p.sizes.length && !p.sizes.includes(size)) {
      return { error: `Please choose a valid size for ${p.name}.` };
    }

    if (colour && p.colours.length && !p.colours.includes(colour)) {
      return { error: `Invalid colour for ${p.name}.` };
    }

    qtyPerProduct[p.slug] = (qtyPerProduct[p.slug] || 0) + qty;

    if (qtyPerProduct[p.slug] > p.stock) {
      return {
        error: `Only ${p.stock} left in stock for ${p.name}.`,
        status: 409,
      };
    }

    lines.push({
      product: p._id,
      name: p.name,
      slug: p.slug,
      image: p.images[0] || '',
      price: p.price,
      qty,
      size,
      colour,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return {
    lines,
    subtotal,
    shippingCost,
    totalPrice: subtotal + shippingCost,
  };
}

// Reserve product stock
async function reserveStock(lines) {
  const taken = [];

  for (const line of lines) {
    const result = await Product.updateOne(
      { _id: line.product, stock: { $gte: line.qty } },
      { $inc: { stock: -line.qty } }
    );

    if (result.modifiedCount !== 1) {
      await restoreStock(taken);
      return false;
    }

    taken.push(line);
  }

  return true;
}

const restoreStock = (lines) =>
  Promise.all(
    lines.map((line) =>
      Product.updateOne(
        { _id: line.product },
        { $inc: { stock: line.qty } }
      )
    )
  );

const addHistory = (order, status, note = '') => {
  order.orderStatus = status;
  order.statusHistory.push({ status, note });
};

// Validate delivery address
const validateAddress = (address = {}) => {
  const value = (key) => String(address[key] || '').trim();

  const output = {
    fullName: value('fullName'),
    email: value('email').toLowerCase(),
    phone: value('phone'),
    address: value('address'),
    city: value('city'),
    state: value('state'),
    postalCode: value('postalCode'),
  };

  if (output.fullName.length < 2) {
    return { error: 'Please enter your full name.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(output.email)) {
    return { error: 'Please enter a valid email.' };
  }

 
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(output.email)) {
  return { error: 'Please enter a valid email.' };
}


  if (output.address.length < 5) {
    return { error: 'Please enter your full address.' };
  }

  if (output.city.length < 2 || output.state.length < 2) {
    return { error: 'Please enter city and state.' };
  }

  if (!/^\d{6}$/.test(output.postalCode)) {
    return { error: 'Postal code must be 6 digits.' };
  }

  return { address: output };
};

// POST /api/orders - COD only
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, idempotencyKey } = req.body;

    if (paymentMethod !== 'COD') {
      return bad(res, 'Only Cash on Delivery is available.');
    }

    const addr = validateAddress(shippingAddress);

    if (addr.error) {
      return bad(res, addr.error);
    }

    const key =
      typeof idempotencyKey === 'string'
        ? idempotencyKey.slice(0, 80)
        : undefined;

    if (key) {
      const existing = await Order.findOne({
        user: req.user._id,
        idempotencyKey: key,
      });

      if (existing) {
        return res.json({
          success: true,
          order: existing,
          duplicate: true,
        });
      }
    }

    const built = await buildLines(items);

    if (built.error) {
      return bad(res, built.error, built.status || 400);
    }

    if (!(await reserveStock(built.lines))) {
      return bad(
        res,
        'Sorry, an item just went out of stock. Please review your cart.',
        409
      );
    }

    try {
      const order = new Order({
        orderNumber: makeOrderNumber(),
        user: req.user._id,
        idempotencyKey: key,
        orderItems: built.lines,
        shippingAddress: addr.address,
        paymentMethod: 'COD',
        subtotal: built.subtotal,
        shippingCost: built.shippingCost,
        totalPrice: built.totalPrice,
        stockReduced: true,
        paymentStatus: 'Pending',
      });

      addHistory(order, 'Confirmed', 'Order placed (Cash on Delivery)');

      await order.save();

      return res.status(201).json({ success: true, order });
    } catch (error) {
      await restoreStock(built.lines);
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Legacy online-payment endpoints are disabled
exports.verifyPayment = async (req, res) =>
  bad(res, 'Online payment is not available. Please choose Cash on Delivery.', 410);

exports.paymentFailed = async (req, res) =>
  bad(res, 'Online payment is not available.', 410);

// GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return bad(res, 'Order not found.', 404);
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return bad(res, 'Order not found.', 404);
    }

    if (!CANCELLABLE.includes(order.orderStatus)) {
      return bad(
        res,
        `An order that is ${order.orderStatus.toLowerCase()} cannot be cancelled.`,
        409
      );
    }

    if (order.stockReduced) {
      await restoreStock(order.orderItems);
      order.stockReduced = false;
    }

    addHistory(order, 'Cancelled', 'Cancelled by customer');

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders/:id/return
exports.requestReturn = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return bad(res, 'Order not found.', 404);
    }

    if (order.orderStatus !== 'Delivered') {
      return bad(res, 'Only delivered orders can be returned.', 409);
    }

    const days =
      (Date.now() -
        new Date(order.deliveredAt || order.updatedAt).getTime()) /
      86400000;

    if (days > RETURN_WINDOW_DAYS) {
      return bad(
        res,
        `The ${RETURN_WINDOW_DAYS}-day return window has ended for this order.`,
        409
      );
    }

    const reason = String(req.body.reason || '').trim();

    if (reason.length < 5) {
      return bad(
        res,
        'Please tell us why you want to return this order (at least 5 characters).'
      );
    }

    order.returnReason = reason.slice(0, 500);

    addHistory(order, 'Return Requested', reason.slice(0, 500));

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

exports.restoreStock = restoreStock;
