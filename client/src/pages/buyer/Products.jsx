import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import { FiSearch, FiFilter, FiShoppingBag } from 'react-icons/fi';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Food', 'Books', 'Furniture', 'Sports', 'Other'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, page]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    params[key] = value;
    if (key !== 'page') params.page = '1';
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-display">All Products</h1>
          <p className="text-gray-500 mt-1">{total} products found</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <button type="submit" className="bg-sky-500 text-white px-4 py-2.5 rounded-xl hover:bg-sky-600 transition">
            <FiSearch />
          </button>
        </form>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => updateParam('category', cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              category === cat
                ? 'bg-sky-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <FiShoppingBag className="text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">No products found</h3>
          <p className="text-sm mt-2">Try a different search or category</p>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => updateParam('page', String(i + 1))}
              className={`w-10 h-10 rounded-xl font-semibold transition ${
                page === i + 1
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-sky-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;