import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiShield, FiArrowLeft, FiEdit2, FiSave, FiX } from 'react-icons/fi';

const parsePhone = (fullPhone) => {
  if (!fullPhone) return { countryCode: '+91', phone: '' };
  const parts = fullPhone.split(' ');
  if (parts.length > 1) {
    return { countryCode: parts[0], phone: parts[1] };
  }
  return { countryCode: '+91', phone: fullPhone };
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const parsed = parsePhone(user?.phone);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: parsed.phone,
    countryCode: parsed.countryCode
  });

  if (!user) return null;

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
    if (!form.name.trim()) {
      return toast.error('Name cannot be empty!');
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      return toast.error('Phone number must be exactly 10 digits!');
    }

    setLoading(true);
    try {
      const { data } = await updateProfile({
        name: form.name,
        phone: `${form.countryCode} ${form.phone}`
      });
      updateUser(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-sky-500 transition font-medium"
          >
            <FiArrowLeft /> Back
          </button>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-sky-500 hover:text-sky-600 font-semibold transition"
            >
              <FiEdit2 /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 font-display">{user.name}</h1>
          <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold mt-2 capitalize ${
            user.role === 'admin' ? 'bg-red-100 text-red-600' :
            user.role === 'seller' ? 'bg-green-100 text-green-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {user.role}
          </span>
        </div>

        {/* Profile Form / Details */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                />
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
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const parsed = parsePhone(user?.phone);
                  setForm({ name: user.name, phone: parsed.phone, countryCode: parsed.countryCode });
                  setIsEditing(false);
                }}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-semibold transition"
              >
                <FiX /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white py-3 rounded-xl font-semibold transition"
              >
                <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiUser className="text-sky-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-400">Full Name</p>
                  <p className="font-semibold text-gray-700">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiMail className="text-sky-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="font-semibold text-gray-700">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiPhone className="text-sky-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-400">Phone Number</p>
                  <p className="font-semibold text-gray-700">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Dashboards and Actions */}
            <div className="space-y-3">
              {user.role === 'seller' && (
                <Link
                  to="/seller/dashboard"
                  className="w-full block text-center bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold transition"
                >
                  Seller Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="w-full block text-center bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
                >
                  Admin Control Panel
                </Link>
              )}
              <Link
                to="/"
                className="w-full block text-center border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-semibold transition"
              >
                Go to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
