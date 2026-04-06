import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiMail, FiPhone, FiUser, FiLock } from 'react-icons/fi';

const ContactModal = ({ product, onClose, user }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">Contact Seller</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.title}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Img'; }}
          />
          <div>
            <p className="font-semibold text-gray-800">{product.title}</p>
            <p className="text-sky-600 font-bold">₹{product.price.toLocaleString()}</p>
          </div>
        </div>

        {!user ? (
          <div className="text-center py-4">
            <FiLock className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Please login to view seller contact details</p>
            <div className="flex gap-3">
              <button
                onClick={() => { onClose(); navigate('/login'); }}
                className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl font-semibold hover:bg-sky-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => { onClose(); navigate('/register'); }}
                className="flex-1 border border-sky-500 text-sky-500 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <FiUser className="text-blue-500 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Seller Name</p>
                <p className="font-semibold text-gray-800">{product.seller?.name}</p>
              </div>
            </div>
            {(product.contactEmail || product.seller?.email) && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <FiMail className="text-green-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a
                    href={`mailto:${product.contactEmail || product.seller?.email}`}
                    className="font-semibold text-gray-800 hover:text-sky-500 transition"
                  >
                    {product.contactEmail || product.seller?.email}
                  </a>
                </div>
              </div>
            )}
            {(product.contactPhone || product.seller?.phone) && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <FiPhone className="text-orange-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a
                    href={`tel:${product.contactPhone || product.seller?.phone}`}
                    className="font-semibold text-gray-800 hover:text-sky-500 transition"
                  >
                    {product.contactPhone || product.seller?.phone}
                  </a>
                </div>
              </div>
            )}
            {!product.contactEmail && !product.seller?.email && !product.contactPhone && !product.seller?.phone && (
              <p className="text-center text-gray-500 py-2">No contact details provided by seller.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;