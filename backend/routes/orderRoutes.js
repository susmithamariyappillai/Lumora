const router = require('express').Router();

const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Check user login
router.use(protect);

// Create order
router.post('/', orderController.createOrder);

// Get my orders
router.get('/my-orders', orderController.getMyOrders);

// Get single order
router.get('/:id', orderController.getOrder);

// Cancel order
router.post('/:id/cancel', orderController.cancelOrder);

// Return order
router.post('/:id/return', orderController.requestReturn);

module.exports = router;