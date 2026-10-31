'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Key,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  UserCheck,
  UserX,
} from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  role_id?: number | null;
  roleName?: string;
  roleDescription?: string;
  is_active: number | boolean;
  created_at: string;
}

interface RoleItem {
  id: number;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
  is_system: number | boolean;
  created_at: string;
}

const AVAILABLE_MODULES = [
  { key: 'properties', label: 'Properties Management', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'projects', label: 'Projects Management', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'locations', label: 'Locations & Micro-markets', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'blogs', label: 'Blog & Articles CMS', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'crm', label: 'CRM Inquiries & Pipeline', actions: ['view', 'create', 'edit', 'delete', 'export'] },
  { key: 'seo', label: 'Technical & On-Page SEO', actions: ['view', 'edit'] },
  { key: 'social_videos', label: 'Social Videos & Reels', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'users', label: 'User & Role Administration', actions: ['view', 'create', 'edit', 'delete'] },
];

export default function UserManagementTab() {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // User Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role_id: '',
    is_active: true,
  });

  // Role Modal State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [roleForm, setRoleForm] = useState<{
    name: string;
    description: string;
    permissions: Record<string, string[]>;
  }>({
    name: '',
    description: '',
    permissions: {},
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [uRes, rRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/roles'),
      ]);

      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(Array.isArray(uData) ? uData : []);
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        setRoles(Array.isArray(rData) ? rData : []);
      }
    } catch (err) {
      console.error('Failed to load RBAC data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Open User Modal
  const openUserModal = (user?: UserItem) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '',
        role_id: user.role_id ? String(user.role_id) : '',
        is_active: Boolean(user.is_active),
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role_id: roles.length > 0 ? String(roles[0].id) : '',
        is_active: true,
      });
    }
    setShowUserModal(true);
  };

  // Save User (Create or Update)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const payload: any = {
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim(),
        role_id: userForm.role_id ? parseInt(userForm.role_id, 10) : null,
        is_active: userForm.is_active,
      };

      if (!editingUser || (editingUser && userForm.password.trim().length > 0)) {
        payload.password = userForm.password.trim();
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save user');

      showToast(editingUser ? 'User updated successfully' : 'New user created successfully');
      setShowUserModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Toggle User Status
  const toggleUserStatus = async (user: UserItem) => {
    const nextStatus = !user.is_active;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: nextStatus }),
      });
      if (res.ok) {
        showToast(`User marked as ${nextStatus ? 'Active' : 'Deactivated'}`);
        loadData();
      }
    } catch (err: any) {
      showToast('Error toggling status', 'error');
    }
  };

  // Delete User
  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this staff user account?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      showToast('User deleted successfully');
      loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Open Role Modal
  const openRoleModal = (role?: RoleItem) => {
    if (role) {
      setEditingRole(role);
      setRoleForm({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || {},
      });
    } else {
      setEditingRole(null);
      setRoleForm({
        name: '',
        description: '',
        permissions: {
          properties: ['view'],
          projects: ['view'],
          blogs: ['view'],
          crm: ['view'],
        },
      });
    }
    setShowRoleModal(true);
  };

  // Toggle Permission
  const togglePermission = (moduleKey: string, action: string) => {
    setRoleForm((prev) => {
      const current = prev.permissions[moduleKey] || [];
      const updated = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action];

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleKey]: updated,
        },
      };
    });
  };

  // Save Role
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRole ? `/api/admin/roles/${editingRole.id}` : '/api/admin/roles';
      const method = editingRole ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save role');

      showToast(editingRole ? 'Role updated successfully' : 'Custom role created successfully');
      setShowRoleModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Delete Role
  const handleDeleteRole = async (id: number) => {
    if (!confirm('Are you sure you want to delete this custom role?')) return;
    try {
      const res = await fetch(`/api/admin/roles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete role');
      showToast('Role deleted successfully');
      loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Sub-tab Navigation & Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'roles'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Custom Roles ({roles.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeSubTab === 'users' ? (
            <button
              onClick={() => openUserModal()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff User</span>
            </button>
          ) : (
            <button
              onClick={() => openRoleModal()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Role</span>
            </button>
          )}

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: USERS LIST
          ======================================================== */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isActive = Boolean(u.is_active);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{u.email}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {u.phone || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-amber-50 text-amber-900 border border-amber-200/80">
                            <Shield className="w-3 h-3 text-amber-600" />
                            {u.roleName || (u.role === 'admin' ? 'Super Admin' : 'Staff')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleUserStatus(u)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] transition cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Click to toggle account access"
                          >
                            {isActive ? (
                              <>
                                <UserCheck className="w-3 h-3 text-emerald-600" /> Active
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 text-rose-600" /> Deactivated
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openUserModal(u)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition"
                              title="Edit User"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: ROLES & PERMISSIONS
          ======================================================== */}
      {activeSubTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const isSystem = Boolean(role.is_system);
            const permissions = role.permissions || {};

            return (
              <div
                key={role.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{role.name}</h4>
                      {isSystem && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-150 text-slate-700">
                          System Role
                        </span>
                      )}
                    </div>
                    {role.description && (
                      <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isSystem && (
                      <>
                        <button
                          onClick={() => openRoleModal(role)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                          title="Edit Custom Role"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700"
                          title="Delete Custom Role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Module Permissions Pills */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Granted Permissions
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_MODULES.map((mod) => {
                      const granted = permissions[mod.key] || [];
                      const hasAccess = granted.length > 0;

                      return (
                        <div
                          key={mod.key}
                          className={`p-2 rounded-lg border text-[11px] ${
                            hasAccess
                              ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                              : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{mod.label}</span>
                            {hasAccess && <Check className="w-3 h-3 text-emerald-600" />}
                          </div>
                          {hasAccess ? (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {granted.map((a) => (
                                <span
                                  key={a}
                                  className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white border border-emerald-200 text-emerald-800"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px]">No access</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD / EDIT USER
          ======================================================== */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/60">
              <h3 className="font-bold text-base text-slate-900">
                {editingUser ? `Edit Staff User #${editingUser.id}` : 'Create New Staff User'}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@veerrealestate.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98250 12345"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Assigned Role *</label>
                <select
                  required
                  value={userForm.role_id}
                  onChange={(e) => setUserForm({ ...userForm, role_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.is_system ? '(System)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="userActiveCheck"
                  checked={userForm.is_active}
                  onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300"
                />
                <label htmlFor="userActiveCheck" className="text-slate-700 font-semibold cursor-pointer">
                  Account is Active (allow dashboard login)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CREATE / EDIT CUSTOM ROLE
          ======================================================== */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/60">
              <h3 className="font-bold text-base text-slate-900">
                {editingRole ? `Edit Role: ${editingRole.name}` : 'Create Custom Role Builder'}
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Telecaller / Assistant Manager"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Description</label>
                <input
                  type="text"
                  placeholder="Role duties and responsibilities"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-3">
                <label className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                  Granular Module Permissions Matrix
                </label>

                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  {AVAILABLE_MODULES.map((mod) => {
                    const currentActions = roleForm.permissions[mod.key] || [];

                    return (
                      <div
                        key={mod.key}
                        className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="font-bold text-slate-800 text-xs">{mod.label}</div>

                        <div className="flex flex-wrap items-center gap-2">
                          {mod.actions.map((act) => {
                            const checked = currentActions.includes(act);
                            return (
                              <label
                                key={act}
                                className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold cursor-pointer transition flex items-center gap-1.5 select-none ${
                                  checked
                                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-2xs'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={checked}
                                  onChange={() => togglePermission(mod.key, act)}
                                />
                                <span>{act}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

