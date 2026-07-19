import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import ContactModal from '../../components/common/ContactModal';
import { FiTag, FiUser, FiPhone, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
    </div>
  );

  if (!product) return null;

  const handleBuyNow = () => {
    if (!user) {
      toast.info('Please login to purchase this product');
      navigate('/login');
      return;
    }
    toast.success('Purchase initiated! Contact the seller to complete your order.');
    setShowContact(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-sky-500 mb-6 transition">
        <FiArrowLeft /> Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.title}
              className="w-full h-80 md:h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
            />
            <span className="absolute top-4 left-4 bg-sky-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
              {product.category}
            </span>
          </div>

          {/* Details */}
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 font-display mb-3">{product.title}</h1>
            <p className="text-gray-500 mb-5 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <FiTag className="text-sky-500 text-xl" />
              <span className="text-3xl font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6 ${
              product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                  {product.seller?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Sold by</p>
                  <p className="font-semibold text-gray-700">{product.seller?.name}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-bold transition text-lg"
              >
                <FiShoppingCart />
                {user ? 'Buy Now' : 'Login to Buy'}
              </button>
              <button
                onClick={() => setShowContact(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-sky-500 text-sky-500 py-3.5 rounded-xl font-bold hover:bg-sky-50 transition text-lg"
              >
                <FiPhone />
                Contact Seller
              </button>
            </div>

            {!user && (
              <p className="text-center text-gray-400 text-sm mt-3">
                ⚠️ You must be logged in to buy this product
              </p>
            )}
          </div>
        </div>
      </div>

      {showContact && <ContactModal product={product} onClose={() => setShowContact(false)} user={user} />}
    </div>
  );
};

export default ProductDetail;