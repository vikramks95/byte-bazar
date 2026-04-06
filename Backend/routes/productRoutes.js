const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, createProduct,
  getMyProducts, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect, isSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Seller routes
router.post('/', protect, isSeller, upload.single('image'), createProduct);
router.get('/seller/my-products', protect, isSeller, getMyProducts);
router.put('/:id', protect, isSeller, upload.single('image'), updateProduct);
router.delete('/:id', protect, isSeller, deleteProduct);

module.exports = router;