import React, { useEffect, useState } from 'react';
import { adminGetStats, adminGetAllProducts, adminApproveProduct, adminRejectProduct, adminDeleteProduct } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiPackage, FiUsers, FiCheckCircle, FiXCircle, FiClock, FiTrash2, FiBarChart2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState('');

  const fetchData = async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        adminGetStats(),
        adminGetAllProducts(activeTab === 'all' ? undefined : activeTab)
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleApprove = async (id) => {
    setActionLoading(id + 'approve');
    try {
      await adminApproveProduct(id);
      toast.success('Product approved!');
      fetchData();
    } catch { toast.error('Failed to approve'); }
    finally { setActionLoading(''); }
  };

  const handleReject = async (id) => {
    setActionLoading(id + 'reject');
    try {
      await adminRejectProduct(id);
      toast.warning('Product rejected');
      fetchData();
    } catch { toast.error('Failed to reject'); }
    finally { setActionLoading(''); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this product?')) return;
    try {
      await adminDeleteProduct(id);
      toast.success('Product deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const STATUS_BADGE = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-display">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage products and users</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: stats.totalProducts, icon: <FiPackage />, color: 'bg-blue-50 text-blue-600' },
            { label: 'Pending Review', value: stats.pendingProducts, icon: <FiClock />, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Approved', value: stats.approvedProducts, icon: <FiCheckCircle />, color: 'bg-green-50 text-green-600' },
            { label: 'Total Users', value: stats.totalUsers, icon: <FiUsers />, color: 'bg-purple-50 text-purple-600' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{s.icon}</span>
                <FiBarChart2 className="opacity-30" />
              </div>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-1 opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sub-stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Buyers', value: stats.totalBuyers, color: 'bg-sky-50 text-sky-700' },
            { label: 'Sellers', value: stats.totalSellers, color: 'bg-indigo-50 text-indigo-700' },
            { label: 'Rejected', value: stats.rejectedProducts, color: 'bg-red-50 text-red-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Products Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Product Management</h2>
          <div className="flex gap-2 flex-wrap">
            {['pending', 'approved', 'rejected', 'all'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                  activeTab === tab ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-sky-50'
                }`}>
                {tab} {tab !== 'all' && stats && `(${stats[tab + 'Products'] || 0})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FiPackage className="text-5xl mx-auto mb-3" />
              <p>No products in this category</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map(product => (
                <div key={product._id} className="flex gap-4 items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=Img'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${STATUS_BADGE[product.status]}`}>
                        {product.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{product.description}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>₹{product.price?.toLocaleString()}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>by {product.seller?.name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {product.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(product._id)}
                        disabled={actionLoading === product._id + 'approve'}
                        className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition text-sm font-medium"
                      >
                        <FiCheckCircle />
                        {actionLoading === product._id + 'approve' ? '...' : 'Approve'}
                      </button>
                    )}
                    {product.status !== 'rejected' && (
                      <button
                        onClick={() => handleReject(product._id)}
                        disabled={actionLoading === product._id + 'reject'}
                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition text-sm font-medium"
                      >
                        <FiXCircle />
                        {actionLoading === product._id + 'reject' ? '...' : 'Reject'}
                      </button>
                    )}
                    <button onClick={() => handleDelete(product._id)}
                      className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;