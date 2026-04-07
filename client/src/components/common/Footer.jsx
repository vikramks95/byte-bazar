import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiShoppingBag className="text-sky-400 text-2xl" />
          <span className="text-xl font-bold text-white font-display">BazaarHub</span>
        </div>
        <p className="text-sm text-gray-400">Your trusted marketplace to buy and sell products safely.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
        <div className="space-y-2 text-sm">
          <Link to="/" className="block hover:text-sky-400 transition">Home</Link>
          <Link to="/products" className="block hover:text-sky-400 transition">Products</Link>
          <Link to="/register" className="block hover:text-sky-400 transition">Become a Seller</Link>
        </div>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Contact</h4>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2"><FiMail className="text-sky-400" /> support@bazaarhub.com</p>
          <p className="flex items-center gap-2"><FiPhone className="text-sky-400" /> +91 9525882126</p>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
      © {new Date().getFullYear()} BazaarHub. All rights reserved.
    </div>
  </footer>
);

export default Footer;