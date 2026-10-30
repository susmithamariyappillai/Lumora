const router = require('express').Router();
const { getProducts, getCategories, getProduct } = require('../controllers/productController');

// Order matters: fixed paths BEFORE "/:idOrSlug"
router.get('/categories', getCategories);
router.get('/search', getProducts);
router.get('/', getProducts);
router.get('/:idOrSlug', getProduct);

module.exports = router;
