const express = require('express');
const router = express.Router();
const {
  getAllProducts, approveProduct, rejectProduct,
  getAllUsers, deleteUser, getStats, adminDeleteProduct
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/products', getAllProducts);
router.put('/products/:id/approve', approveProduct);
router.put('/products/:id/reject', rejectProduct);
router.delete('/products/:id', adminDeleteProduct);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;