import { useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";

const ICON_MAP = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  hr: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  jobs: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  mortuary: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  ),
  compliance: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  news: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  boardOfDirectors: (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    <circle cx="18" cy="6" r="2"/><path d="M22 21v-1a3 3 0 0 0-2.5-2.96"/>
  </svg>
),
};

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
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card: {
    background: "#fff", borderRadius: 14,
    border: "1px solid #e2e8f0",
    padding: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  cardHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 },
  roleName: { fontSize: 15, fontWeight: 700, color: "#1e293b" },
  roleDesc: { fontSize: 12, color: "#94a3b8", marginTop: 3 },
  pageChip: {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "4px 10px", borderRadius: 20,
    background: "#f1f5f9", color: "#475569",
    fontSize: 11, fontWeight: 500, margin: "3px",
  },
  actionBtn: {
    padding: "6px 12px", borderRadius: 8, border: "none",
    fontSize: 12, fontWeight: 500, cursor: "pointer",
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, fontFamily: "'Poppins', sans-serif",
  },
  modal: {
    background: "#fff", borderRadius: 16,
    padding: "32px", width: 520, maxHeight: "85vh",
    overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  modalTitle: { fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 24 },
  label: { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, display: "block" },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1px solid #e2e8f0", fontSize: 13,
    fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
    outline: "none",
  },
  pageToggle: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px", borderRadius: 10,
    border: "1px solid #e2e8f0", marginBottom: 8,
    cursor: "pointer", transition: "all 0.15s",
  },
};

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPages, setFormPages] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const [rolesRes, pagesRes, rolePagesRes] = await Promise.all([
      supabaseEmployees.from("roles").select("*").order("created_at"),
      supabaseEmployees.from("pages").select("*").order("sort_order"),
      supabaseEmployees.from("role_pages").select("*"),
    ]);

    const rolePagesMap = {};
    rolePagesRes.data?.forEach(rp => {
      if (!rolePagesMap[rp.role_id]) rolePagesMap[rp.role_id] = [];
      rolePagesMap[rp.role_id].push(rp.page_id);
    });

    const rolesWithPages = rolesRes.data?.map(r => ({
      ...r,
      pageIds: rolePagesMap[r.id] || [],
    }));

    setRoles(rolesWithPages || []);
    setPages(pagesRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingRole(null);
    setFormName("");
    setFormDesc("");
    setFormPages([]);
    setShowModal(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormDesc(role.description || "");
    setFormPages(role.pageIds || []);
    setShowModal(true);
  };

  const togglePage = (pageId) => {
    setFormPages(prev =>
      prev.includes(pageId) ? prev.filter(p => p !== pageId) : [...prev, pageId]
    );
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);

    try {
      let roleId = editingRole?.id;

      if (editingRole) {
        await supabaseEmployees.from("roles").update({
          name: formName.trim(),
          description: formDesc.trim(),
        }).eq("id", roleId);
      } else {
        const { data } = await supabaseEmployees.from("roles").insert({
          name: formName.trim(),
          description: formDesc.trim(),
        }).select().single();
        roleId = data.id;
      }

      // Update role_pages — delete old, insert new
      await supabaseEmployees.from("role_pages").delete().eq("role_id", roleId);
      if (formPages.length > 0) {
        await supabaseEmployees.from("role_pages").insert(
          formPages.map(pageId => ({ role_id: roleId, page_id: pageId }))
        );
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roleId) => {
    await supabaseEmployees.from("roles").delete().eq("id", roleId);
    setDeleteConfirm(null);
    fetchData();
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#94a3b8" }}>
      Loading roles...
    </div>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Role Management</h1>
          <p style={S.subtitle}>{roles.length} roles configured</p>
        </div>
        <button style={S.btnPrimary} onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Role
        </button>
      </div>

      {/* Roles Grid */}
      <div style={S.grid}>
        {roles.map(role => (
          <div key={role.id} style={S.card}>
            <div style={S.cardHeader}>
              <div>
                <div style={S.roleName}>{role.name}</div>
                <div style={S.roleDesc}>{role.description || "No description"}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  style={{ ...S.actionBtn, background: "#f1f5f9", color: "#475569" }}
                  onClick={() => openEdit(role)}
                >
                  Edit
                </button>
                {role.name !== "Admin" && (
                  <button
                    style={{ ...S.actionBtn, background: "#fef2f2", color: "#ef4444" }}
                    onClick={() => setDeleteConfirm(role)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Pages assigned */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                Assigned Pages ({role.pageIds.length})
              </div>
              {role.pageIds.length === 0 ? (
                <div style={{ fontSize: 12, color: "#cbd5e1" }}>No pages assigned</div>
              ) : (
                <div>
                  {pages.filter(p => role.pageIds.includes(p.id)).map(page => (
                    <span key={page.id} style={S.pageChip}>
                      {ICON_MAP[page.icon]}
                      {page.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={S.overlay} onClick={() => setShowModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={S.modalTitle}>{editingRole ? "Edit Role" : "Create New Role"}</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Role Name</label>
              <input
                style={S.input}
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. HR Staff"
                disabled={editingRole?.name === "Admin"}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Description</label>
              <input
                style={S.input}
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                placeholder="Brief description of this role"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={S.label}>Page Access ({formPages.length} selected)</label>
              {pages.map(page => {
                const isSelected = formPages.includes(page.id);
                return (
                  <div
                    key={page.id}
                    style={{
                      ...S.pageToggle,
                      background: isSelected ? "#eff6ff" : "#fff",
                      borderColor: isSelected ? "#bfdbfe" : "#e2e8f0",
                    }}
                    onClick={() => togglePage(page.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, color: isSelected ? "#013F99" : "#64748b" }}>
                      {ICON_MAP[page.icon]}
                      <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400 }}>{page.name}</span>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6,
                      border: `2px solid ${isSelected ? "#013F99" : "#cbd5e1"}`,
                      background: isSelected ? "#013F99" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {isSelected && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ ...S.actionBtn, flex: 1, padding: "11px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                style={{ ...S.btnPrimary, flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving..." : editingRole ? "Save Changes" : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={S.overlay} onClick={() => setDeleteConfirm(null)}>
          <div style={{ ...S.modal, width: 380, textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Delete Role?</h2>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? Users with this role will lose their access.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ ...S.actionBtn, flex: 1, padding: "11px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                style={{ ...S.actionBtn, flex: 1, padding: "11px", background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}