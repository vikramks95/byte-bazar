import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/buyer/Home';
import Products from './pages/buyer/Products';
import ProductDetail from './pages/buyer/ProductDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddEditProduct from './pages/seller/AddEditProduct';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Seller Routes */}
              <Route path="/seller/dashboard" element={
                <ProtectedRoute roles={['seller']}>
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/seller/add-product" element={
                <ProtectedRoute roles={['seller']}>
                  <AddEditProduct />
                </ProtectedRoute>
              } />
              <Route path="/seller/edit-product/:id" element={
                <ProtectedRoute roles={['seller']}>
                  <AddEditProduct />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="text-center py-20">
                  <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
                  <p className="text-gray-500">Page not found</p>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      </Router>
    </AuthProvider>
  );
}

export default App;