import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('marketplaceUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Product APIs (Public)
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);

// Product APIs (Seller)
export const createProduct = (formData) =>
  API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyProducts = () => API.get('/products/seller/my-products');
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Admin APIs
export const adminGetAllProducts = (status) => API.get('/admin/products', { params: { status } });
export const adminApproveProduct = (id) => API.put(`/admin/products/${id}/approve`);
export const adminRejectProduct = (id) => API.put(`/admin/products/${id}/reject`);
export const adminDeleteProduct = (id) => API.delete(`/admin/products/${id}`);
export const adminGetAllUsers = () => API.get('/admin/users');
export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`);
export const adminGetStats = () => API.get('/admin/stats');

export default API;