
const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Every order route requires customer login
router.use(protect);

// Create COD order
router.post('/', c.createOrder);

// Customer orders
router.get('/my-orders', c.getMyOrders);
router.get('/:id', c.getOrder);

// Cancel and return
router.post('/:id/cancel', c.cancelOrder);
router.post('/:id/return', c.requestReturn);

module.exports = router;
