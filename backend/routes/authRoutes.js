const router = require('express').Router();
const { register, login, me, updateMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, me);
router.patch('/me', protect, updateMe);

module.exports = router;
