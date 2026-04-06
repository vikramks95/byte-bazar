import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiShoppingCart, FiPhone, FiTag, FiUser } from 'react-icons/fi';
import ContactModal from './ContactModal';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/products/${product._id}`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
        {/* Image */}
        <div className="relative overflow-hidden h-52">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
          />
          <div className="absolute top-3 left-3">
            <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {product.category}
            </span>
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">{product.title}</h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
            <FiUser className="text-xs" />
            <span>{product.seller?.name}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <FiTag className="text-sky-500" />
              <span className="text-2xl font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-semibold transition text-sm"
            >
              <FiShoppingCart />
              {user ? 'Buy Now' : 'Login to Buy'}
            </button>
            <button
              onClick={() => setShowContact(true)}
              className="flex items-center justify-center gap-1 border border-sky-500 text-sky-500 hover:bg-sky-50 px-3 py-2.5 rounded-xl transition text-sm font-medium"
            >
              <FiPhone />
              <span className="hidden sm:inline">Contact</span>
            </button>
          </div>
        </div>
      </div>

      {showContact && (
        <ContactModal product={product} onClose={() => setShowContact(false)} user={user} />
      )}
    </>
  );
};

export default ProductCard;