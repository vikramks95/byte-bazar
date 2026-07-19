import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX, FiPackage, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <FiShoppingBag className="text-sky-500 text-2xl" />
            <span className="text-xl font-bold text-gray-800 font-display">BazaarHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-sky-500 transition font-medium">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-sky-500 transition font-medium">Products</Link>

            {!user ? (
              <div className="flex gap-3">
                <Link to="/login" className="px-4 py-2 text-sky-600 border border-sky-500 rounded-lg hover:bg-sky-50 transition font-medium">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium">Sign Up</Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    user.role === 'admin' ? 'bg-red-100 text-red-600' :
                    user.role === 'seller' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {user.role}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                    {user.role === 'seller' && (
                      <>
                        <Link to="/seller/dashboard" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
                          <FiPackage /> My Products
                        </Link>
                        <Link to="/seller/add-product" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
                          <FiSettings /> Add Product
                        </Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
                        <FiSettings /> Admin Panel
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
                      <FiUser /> Profile
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">Products</Link>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sky-600 font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-sky-600 font-medium">Sign Up</Link>
            </>
          ) : (
            <>
              {user.role === 'seller' && (
                <>
                  <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className="block text-gray-700">My Products</Link>
                  <Link to="/seller/add-product" onClick={() => setMenuOpen(false)} className="block text-gray-700">Add Product</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="block text-gray-700">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="block text-red-500 font-medium">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;