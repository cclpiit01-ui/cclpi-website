import { useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
const WEBHOOK_URL = "https://cclpiplans.app.n8n.cloud/webhook/16a10166-a8b3-4bd6-9485-e2f471a1405e";

export default function HRManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [birthMonth, setBirthMonth] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const itemsPerPage = 10;
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({});
  const [adding, setAdding] = useState(false);
  const [pictureFile, setPictureFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [editPictureFile, setEditPictureFile] = useState(null);
  const [editSignatureFile, setEditSignatureFile] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);


  useEffect(() => { fetchEmployees(); }, [sortOrder]);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabaseEmployees.from("employees").select("*").order("id", { ascending: sortOrder === "asc" });
    if (!error) setEmployees(data);
    setLoading(false);
  };

const handleDownloadPoster = async (emp) => {
  setDownloadingId(emp.id);
  try {
    // 1. Tignan muna kung may existing completed poster na
    let { data: existing } = await supabaseEmployees
      .from("birthday_posters")
      .select("image_url")
      .eq("employee_id", emp.id)
      .eq("status", "completed")
      .order("generated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let imageUrl = existing?.image_url;

    // 2. Kung wala pa, i-trigger ang n8n webhook para mag-generate
    if (!imageUrl) {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: emp.id }),
      });

      if (!response.ok) {
        throw new Error(`Webhook error (status ${response.status})`);
      }

      const result = await response.json();

      if (!result.success || !result.image_url) {
        alert("Hindi na-generate ang poster para kay " + emp.full_name + ": " + (result.error || "Unknown error"));
        setDownloadingId(null);
        return;
      }

      imageUrl = result.image_url;
    }

    // 3. I-download bilang blob (para hindi mag-open sa bagong tab)
    const imgResponse = await fetch(imageUrl);
    const blob = await imgResponse.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${emp.full_name.replace(/\s+/g, "_")}_Birthday_Poster.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    alert("May error habang nag-ge-generate/download ng poster: " + err.message);
  }
  setDownloadingId(null);
};

  const openEdit = (emp) => { setEditData({ ...emp }); setEditModal(true); };
  const handleEditChange = (field, value) => setEditData(prev => ({ ...prev, [field]: value }));

  const uploadFile = async (file, folder) => {
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabaseEmployees.storage.from('employee-file').upload(filename, file);
    if (error) throw error;
    const { data: urlData } = supabaseEmployees.storage.from('employee-file').getPublicUrl(filename);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let pictureUrl = editData.picture;
      let signatureUrl = editData.signature;
      if (editPictureFile) pictureUrl = await uploadFile(editPictureFile, 'pictures');
      if (editSignatureFile) signatureUrl = await uploadFile(editSignatureFile, 'signatures');
      const { error } = await supabaseEmployees.from("employees").update({
        first_name: editData.first_name, middle_name: editData.middle_name, last_name: editData.last_name,
        full_name: `${editData.first_name} ${editData.middle_name ? editData.middle_name[0] + '. ' : ''}${editData.last_name}`,
        nickname: editData.nickname, job_position: editData.job_position, department: editData.department,
        area: editData.area, status: editData.status, blood_type: editData.blood_type, dob: editData.dob,
        date_hired: editData.date_hired, sss: editData.sss, tin: editData.tin, philhealth: editData.philhealth,
        hdmf: editData.hdmf, contact_person: editData.contact_person, address: editData.address,
        contact_number: editData.contact_number, picture: pictureUrl, signature: signatureUrl,
      }).eq("id", editData.id);
      setSaving(false);
      if (!error) { setEditModal(false); setEditPictureFile(null); setEditSignatureFile(null); fetchEmployees(); }
      else alert("Error saving: " + error.message);
    } catch (err) { alert("Upload error: " + err.message); setSaving(false); }
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      let pictureUrl = null, signatureUrl = null;
      if (pictureFile) pictureUrl = await uploadFile(pictureFile, 'pictures');
      if (signatureFile) signatureUrl = await uploadFile(signatureFile, 'signatures');
      const full_name = `${addData.first_name || ''} ${addData.middle_name ? addData.middle_name[0] + '. ' : ''}${addData.last_name || ''}`.trim();
      const { error } = await supabaseEmployees.from('employees').insert({ ...addData, full_name, picture: pictureUrl, signature: signatureUrl, status: addData.status || 'Active' });
      if (error) alert('Error adding employee: ' + error.message);
      else { setAddModal(false); setAddData({}); setPictureFile(null); setSignatureFile(null); fetchEmployees(); }
    } catch (err) { alert('Upload error: ' + err.message); }
    setAdding(false);
  };

  const filtered = employees.filter((emp) => {
    const matchSearch = emp.full_name?.toLowerCase().includes(search.toLowerCase()) || emp.id?.toLowerCase().includes(search.toLowerCase()) || emp.job_position?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || emp.status === statusFilter;
    const matchDepartment = departmentFilter === "All" || emp.department === departmentFilter;
    const matchBirthMonth = birthMonth === "All" || (emp.dob && new Date(emp.dob).getMonth() + 1 === parseInt(birthMonth));
    return matchSearch && matchStatus && matchBirthMonth && matchDepartment;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const departments = ["All", ...new Set(employees.map(e => e.department).filter(Boolean).sort())];
  const total = employees.length;
  const active = employees.filter((e) => e.status === "Active").length;
  const inactive = employees.filter((e) => e.status === "In-active").length;

  const inputStyle = { padding: "10px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box", background: "#fafcff" };
  const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 };

  const SectionHeader = ({ title, icon }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, marginTop: 8 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #013F99, #4CB1E9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1a3b", fontFamily: "'Montserrat', sans-serif" }}>{title}</div>
      <div style={{ flex: 1, height: 1, background: "rgba(1,63,153,0.1)", marginLeft: 8 }} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>HR Management</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Manage employee records</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
        {[{ label: "Total Employees", value: total, color: "#013F99" }, { label: "Active", value: active, color: "#22c55e" }, { label: "Inactive", value: inactive, color: "#ef4444" }].map((card) => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid rgba(1,63,153,0.08)", borderLeft: `4px solid ${card.color}` }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{card.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: card.color, marginTop: 8 }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(1,63,153,0.08)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(1,63,153,0.08)", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search by name, ID, or position..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 16px 10px 36px", border: "1px solid rgba(1,63,153,0.12)", borderRadius: 10, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif" }} />
          </div>
          {/* All */}
            {["All", "Active", "In-active"].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: statusFilter === s ? "#013F99" : "#fff", color: statusFilter === s ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              {s}
            </button>
          ))}

          {/* DEPARTMENT FILTER */}
          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: "1px solid rgba(1,63,153,0.12)",
              background: departmentFilter !== "All" ? "#013F99" : "#fff",
              color: departmentFilter !== "All" ? "#fff" : "#64748b",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
            }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
            ))}
          </select>
           {/* Birthday*/}
          <select value={birthMonth} onChange={(e) => { setBirthMonth(e.target.value); setCurrentPage(1); }}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: birthMonth !== "All" ? "#013F99" : "#fff", color: birthMonth !== "All" ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", outline: "none" }}>
            <option value="All">All Birthdays</option>
            {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>


          <button onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: "#fff", color: "#013F99", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {sortOrder === "asc" ? (<><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>) : (<><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>)}
            </svg>
            {sortOrder === "asc" ? "Oldest First" : "Newest First"}
          </button>
          <button onClick={() => setAddModal(true)}
            style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Employee
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading employees...</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f6fbfe" }}>
                    {["ID No.", "Name", "Position", "Department", "Area", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid rgba(1,63,153,0.08)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No employees found.</td></tr>
                  ) : (
                    paginated.map((emp, i) => (
                      <tr key={emp.id} style={{ borderBottom: "1px solid rgba(1,63,153,0.05)", background: i % 2 === 0 ? "#fff" : "#fafcff", transition: "background 0.15s", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(1,63,153,0.04)"}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafcff"}>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#013F99" }}>{emp.id}</td>
                        <td style={{ padding: "12px 16px", color: "#0b1a3b", fontWeight: 500 }}>{emp.full_name}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{emp.job_position || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{emp.department || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{emp.area || "—"}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: emp.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: emp.status === "Active" ? "#16a34a" : "#dc2626" }}>{emp.status}</span>
                        </td>
<td style={{ padding: "12px 16px" }}>
  <div style={{ display: "flex", gap: 8 }}>
    <button onClick={() => openEdit(emp)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>Edit</button>
    <button onClick={() => { setViewData(emp); setViewModal(true); }} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(76,177,233,0.3)", background: "#fff", color: "#4CB1E9", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      View
    </button>
    {birthMonth !== "All" && (
      <button
        onClick={() => handleDownloadPoster(emp)}
        disabled={downloadingId === emp.id}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid rgba(243,207,71,0.4)",
          background: downloadingId === emp.id ? "#f6fbfe" : "#fff",
          color: "#b8860b",
          fontSize: 11,
          fontWeight: 600,
          cursor: downloadingId === emp.id ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {downloadingId === emp.id ? "Generating..." : "Download"}
      </button>
    )}
  </div>
</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(1,63,153,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} employees</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.12)", background: currentPage === 1 ? "#f6fbfe" : "#fff", color: currentPage === 1 ? "#94a3b8" : "#013F99", fontSize: 12, fontWeight: 600, cursor: currentPage === 1 ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif" }}>← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push("..."); acc.push(p); return acc; }, []).map((p, idx) => (
                    p === "..." ? <span key={`dots-${idx}`} style={{ padding: "7px 10px", color: "#94a3b8", fontSize: 12 }}>...</span> :
                    <button key={p} onClick={() => setCurrentPage(p)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.12)", background: currentPage === p ? "#013F99" : "#fff", color: currentPage === p ? "#fff" : "#013F99", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>{p}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.12)", background: currentPage === totalPages ? "#f6fbfe" : "#fff", color: currentPage === totalPages ? "#94a3b8" : "#013F99", fontSize: 12, fontWeight: 600, cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif" }}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ADD EMPLOYEE MODAL */}
      {addModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: "20px", overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 1000, maxHeight: "90vh", overflowY: "auto", overflowX: "hidden", padding: "36px 40px", boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Add Employee</h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID will be auto-generated upon saving</p>
              </div>
              <button onClick={() => setAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 32 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div>
                <SectionHeader title="Personal Information" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[["First Name","first_name"],["Middle Name","middle_name"],["Last Name","last_name"],["Nickname","nickname"]].map(([label, field]) => (
                    <div key={field} style={fieldStyle}><label style={labelStyle}>{label}</label><input type="text" value={addData[field] || ""} onChange={(e) => setAddData(prev => ({ ...prev, [field]: e.target.value }))} style={inputStyle} /></div>
                  ))}
                  <div style={fieldStyle}><label style={labelStyle}>Date of Birth</label><input type="date" value={addData.dob || ""} onChange={(e) => setAddData(prev => ({ ...prev, dob: e.target.value }))} style={inputStyle} /></div>
                  <div style={fieldStyle}><label style={labelStyle}>Blood Type</label><input type="text" value={addData.blood_type || ""} onChange={(e) => setAddData(prev => ({ ...prev, blood_type: e.target.value }))} style={inputStyle} placeholder="e.g. O+" /></div>
                </div>
              </div>

              <div>
                <SectionHeader title="Employment Information" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 16 }}>
                  {[["Job Position","job_position"],["Department","department"],["Area","area"]].map(([label, field]) => (
                    <div key={field} style={fieldStyle}><label style={labelStyle}>{label}</label><input type="text" value={addData[field] || ""} onChange={(e) => setAddData(prev => ({ ...prev, [field]: e.target.value }))} style={inputStyle} /></div>
                  ))}
                  <div style={fieldStyle}><label style={labelStyle}>Date Hired</label><input type="date" value={addData.date_hired || ""} onChange={(e) => setAddData(prev => ({ ...prev, date_hired: e.target.value }))} style={inputStyle} /></div>
                  <div style={fieldStyle}><label style={labelStyle}>Status</label>
                    <select value={addData.status || "Active"} onChange={(e) => setAddData(prev => ({ ...prev, status: e.target.value }))} style={inputStyle}>
                      <option value="Active">Active</option><option value="In-active">In-active</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <SectionHeader title="Government Information" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                  {[["SSS No.","sss"],["TIN No.","tin"],["PhilHealth No.","philhealth"],["HDMF No.","hdmf"]].map(([label, field]) => (
                    <div key={field} style={fieldStyle}><label style={labelStyle}>{label}</label><input type="text" value={addData[field] || ""} onChange={(e) => setAddData(prev => ({ ...prev, [field]: e.target.value }))} style={inputStyle} /></div>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeader title="Contact Information" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[["Contact Number","contact_number"],["Contact Person","contact_person"]].map(([label, field]) => (
                    <div key={field} style={fieldStyle}><label style={labelStyle}>{label}</label><input type="text" value={addData[field] || ""} onChange={(e) => setAddData(prev => ({ ...prev, [field]: e.target.value }))} style={inputStyle} /></div>
                  ))}
                  <div style={{ gridColumn: "1 / -1", ...fieldStyle }}><label style={labelStyle}>Address</label><input type="text" value={addData.address || ""} onChange={(e) => setAddData(prev => ({ ...prev, address: e.target.value }))} style={inputStyle} /></div>
                </div>
              </div>

              <div>
                <SectionHeader title="Attachments" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <label style={labelStyle}>Employee Picture</label>
                    <input type="file" accept="image/*" onChange={(e) => setPictureFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box" }} />
                    {pictureFile && <div style={{ display: "flex", alignItems: "center", gap: 12 }}><img src={URL.createObjectURL(pictureFile)} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)" }} /><div><div style={{ fontSize: 12, fontWeight: 600, color: "#0b1a3b" }}>{pictureFile.name}</div><div style={{ fontSize: 11, color: "#64748b" }}>{(pictureFile.size / 1024).toFixed(1)} KB</div></div></div>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <label style={labelStyle}>Signature</label>
                    <input type="file" accept="image/*" onChange={(e) => setSignatureFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box" }} />
                    {signatureFile && <div style={{ display: "flex", alignItems: "center", gap: 12 }}><img src={URL.createObjectURL(signatureFile)} alt="preview" style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)", background: "#f6fbfe" }} /><div><div style={{ fontSize: 12, fontWeight: 600, color: "#0b1a3b" }}>{signatureFile.name}</div><div style={{ fontSize: 11, color: "#64748b" }}>{(signatureFile.size / 1024).toFixed(1)} KB</div></div></div>}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 36, paddingTop: 24, borderTop: "1px solid rgba(1,63,153,0.08)" }}>
              <button onClick={() => setAddModal(false)} style={{ padding: "11px 28px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
              <button onClick={handleAdd} disabled={adding} style={{ padding: "11px 28px", borderRadius: 10, border: "none", background: adding ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: adding ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif" }}>{adding ? "Saving..." : "Add Employee"}</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewModal && viewData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 800, overflowX: "hidden", padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Employee Profile</h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID: {viewData.id}</p>
              </div>
              <button onClick={() => setViewModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

            {/* PROFILE HEADER */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, padding: "16px 20px", background: "#f6fbfe", borderRadius: 14, border: "1px solid rgba(1,63,153,0.06)" }}>
              {viewData.picture ? (
                <img src={viewData.picture} alt="employee" style={{ width: 100, height: 120, objectFit: "cover", objectPosition: "center top", borderRadius: 10, border: "3px solid rgba(1,63,153,0.15)", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 100, height: 120, borderRadius: 10, background: "linear-gradient(135deg, #013F99, #4CB1E9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{viewData.first_name?.[0]?.toUpperCase() || "?"}</span>
                </div>
              )}
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", fontFamily: "'Montserrat', sans-serif" }}>{viewData.full_name}</div>
                <div style={{ fontSize: 13, color: "#4CB1E9", fontWeight: 500, marginTop: 2 }}>{viewData.job_position || "—"}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                  {viewData.department && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(1,63,153,0.08)", color: "#013F99", fontWeight: 600 }}>{viewData.department}</span>}
                  {viewData.area && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(1,63,153,0.08)", color: "#013F99", fontWeight: 600 }}>{viewData.area}</span>}
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: viewData.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: viewData.status === "Active" ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{viewData.status}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {[
                ["First Name", viewData.first_name], ["Middle Name", viewData.middle_name], ["Last Name", viewData.last_name],
                ["Nickname", viewData.nickname], ["Date of Birth", viewData.dob], ["Blood Type", viewData.blood_type],
                ["Date Hired", viewData.date_hired], ["SSS No.", viewData.sss], ["TIN No.", viewData.tin],
                ["PhilHealth No.", viewData.philhealth], ["HDMF No.", viewData.hdmf], 
                
              ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "16px 18px", background: "#f6fbfe", borderRadius: 12, border: "1px solid rgba(1,63,153,0.08)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
                <div style={{ fontSize: 14, color: "#0b1a3b", fontWeight: 600 }}>{value || "—"}</div>
              </div>
              ))}


{/* EMERGENCY SEPARATOR */}
<div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
  <div style={{ flex: 1, height: 1, background: "rgba(239,68,68,0.2)" }} />
  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
    </svg>
    <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: 1 }}>In Case of Emergency</span>
  </div>
  <div style={{ flex: 1, height: 1, background: "rgba(239,68,68,0.2)" }} />
</div>

{/* EMERGENCY CONTACT Perosn */}
<div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", background: "rgba(239,68,68,0.04)", borderRadius: 12, border: "1px solid rgba(239,68,68,0.12)" }}>
  <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>Contact Person</div>
  <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500 }}>{viewData.contact_person || "—"}</div>
</div>

{/* EMERGENCY NUMBER */}
<div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", background: "rgba(239,68,68,0.04)", borderRadius: 12, border: "1px solid rgba(239,68,68,0.12)" }}>
  <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>Contact Number</div>
  <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500 }}>{viewData.contact_number || "—"}</div>
</div>

{/* ADDRESS */}
<div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", background: "rgba(239,68,68,0.03)", borderRadius: 10, border: "1px solid rgba(1,63,153,0.06)" }}>
  <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>Address</div>
  <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500 }}>{viewData.address || "—"}</div>
</div>
              {viewData.signature && (
                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", background: "#f6fbfe", borderRadius: 10, border: "1px solid rgba(1,63,153,0.06)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>Signature</div>
                  <img src={viewData.signature} alt="signature" style={{ width: 160, height: 80, objectFit: "contain", borderRadius: 10, marginTop: 8, border: "2px solid rgba(1,63,153,0.15)", background: "#fff" }} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button onClick={() => setViewModal(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && editData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 900, overflowX: "hidden", padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Edit Employee</h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID: {editData.id}</p>
              </div>
              <button onClick={() => setEditModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                ["First Name","first_name",null], ["Middle Name","middle_name",null], ["Last Name","last_name",null],
                ["Nickname","nickname",null], ["Date of Birth","dob","date"], ["Blood Type","blood_type",null],
                ["Job Position","job_position",null], ["Department","department",null], ["Area","area",null],
                ["Date Hired","date_hired","date"], ["SSS No.","sss",null], ["TIN No.","tin",null],
                ["PhilHealth No.","philhealth",null], ["HDMF No.","hdmf",null], ["Contact Number","contact_number",null],
                ["Contact Person","contact_person",null],
              ].map(([label, field, type]) => (
                <div key={field} style={fieldStyle}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type || "text"} value={editData[field] || ""} onChange={(e) => handleEditChange(field, e.target.value)} style={inputStyle} />
                </div>
              ))}

              <div style={{ gridColumn: "1 / -1", ...fieldStyle }}>
                <label style={labelStyle}>Address</label>
                <input type="text" value={editData.address || ""} onChange={(e) => handleEditChange("address", e.target.value)} style={inputStyle} />
              </div>

              <div style={{ gridColumn: "1 / -1", ...fieldStyle }}>
                <label style={labelStyle}>Status</label>
                <select value={editData.status || "Active"} onChange={(e) => handleEditChange("status", e.target.value)} style={inputStyle}>
                  <option value="Active">Active</option><option value="In-active">In-active</option>
                </select>
              </div>

<div style={{ gridColumn: "1 / -1", ...fieldStyle }}>
  <label style={labelStyle}>Employee Picture</label>
  {(editData.picture && !editPictureFile) && (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
      <img src={editData.picture} alt="current" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)" }} />
      <button type="button" onClick={() => handleEditChange("picture", null)}
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )}
  {editPictureFile && (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
      <img src={URL.createObjectURL(editPictureFile)} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)" }} />
      <button type="button" onClick={() => setEditPictureFile(null)}
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )}
  <input type="file" accept="image/*" onChange={(e) => setEditPictureFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box" }} />
  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Leave blank to keep current picture</p>
</div>

<div style={{ gridColumn: "1 / -1", ...fieldStyle }}>
  <label style={labelStyle}>Signature</label>
  {(editData.signature && !editSignatureFile) && (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
      <img src={editData.signature} alt="current" style={{ width: 120, height: 60, objectFit: "contain", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)", background: "#f6fbfe" }} />
      <button type="button" onClick={() => handleEditChange("signature", null)}
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )}
  {editSignatureFile && (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
      <img src={URL.createObjectURL(editSignatureFile)} alt="preview" style={{ width: 120, height: 60, objectFit: "contain", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)", background: "#f6fbfe" }} />
      <button type="button" onClick={() => setEditSignatureFile(null)}
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )}
  <input type="file" accept="image/*" onChange={(e) => setEditSignatureFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box" }} />
  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Leave blank to keep current signature</p>
</div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(1,63,153,0.08)" }}>
              <button onClick={() => setEditModal(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: saving ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif" }}>{saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
