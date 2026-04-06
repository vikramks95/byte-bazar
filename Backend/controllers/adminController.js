const Product = require('../models/Product');
const User = require('../models/User');

// @route GET /api/admin/products - Get all products (admin)
const getAllProducts = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const products = await Product.find(query)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/products/:id/approve
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.status = 'approved';
    await product.save();
    res.json({ message: 'Product approved successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/products/:id/reject
const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.status = 'rejected';
    await product.save();
    res.json({ message: 'Product rejected', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/users - Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/users/:id - Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/stats - Dashboard stats
const getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: 'pending' });
    const approvedProducts = await Product.countDocuments({ status: 'approved' });
    const rejectedProducts = await Product.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });

    res.json({
      totalProducts, pendingProducts, approvedProducts, rejectedProducts,
      totalUsers, totalSellers, totalBuyers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/products/:id - Admin delete any product
const adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllProducts, approveProduct, rejectProduct, getAllUsers, deleteUser, getStats, adminDeleteProduct };