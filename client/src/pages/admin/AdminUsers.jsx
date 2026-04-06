import React, { useEffect, useState } from 'react';
import { adminGetAllUsers, adminDeleteUser } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiUsers, FiTrash2, FiSearch } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await adminGetAllUsers();
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminDeleteUser(id);
      toast.success('User deleted');
      setUsers(users.filter(u => u._id !== id));
    } catch { toast.error('Failed to delete user'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-display">User Management</h1>
          <p className="text-gray-500 mt-1">{users.length} registered users</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="h-8 bg-gray-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <FiUsers className="text-4xl mx-auto mb-2" />
                  <p>No users found</p>
                </td>
              </tr>
            ) : filtered.map(user => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    user.role === 'seller' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{user.phone || '—'}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(user._id)}
                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;