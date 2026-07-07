import { useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";

const S = {
  page: { padding: "0 0 40px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 },
  title: { fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  btnPrimary: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 20px", borderRadius: 10, border: "none",
    background: "#013F99", color: "#fff",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #f1f5f9", background: "#f8fafc" },
  td: { padding: "14px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc" },
  badge: (active) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600,
    background: active ? "#dcfce7" : "#fef2f2",
    color: active ? "#16a34a" : "#ef4444",
  }),
  actionBtn: {
    padding: "5px 12px", borderRadius: 8, border: "none",
    fontSize: 12, fontWeight: 500, cursor: "pointer",
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, fontFamily: "'Poppins', sans-serif",
  },
  modal: {
    background: "#fff", borderRadius: 16, padding: "32px",
    width: 540, maxHeight: "88vh", overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  label: { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, display: "block" },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1px solid #e2e8f0", fontSize: 13,
    fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", outline: "none",
  },
  empCard: (selected) => ({
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 14px", borderRadius: 10, cursor: "pointer",
    border: `1px solid ${selected ? "#bfdbfe" : "#e2e8f0"}`,
    background: selected ? "#eff6ff" : "#fff",
    marginBottom: 8, transition: "all 0.15s",
  }),
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEmpPicker, setShowEmpPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [empSearch, setEmpSearch] = useState("");

  // Form state
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [formEmail, setFormEmail] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRoleId, setFormRoleId] = useState("");
  const [formActive, setFormActive] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [usersRes, rolesRes, empRes] = await Promise.all([
      supabaseEmployees.from("profiles_with_email").select("*, roles(name)").order("created_at", { ascending: false }),
      supabaseEmployees.from("roles").select("*").order("name"),
      supabaseEmployees.from("employees").select("id, full_name, department, job_position, picture, company_email").eq("status", "Active").order("full_name"),
    ]);
    console.log("Employees data:", empRes.data); // ← dagdag ito
    console.log("Employees error:", empRes.error);
    setUsers(usersRes.data || []);
    setRoles(rolesRes.data || []);
    setEmployees(empRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingUser(null);
    setSelectedEmp(null);
    setFormEmail("");
    setFormUsername("");
    setFormPassword("");
    setFormRoleId(roles[0]?.id || "");
    setFormActive(true);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setSelectedEmp(employees.find(e => e.id === user.employee_id) || null);
    setFormEmail(user.email || "");
    setFormUsername(user.username || "");
    setFormPassword("");
    setFormRoleId(user.role_id || "");
    setFormActive(user.is_active);
    setShowModal(true);
  };

const handleSelectEmp = (emp) => {
  setSelectedEmp(emp);
  const firstName = emp.full_name.trim().split(" ")[0].toLowerCase();
  setFormUsername(`cclpi-${firstName}`);
  setFormPassword(emp.id);
  setFormEmail(emp.company_email || "");
  setShowEmpPicker(false);
};

  const handleSave = async () => {
    if (!formEmail || !formUsername || (!editingUser && !formPassword)) return;
    setSaving(true);

    try {
      if (editingUser) {
        // Update profile only
        await supabaseEmployees.from("profiles").update({
          username: formUsername,
          role_id: formRoleId || null,
          is_active: formActive,
          full_name: selectedEmp?.full_name || editingUser.full_name,
          department: selectedEmp?.department || editingUser.department,
          job_position: selectedEmp?.job_position || editingUser.job_position,
          avatar_url: selectedEmp?.picture || editingUser.avatar_url,
          employee_id: selectedEmp?.id || editingUser.employee_id,
        }).eq("id", editingUser.id);
        } else {
        const { data: { session } } = await supabaseEmployees.auth.getSession();
        
        const response = await fetch(
            `https://wzuqnuviajdlovbhsdli.supabase.co/functions/v1/create-user`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                email: formEmail,
                password: formPassword,
                username: formUsername,
                role_id: formRoleId || null,
                full_name: selectedEmp?.full_name || "",
                department: selectedEmp?.department || "",
                job_position: selectedEmp?.job_position || "",
                avatar_url: selectedEmp?.picture || null,
                employee_id: selectedEmp?.id || null,
            }),
            }
        );

        const result = await response.json();
        if (result.error) throw new Error(result.error);
        }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user) => {
    await supabaseEmployees.from("profiles").update({ is_active: !user.is_active }).eq("id", user.id);
    fetchData();
  };

  const filteredEmps = employees.filter(e =>
    e.full_name?.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.department?.toLowerCase().includes(empSearch.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#94a3b8" }}>
      Loading users...
    </div>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>User Management</h1>
          <p style={S.subtitle}>{users.length} users registered</p>
        </div>
        <button style={S.btnPrimary} onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add User
        </button>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>User</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Department</th>
              <th style={S.th}>Role</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", color: "#94a3b8", padding: 40 }}>No users found</td></tr>
            ) : users.map(user => (
              <tr key={user.id}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", objectPosition: "center top" }} />
                    ) : (
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "#013F99", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>{user.full_name || user.username}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td style={S.td}>{user.email || "—"}</td>
                <td style={S.td}>{user.department || "—"}</td>
                <td style={S.td}>
                  <span style={{
                    background: "#eff6ff", color: "#013F99",
                    padding: "3px 10px", borderRadius: 20,
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {user.roles?.name || "No Role"}
                  </span>
                </td>
                <td style={S.td}>
                  <span style={S.badge(user.is_active)}>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      style={{ ...S.actionBtn, background: "#f1f5f9", color: "#475569" }}
                      onClick={() => openEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...S.actionBtn, background: user.is_active ? "#fef2f2" : "#f0fdf4", color: user.is_active ? "#ef4444" : "#16a34a" }}
                      onClick={() => toggleActive(user)}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={S.overlay} onClick={() => setShowModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 24 }}>
              {editingUser ? "Edit User" : "Create New User"}
            </h2>

            {/* Employee Picker */}
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Linked Employee</label>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  border: "1px solid #e2e8f0", cursor: "pointer",
                  background: "#f8fafc",
                }}
                onClick={() => setShowEmpPicker(true)}
              >
                {selectedEmp ? (
                  <>
                    {selectedEmp.picture ? (
                      <img src={selectedEmp.picture} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", objectPosition: "center top" }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#013F99", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                        {selectedEmp.full_name?.[0]}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{selectedEmp.full_name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{selectedEmp.department} • {selectedEmp.job_position}</div>
                    </div>
                  </>
                ) : (
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>Click to browse employees...</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Username</label>
              <input style={S.input} value={formUsername} onChange={e => setFormUsername(e.target.value)} placeholder="e.g. juan.delacruz" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Email</label>
              <input 
  style={{ ...S.input, background: selectedEmp?.company_email ? "#f8fafc" : "#fff" }} 
  type="email" 
  value={formEmail} 
  onChange={e => setFormEmail(e.target.value)} 
  placeholder="company@cclpi.com.ph" 
  disabled={!!editingUser || !!selectedEmp?.company_email} 
/>
{selectedEmp && !selectedEmp.company_email && (
  <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 5 }}>
    ⚠️ No company email set for this employee. Please enter manually.
  </div>
)}
            </div>

            {!editingUser && (
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Password</label>
                <input 
                    style={S.input} 
                    type="password" 
                    value={formPassword} 
                    onChange={e => setFormPassword(e.target.value)} 
                    placeholder="Minimum 6 characters" 
                    />
                    {selectedEmp && (
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>
                        Default password: Employee ID <strong style={{ color: "#013F99" }}>{selectedEmp.id}</strong>
                    </div>
                    )}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Role</label>
              <select
                style={{ ...S.input, background: "#fff" }}
                value={formRoleId}
                onChange={e => setFormRoleId(e.target.value)}
              >
                <option value="">Select role...</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            {editingUser && (
              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>Status</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {[true, false].map(val => (
                    <div
                      key={String(val)}
                      onClick={() => setFormActive(val)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                        border: `1px solid ${formActive === val ? (val ? "#86efac" : "#fca5a5") : "#e2e8f0"}`,
                        background: formActive === val ? (val ? "#f0fdf4" : "#fef2f2") : "#fff",
                        color: formActive === val ? (val ? "#16a34a" : "#ef4444") : "#94a3b8",
                        fontSize: 13, fontWeight: 600,
                      }}
                    >
                      {val ? "Active" : "Inactive"}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ ...S.actionBtn, flex: 1, padding: "11px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...S.btnPrimary, flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving..." : editingUser ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Picker Modal */}
      {showEmpPicker && (
        <div style={S.overlay} onClick={() => setShowEmpPicker(false)}>
          <div style={{ ...S.modal, width: 480 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Select Employee</h2>
            <input
              style={{ ...S.input, marginBottom: 16 }}
              placeholder="Search by name or department..."
              value={empSearch}
              onChange={e => setEmpSearch(e.target.value)}
              autoFocus
            />
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
              {filteredEmps.length === 0 ? (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: 24, fontSize: 13 }}>No employees found</div>
              ) : filteredEmps.map(emp => (
                <div key={emp.id} style={S.empCard(selectedEmp?.id === emp.id)} onClick={() => handleSelectEmp(emp)}>
                  {emp.picture ? (
                    <img src={emp.picture} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#013F99", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {emp.full_name?.[0]}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{emp.full_name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{emp.department} • {emp.job_position}</div>
                  </div>
                  {selectedEmp?.id === emp.id && (
                    <div style={{ marginLeft: "auto", color: "#013F99" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}