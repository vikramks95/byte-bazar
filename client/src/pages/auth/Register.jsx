import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'buyer', phone: '', countryCode: '+91' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'phone') {
      const val = e.target.value.replace(/\D/g, ''); // keep only digits
      setForm({ ...form, phone: val });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    if (!form.phone || !/^\d{10}$/.test(form.phone)) {
      return toast.error('Phone number must be exactly 10 digits!');
    }
    setLoading(true);
    try {

      const { data } = await registerUser({
        name: form.name, email: form.email,
        password: form.password, role: form.role,
        phone: `${form.countryCode} ${form.phone}`
      });
      login(data);
      toast.success(`Account created! Welcome, ${data.name}!`);
      if (data.role === 'seller') navigate('/seller/dashboard');
      else navigate('/');

    } catch (err) {
       console.log("REGISTER ERROR:", err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center">
              <FiShoppingBag className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 font-display">Create Account</h1>
          <p className="text-gray-500 mt-1">Join BazaarHub today</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {['buyer', 'seller'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                form.role === r ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              {r === 'buyer' ? 'I want to Buy' : 'I want to Sell'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                placeholder="Enter your Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white text-gray-700 font-semibold"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+92">🇵🇰 +92</option>
                <option value="+880">🇧🇩 +880</option>
              </select>
              <div className="relative flex-1">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                  maxLength={10} placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white py-3 rounded-xl font-semibold transition text-lg mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-5 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-500 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;