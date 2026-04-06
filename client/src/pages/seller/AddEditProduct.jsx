import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getMyProducts } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Furniture', 'Sports', 'Other'];

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Electronics',
    stock: '', contactEmail: '', contactPhone: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await getMyProducts();
          const product = data.find(p => p._id === id);
          if (product) {
            setForm({
              title: product.title, description: product.description,
              price: product.price, category: product.category, stock: product.stock,
              contactEmail: product.contactEmail || '', contactPhone: product.contactPhone || ''
            });
            setImagePreview(`http://localhost:5000${product.image}`);
          }
        } catch (err) { toast.error('Failed to load product'); }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !image) return toast.error('Please select a product image');

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append('image', image);

    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(id, formData);
        toast.success('Product updated! Awaiting admin approval.');
      } else {
        await createProduct(formData);
        toast.success('Product submitted! Awaiting admin approval.');
      }
      navigate('/seller/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/seller/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-sky-500 mb-6 transition">
        <FiArrowLeft /> Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 font-display mb-6">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-sky-300 transition cursor-pointer"
              onClick={() => document.getElementById('imageInput').click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <div className="py-8">
                  <FiUpload className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400">Click to upload image</p>
                  <p className="text-gray-300 text-xs mt-1">JPG, PNG, WEBP up to 5MB</p>
                </div>
              )}
              <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              placeholder="e.g. iPhone 15 Pro"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              placeholder="Describe your product in detail..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none" />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0"
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity *</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0"
                placeholder="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
              <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
              <input type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
            ⚠️ Your product will be reviewed by admin before going live on the marketplace.
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white py-3.5 rounded-xl font-bold transition text-lg">
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Submit Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;