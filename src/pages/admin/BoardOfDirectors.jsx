import { useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";

const WEBHOOK_URL = "https://laptop-ea1su7kn.tail6649cc.ts.net/webhook/16a10166-a8b3-4bd6-9485-e2f471a1405e";

export default function BoardOfDirectors() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({});
  const [pictureFile, setPictureFile] = useState(null);
  const [adding, setAdding] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editPictureFile, setEditPictureFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabaseEmployees
      .from("board_of_directors")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error) setMembers(data);
    setLoading(false);
  };

  const uploadFile = async (file, folder) => {
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabaseEmployees.storage.from('employee-file').upload(filename, file);
    if (error) throw error;
    const { data: urlData } = supabaseEmployees.storage.from('employee-file').getPublicUrl(filename);
    return urlData.publicUrl;
  };

  const openEdit = (member) => { setEditData({ ...member }); setEditModal(true); };
  const handleEditChange = (field, value) => setEditData(prev => ({ ...prev, [field]: value }));

  const handleAdd = async () => {
    if (!addData.full_name?.trim()) return alert("Kailangan ng pangalan.");
    setAdding(true);
    try {
      let pictureUrl = null;
      if (pictureFile) pictureUrl = await uploadFile(pictureFile, 'board-of-directors');
      const { error } = await supabaseEmployees.from('board_of_directors').insert({
        full_name: addData.full_name,
        position: addData.position || null,
        bio: addData.bio || null,
        dob: addData.dob || null,
        picture: pictureUrl,
        sort_order: addData.sort_order ? parseInt(addData.sort_order) : (members.length + 1),
        status: addData.status || 'Active',
      });
      if (error) alert('Error adding member: ' + error.message);
      else { setAddModal(false); setAddData({}); setPictureFile(null); fetchMembers(); }
    } catch (err) { alert('Upload error: ' + err.message); }
    setAdding(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let pictureUrl = editData.picture;
      if (editPictureFile) pictureUrl = await uploadFile(editPictureFile, 'board-of-directors');
      const { error } = await supabaseEmployees.from("board_of_directors").update({
        full_name: editData.full_name,
        position: editData.position,
        bio: editData.bio,
        dob: editData.dob,
        sort_order: editData.sort_order ? parseInt(editData.sort_order) : 0,
        status: editData.status,
        picture: pictureUrl,
        updated_at: new Date().toISOString(),
      }).eq("id", editData.id);
      setSaving(false);
      if (!error) { setEditModal(false); setEditPictureFile(null); fetchMembers(); }
      else alert("Error saving: " + error.message);
    } catch (err) { alert("Upload error: " + err.message); setSaving(false); }
  };

  const handleDelete = async (id) => {
    const { error } = await supabaseEmployees.from("board_of_directors").delete().eq("id", id);
    setDeleteConfirm(null);
    if (!error) fetchMembers();
    else alert("Error deleting: " + error.message);
  };

  const handleDownloadPoster = async (member) => {
    setDownloadingId(member.id);
    try {
      // Tignan muna kung may existing completed poster na
      let { data: existing } = await supabaseEmployees
        .from("birthday_posters")
        .select("image_url")
        .eq("employee_id", member.id)
        .eq("status", "completed")
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let imageUrl = existing?.image_url;

      // Kung wala pa, i-trigger ang n8n webhook para mag-generate
      if (!imageUrl) {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: member.id, type: "bod" }),
        });

        if (!response.ok) {
          throw new Error(`Webhook error (status ${response.status})`);
        }

        const result = await response.json();

        if (!result.success || !result.image_url) {
          alert("Hindi na-generate ang poster para kay " + member.full_name + ": " + (result.error || "Unknown error"));
          setDownloadingId(null);
          return;
        }

        imageUrl = result.image_url;
      }

      // I-download bilang blob (para hindi mag-open sa bagong tab)
      const imgResponse = await fetch(imageUrl);
      const blob = await imgResponse.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${member.full_name.replace(/\s+/g, "_")}_Birthday_Poster.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("May error habang nag-ge-generate/download ng poster: " + err.message);
    }
    setDownloadingId(null);
  };

  const filtered = members.filter((m) => {
    const matchSearch = m.full_name?.toLowerCase().includes(search.toLowerCase()) || m.position?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const inputStyle = { padding: "10px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box", background: "#fafcff" };
  const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 };

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
            Board of Directors Management
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Manage board members displayed on the website</p>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(1,63,153,0.08)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(1,63,153,0.08)", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search by name or position..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 16px 10px 36px", border: "1px solid rgba(1,63,153,0.12)", borderRadius: 10, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif" }} />
          </div>
          {["All", "Active", "Inactive"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: statusFilter === s ? "#013F99" : "#fff", color: statusFilter === s ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              {s}
            </button>
          ))}
          <button onClick={() => setAddModal(true)}
            style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Member
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading board members...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f6fbfe" }}>
                  {["Photo", "Name", "Position", "Date of Birth", "Order", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid rgba(1,63,153,0.08)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No board members found.</td></tr>
                ) : (
                  filtered.map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid rgba(1,63,153,0.05)", background: i % 2 === 0 ? "#fff" : "#fafcff" }}>
                      <td style={{ padding: "12px 16px" }}>
                        {m.picture ? (
                          <img src={m.picture} alt={m.full_name} style={{ width: 42, height: 42, borderRadius: 10, objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg, #013F99, #4CB1E9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
                            {m.full_name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                      </td>
                        <td style={{ padding: "12px 16px", color: "#0b1a3b", fontWeight: 600 }}>{m.full_name}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{m.position || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>
                        {m.dob ? new Date(m.dob).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{m.sort_order}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: m.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: m.status === "Active" ? "#16a34a" : "#dc2626" }}>{m.status}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEdit(m)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                          <button onClick={() => { setViewData(m); setViewModal(true); }} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(76,177,233,0.3)", background: "#fff", color: "#4CB1E9", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>View</button>
                          <button
                            onClick={() => handleDownloadPoster(m)}
                            disabled={downloadingId === m.id}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: "1px solid rgba(243,207,71,0.4)",
                              background: downloadingId === m.id ? "#f6fbfe" : "#fff",
                              color: "#b8860b",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: downloadingId === m.id ? "not-allowed" : "pointer",
                            }}
                          >
                            {downloadingId === m.id ? "Generating..." : "Download"}
                          </button>
                          <button onClick={() => setDeleteConfirm(m)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.25)", background: "#fff", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {addModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 560, padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Add Board Member</h2>
              <button onClick={() => setAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={addData.full_name || ""} onChange={(e) => setAddData(prev => ({ ...prev, full_name: e.target.value }))} style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Position</label>
                <input type="text" value={addData.position || ""} onChange={(e) => setAddData(prev => ({ ...prev, position: e.target.value }))} style={inputStyle} placeholder="e.g. Chairman, Director" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Bio</label>
                <textarea value={addData.bio || ""} onChange={(e) => setAddData(prev => ({ ...prev, bio: e.target.value }))} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Date of Birth</label>
                <input type="date" value={addData.dob || ""} onChange={(e) => setAddData(prev => ({ ...prev, dob: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" value={addData.sort_order || ""} onChange={(e) => setAddData(prev => ({ ...prev, sort_order: e.target.value }))} style={inputStyle} placeholder="1, 2, 3..." />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Status</label>
                  <select value={addData.status || "Active"} onChange={(e) => setAddData(prev => ({ ...prev, status: e.target.value }))} style={inputStyle}>
                    <option value="Active">Active</option><option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setPictureFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box" }} />
                {pictureFile && <img src={URL.createObjectURL(pictureFile)} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)", marginTop: 8 }} />}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(1,63,153,0.08)" }}>
              <button onClick={() => setAddModal(false)} style={{ padding: "11px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAdd} disabled={adding} style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: adding ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: adding ? "not-allowed" : "pointer" }}>{adding ? "Saving..." : "Add Member"}</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && editData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 560, padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Edit Board Member</h2>
              <button onClick={() => setEditModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={editData.full_name || ""} onChange={(e) => handleEditChange("full_name", e.target.value)} style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Position</label>
                <input type="text" value={editData.position || ""} onChange={(e) => handleEditChange("position", e.target.value)} style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Bio</label>
                <textarea value={editData.bio || ""} onChange={(e) => handleEditChange("bio", e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Date of Birth</label>
                <input type="date" value={editData.dob || ""} onChange={(e) => handleEditChange("dob", e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" value={editData.sort_order || ""} onChange={(e) => handleEditChange("sort_order", e.target.value)} style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Status</label>
                  <select value={editData.status || "Active"} onChange={(e) => handleEditChange("status", e.target.value)} style={inputStyle}>
                    <option value="Active">Active</option><option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Photo</label>
                {(editData.picture && !editPictureFile) && (
                  <img src={editData.picture} alt="current" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)", marginBottom: 8 }} />
                )}
                {editPictureFile && (
                  <img src={URL.createObjectURL(editPictureFile)} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)", marginBottom: 8 }} />
                )}
                <input type="file" accept="image/*" onChange={(e) => setEditPictureFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box" }} />
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Leave blank to keep current photo</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(1,63,153,0.08)" }}>
              <button onClick={() => setEditModal(false)} style={{ padding: "11px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: saving ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewModal && viewData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 480, padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Board Member Profile</h2>
              <button onClick={() => setViewModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 20 }}>
              {viewData.picture ? (
                <img src={viewData.picture} alt={viewData.full_name} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 16, border: "3px solid rgba(1,63,153,0.15)" }} />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: 16, background: "linear-gradient(135deg, #013F99, #4CB1E9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, fontWeight: 700 }}>
                  {viewData.full_name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b" }}>{viewData.full_name}</div>
                <div style={{ fontSize: 13, color: "#4CB1E9", fontWeight: 500 }}>{viewData.position || "—"}</div>
              </div>
            </div>

            {viewData.dob && (
            <div style={{ padding: "14px 16px", background: "#f6fbfe", borderRadius: 12, border: "1px solid rgba(1,63,153,0.06)", marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Date of Birth</div>
                <div style={{ fontSize: 13, color: "#0b1a3b", lineHeight: 1.6 }}>{new Date(viewData.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
            </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button onClick={() => setViewModal(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: 380, padding: 32, boxSizing: "border-box", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0b1a3b", marginBottom: 8 }}>Delete Board Member?</h2>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
              Sigurado ka bang gusto mong tanggalin si <strong>{deleteConfirm.full_name}</strong>?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}