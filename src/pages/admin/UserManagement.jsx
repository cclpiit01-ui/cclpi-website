import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ROLES } from "@/constants/roles";

const ROLE_OPTIONS = Object.values(ROLES);

const ROLE_COLORS = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  HRAD_ADMIN: "bg-blue-100 text-blue-700",
  CIA_ADMIN: "bg-green-100 text-green-700",
  CLAIMS_ADMIN: "bg-orange-100 text-orange-700",
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    role: ROLES.HRAD_ADMIN,
  });

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_profiles")
      .select("id, username, role");

    if (error) console.error(error);
    else setUsers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Create user in Supabase Auth using admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true, // Skip email confirmation
      });

      if (authError) throw authError;

      // 2. Insert profile with role
      const { error: profileError } = await supabase
        .from("admin_profiles")
        .insert({
          id: authData.user.id,
          username: formData.username,
          role: formData.role,
        });

      if (profileError) throw profileError;

      setSuccess(`User "${formData.username}" created successfully!`);
      setFormData({ email: "", password: "", username: "", role: ROLES.HRAD_ADMIN });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId, username) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;

    // Delete from admin_profiles (auth user stays but loses access)
    const { error } = await supabase
      .from("admin_profiles")
      .delete()
      .eq("id", userId);

    if (error) {
      alert("Error deleting user: " + error.message);
    } else {
      fetchUsers();
    }
  };

  const inputClass =
    "w-full border border-slate-200 bg-slate-50 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm";
  const labelClass =
    "block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage admin portal access</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(null); setSuccess(null); }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          {showForm ? "✕ Cancel" : "+ Add User"}
        </button>
      </div>

      {/* Feedback Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl text-sm font-medium">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* CREATE USER FORM */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-black text-slate-700 mb-5">Create New Admin User</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Username / Display Name</label>
              <input
                className={inputClass}
                placeholder="e.g. HR_User"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <select
                className={inputClass}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                placeholder="user@cclpi.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={6}
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition shadow-lg shadow-blue-200"
              >
                {isSubmitting ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {loading ? (
          <div className="text-center py-10 text-slate-400 font-medium">Loading users...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <th className="pb-4 px-2">Username</th>
                <th className="pb-4 px-2">Role</th>
                <th className="pb-4 px-2">User ID</th>
                <th className="pb-4 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-2 font-bold text-slate-700">{u.username}</td>
                  <td className="py-4 px-2">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${ROLE_COLORS[u.role] || "bg-slate-100 text-slate-500"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-slate-400 text-xs font-mono">
                    {u.id.slice(0, 16)}...
                  </td>
                  <td className="py-4 px-2 text-right">
                    {u.role !== "SUPER_ADMIN" && (
                      <button
                        onClick={() => handleDelete(u.id, u.username)}
                        className="text-slate-300 hover:text-red-500 font-bold text-xs transition"
                      >
                        DEL
                      </button>
                    )}
                    {u.role === "SUPER_ADMIN" && (
                      <span className="text-[10px] text-slate-300 font-bold">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
