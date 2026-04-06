import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import { FiArrowRight, FiShoppingBag, FiShield, FiStar } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Furniture', 'Sports', 'Other'];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProducts({ limit: 8, page: 1 });
        setFeaturedProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
            India's Trusted Marketplace
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-5 leading-tight">
            Buy & Sell with <span className="text-yellow-300">Confidence</span>
          </h1>
          <p className="text-sky-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover thousands of products from verified sellers. Safe, transparent, and easy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products"
              className="bg-white text-sky-600 font-bold px-8 py-3.5 rounded-xl hover:bg-sky-50 transition flex items-center gap-2 justify-center">
              <FiShoppingBag /> Browse Products
            </Link>
            <Link to="/register"
              className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition flex items-center gap-2 justify-center">
              Start Selling <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { label: 'Products Listed', value: '10,000+' },
            { label: 'Happy Buyers', value: '5,000+' },
            { label: 'Verified Sellers', value: '1,200+' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-sky-600 font-display">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display">Shop by Category</h2>
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES.map(cat => (
            <Link key={cat} to={`/products?category=${cat}`}
              className="px-5 py-2.5 bg-sky-50 text-sky-700 font-semibold rounded-xl hover:bg-sky-100 transition border border-sky-100">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 font-display">Featured Products</h2>
          <Link to="/products" className="text-sky-500 font-semibold hover:underline flex items-center gap-1">
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <FiShoppingBag className="text-5xl mx-auto mb-3" />
            <p>No products available yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Why Us */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10 font-display">Why BazaarHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FiShield className="text-3xl text-sky-500" />, title: 'Admin Verified', desc: 'Every product is reviewed and approved by our admin team before it goes live.' },
              { icon: <FiStar className="text-3xl text-yellow-500" />, title: 'Quality Sellers', desc: 'We partner with trusted sellers to ensure you get genuine products.' },
              { icon: <FiShoppingBag className="text-3xl text-green-500" />, title: 'Easy to Use', desc: 'Simple interface to browse, contact sellers, and purchase with confidence.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;