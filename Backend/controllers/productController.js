const Product = require('../models/Product');

// @route GET /api/products - Get all approved products (public)
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'approved' };

    if (category && category !== 'All') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/:id - Get single product (public)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email phone');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.status !== 'approved') return res.status(403).json({ message: 'Product not available' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/products - Create product (seller only)
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock, contactEmail, contactPhone } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 1,
      contactEmail,
      contactPhone,
      image: `/uploads/${req.file.filename}`,
      seller: req.user._id,
      status: 'pending'
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/seller/my-products - Get seller's own products
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/products/:id - Update own product (seller)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const { title, description, price, category, stock, contactEmail, contactPhone } = req.body;
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;
    product.stock = stock ? Number(stock) : product.stock;
    product.contactEmail = contactEmail || product.contactEmail;
    product.contactPhone = contactPhone || product.contactPhone;
    product.status = 'pending'; // re-approve after update

    if (req.file) product.image = `/uploads/${req.file.filename}`;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/products/:id - Delete own product (seller)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, getMyProducts, updateProduct, deleteProduct };