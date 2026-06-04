import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import api from '../api/axios';

const ROLES = [
  { id: 1, label: 'Admin' },
  { id: 2, label: 'Technician' },
  { id: 3, label: 'Cashier' },
  { id: 4, label: 'Customer' },
];

const ROLE_COLORS = {
  Admin:      'bg-purple-100 text-purple-700',
  Technician: 'bg-blue-100 text-blue-700',
  Cashier:    'bg-green-100 text-green-700',
  Customer:   'bg-slate-100 text-slate-600',
};

const emptyForm = { emri: '', mbiemri: '', email: '', password: '', role_id: '2' };

function UserManagement() {
  const { t } = useLang();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [roleModal, setRoleModal] = useState(null); // { userId, currentRoles[] }
  const [roleLoading, setRoleLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchUsers = () =>
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);

  useEffect(() => { fetchUsers(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);
    try {
      await api.post('/auth/register', {
        emri: form.emri,
        mbiemri: form.mbiemri,
        email: form.email,
        password: form.password,
        role_id: Number(form.role_id),
      });
      setFormSuccess(`Account created for ${form.emri} ${form.mbiemri}.`);
      setForm(emptyForm);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setFormLoading(false);
    }
  };

  const openRoleModal = (user) => {
    const currentRoles = user.roles ? user.roles.split(',').map(r => r.trim()) : [];
    setRoleModal({ userId: user.id, name: `${user.emri} ${user.mbiemri}`, currentRoles });
  };

  const handleRoleSave = async () => {
    if (!roleModal) return;
    setRoleLoading(true);
    try {
      await api.put(`/users/${roleModal.userId}/roles`, { roles: roleModal.currentRoles });
      await fetchUsers();
      setRoleModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setRoleLoading(false);
    }
  };

  const toggleRole = (roleLabel) => {
    setRoleModal(prev => {
      const has = prev.currentRoles.includes(roleLabel);
      return {
        ...prev,
        currentRoles: has
          ? prev.currentRoles.filter(r => r !== roleLabel)
          : [...prev.currentRoles, roleLabel],
      };
    });
  };

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/users/${user.id}/status`, { is_active: user.is_active ? 0 : 1 });
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const filtered = users.filter(u =>
    `${u.emri} ${u.mbiemri} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">User Management</h2>

      {/* Create Staff Account */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Create Staff Account</h3>

        {formError && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{formError}</div>
        )}
        {formSuccess && (
          <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{formSuccess}</div>
        )}

        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
            <input required value={form.emri} onChange={set('emri')} placeholder="John"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
            <input required value={form.mbiemri} onChange={set('mbiemri')} placeholder="Doe"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input required type="email" value={form.email} onChange={set('email')} placeholder="john@store.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
            <input required type="password" value={form.password} onChange={set('password')} placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
            <select value={form.role_id} onChange={set('role_id')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="1">Admin</option>
              <option value="2">Technician</option>
              <option value="3">Cashier</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={formLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium
                         hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {formLoading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">All Users ({users.length})</h3>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
          />
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Roles</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">{u.emri} {u.mbiemri}</td>
                <td className="px-5 py-3 text-slate-500">{u.email}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.roles
                      ? u.roles.split(',').map(r => r.trim()).map(r => (
                          <span key={r} className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[r] || 'bg-slate-100 text-slate-600'}`}>
                            {r}
                          </span>
                        ))
                      : <span className="text-slate-400 text-xs">No role</span>
                    }
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openRoleModal(u)}
                      className="text-xs px-3 py-1 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium">
                      Edit Roles
                    </button>
                    <button onClick={() => handleToggleActive(u)}
                      className={`text-xs px-3 py-1 rounded-lg border transition-colors font-medium ${
                        u.is_active
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400 text-sm">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Role Edit Modal */}
      {roleModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-1">Edit Roles</h3>
            <p className="text-sm text-slate-500 mb-5">{roleModal.name}</p>

            <div className="space-y-2 mb-6">
              {ROLES.map(role => (
                <label key={role.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={roleModal.currentRoles.includes(role.label)}
                    onChange={() => toggleRole(role.label)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[role.label]}`}>{role.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setRoleModal(null)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleRoleSave} disabled={roleLoading}
                className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60">
                {roleLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;