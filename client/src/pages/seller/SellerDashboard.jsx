import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProducts, deleteProduct } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', icon: <FiClock /> },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: <FiCheckCircle /> },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-600', icon: <FiXCircle /> },
};

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchProducts = async () => {
    try {
      const { data } = await getMyProducts();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const filtered = filter === 'all' ? products : products.filter(p => p.status === filter);

  const stats = {
    total: products.length,
    approved: products.filter(p => p.status === 'approved').length,
    pending: products.filter(p => p.status === 'pending').length,
    rejected: products.filter(p => p.status === 'rejected').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-display">My Products</h1>
          <p className="text-gray-500 mt-1">Manage your listed products</p>
        </div>
        <Link to="/seller/add-product"
          className="flex items-center gap-2 bg-sky-500 text-white px-5 py-2.5 rounded-xl hover:bg-sky-600 transition font-semibold">
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Approved', value: stats.approved, color: 'bg-green-50 text-green-700' },
          { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'approved', 'pending', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${
              filter === f ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-sky-50'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FiPackage className="text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">No products found</h3>
          <Link to="/seller/add-product" className="text-sky-500 font-semibold mt-2 inline-block hover:underline">
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(product => {
            const status = STATUS_CONFIG[product.status];
            return (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Img'; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-800 text-lg truncate">{product.title}</h3>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">{product.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="font-bold text-gray-700">₹{product.price.toLocaleString()}</span>
                    <span className="text-gray-400">Stock: {product.stock}</span>
                    <span className="text-gray-400">{product.category}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link to={`/seller/edit-product/${product._id}`}
                    className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition">
                    <FiEdit2 />
                  </Link>
                  <button onClick={() => handleDelete(product._id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;