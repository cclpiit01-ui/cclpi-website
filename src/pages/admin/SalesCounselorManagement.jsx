import { useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";

/**
 * Sales Counselor Management
 * ---------------------------------------------------------------
 * Styled to match HRManagement.jsx exactly (same colors, fonts,
 * card/table/modal patterns). No sidebar in this file — it renders
 * inside AdminDashboard's <Outlet />, same as HRManagement does.
 *
 * Table assumed: "sales_counselors" in the same Supabase project
 * as "employees". Rename SC_TABLE below if yours differs.
 *
 * Columns used (per your schema):
 *   id_no, full_name, birthday, address, expiry_date, is_paid,
 *   or_date, picture, signature, date_released, position, manager,
 *   agency
 * ---------------------------------------------------------------
 */

const SC_TABLE = "sales_counselors";

// Static company info for the printed welcome letter — edit once here.
const COMPANY = {
  addressLine1: "35 Jesus V. Seriña St., Brgy.",
  addressLine2: "Carmen, Cagayan de Oro City, 9000",
  phone: "09178535144",
  email: "cclpisales@cclpi.com.ph",
  website: "www.cclpi.com.ph",
  signatoryName: "Mansueto V. Dela Peña",
  signatoryTitle: "President & CEO",
};

export default function SalesCounselorManagement() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [agencyFilter, setAgencyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [addData, setAddData] = useState({});
  const [adding, setAdding] = useState(false);
  const [printData, setPrintData] = useState(null);

  const [pictureFile, setPictureFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [editPictureFile, setEditPictureFile] = useState(null);
  const [editSignatureFile, setEditSignatureFile] = useState(null);

  useEffect(() => { fetchCounselors(); }, [sortOrder]);

  const fetchCounselors = async () => {
    setLoading(true);
    const { data, error } = await supabaseEmployees
      .from(SC_TABLE)
      .select("*")
      .order("date_released", { ascending: sortOrder === "asc" });
    if (!error) setCounselors(data || []);
    setLoading(false);
  };

  const openEdit = (sc) => { setEditData({ ...sc }); setEditModal(true); };
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
      if (editPictureFile) pictureUrl = await uploadFile(editPictureFile, 'sc_pictures');
      if (editSignatureFile) signatureUrl = await uploadFile(editSignatureFile, 'sc_signatures');
      const { error } = await supabaseEmployees.from(SC_TABLE).update({
        full_name: editData.full_name, birthday: editData.birthday, address: editData.address,
        expiry_date: editData.expiry_date, is_paid: editData.is_paid, or_date: editData.or_date,
        picture: pictureUrl, signature: signatureUrl, date_released: editData.date_released,
        position: editData.position, manager: editData.manager, agency: editData.agency,
      }).eq("id_no", editData.id_no);
      setSaving(false);
      if (!error) { setEditModal(false); setEditPictureFile(null); setEditSignatureFile(null); fetchCounselors(); }
      else alert("Error saving: " + error.message);
    } catch (err) { alert("Upload error: " + err.message); setSaving(false); }
  };

  const handleAdd = async () => {
    if (!addData.id_no || !addData.full_name) { alert("ID No. and Full Name are required."); return; }
    setAdding(true);
    try {
      let pictureUrl = null, signatureUrl = null;
      if (pictureFile) pictureUrl = await uploadFile(pictureFile, 'sc_pictures');
      if (signatureFile) signatureUrl = await uploadFile(signatureFile, 'sc_signatures');
      const { error } = await supabaseEmployees.from(SC_TABLE).insert({
        ...addData, picture: pictureUrl, signature: signatureUrl, is_paid: addData.is_paid || 'No',
      });
      if (error) alert('Error adding sales counselor: ' + error.message);
      else { setAddModal(false); setAddData({}); setPictureFile(null); setSignatureFile(null); fetchCounselors(); }
    } catch (err) { alert('Upload error: ' + err.message); }
    setAdding(false);
  };

  const filtered = counselors.filter((sc) => {
    const matchSearch = sc.full_name?.toLowerCase().includes(search.toLowerCase()) || sc.id_no?.toLowerCase().includes(search.toLowerCase()) || sc.position?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || (statusFilter === "Paid" ? String(sc.is_paid).toLowerCase().startsWith("y") : !String(sc.is_paid).toLowerCase().startsWith("y"));
    const matchAgency = agencyFilter === "All" || sc.agency === agencyFilter;
    return matchSearch && matchStatus && matchAgency;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const agencies = ["All", ...new Set(counselors.map(sc => sc.agency).filter(Boolean).sort())];
  const total = counselors.length;
  const paid = counselors.filter((sc) => String(sc.is_paid).toLowerCase().startsWith("y")).length;
  const unpaid = total - paid;

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
      <style>{PRINT_CSS}</style>

      <div className="no-print">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Sales Counselor Management</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Manage sales counselor records</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
          {[{ label: "Total Sales Counselors", value: total, color: "#013F99" }, { label: "Paid", value: paid, color: "#22c55e" }, { label: "Unpaid", value: unpaid, color: "#ef4444" }].map((card) => (
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

            {["All", "Paid", "Unpaid"].map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: statusFilter === s ? "#013F99" : "#fff", color: statusFilter === s ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                {s}
              </button>
            ))}

            <select
              value={agencyFilter}
              onChange={(e) => { setAgencyFilter(e.target.value); setCurrentPage(1); }}
              style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: agencyFilter !== "All" ? "#013F99" : "#fff", color: agencyFilter !== "All" ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", outline: "none" }}
            >
              {agencies.map((a) => (
                <option key={a} value={a}>{a === "All" ? "All Agencies" : a}</option>
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
              Add Sales Counselor
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading sales counselors...</div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f6fbfe" }}>
                      {["ID No.", "Name", "Position", "Agency", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid rgba(1,63,153,0.08)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No sales counselors found.</td></tr>
                    ) : (
                      paginated.map((sc, i) => {
                        const isPaid = String(sc.is_paid).toLowerCase().startsWith("y");
                        return (
                          <tr key={sc.id_no} style={{ borderBottom: "1px solid rgba(1,63,153,0.05)", background: i % 2 === 0 ? "#fff" : "#fafcff", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(1,63,153,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafcff"}>
                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "#013F99" }}>{sc.id_no}</td>
                            <td style={{ padding: "12px 16px", color: "#0b1a3b", fontWeight: 500 }}>{sc.full_name}</td>
                            <td style={{ padding: "12px 16px", color: "#64748b" }}>{sc.position || "—"}</td>
                            <td style={{ padding: "12px 16px", color: "#64748b" }}>{sc.agency || "—"}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: isPaid ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: isPaid ? "#16a34a" : "#dc2626" }}>{isPaid ? "Paid" : "Unpaid"}</span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => openEdit(sc)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                                <button onClick={() => { setViewData(sc); setViewModal(true); }} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(76,177,233,0.3)", background: "#fff", color: "#4CB1E9", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                  View
                                </button>
                                <button onClick={() => setPrintData(sc)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(243,207,71,0.4)", background: "#fff", color: "#b8860b", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                  Print
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

              {totalPages > 1 && (
                <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(1,63,153,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} sales counselors</div>
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

        {/* ADD MODAL */}
        {addModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: "20px", overflowY: "auto" }}>
            <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", overflowX: "hidden", padding: "36px 40px", boxSizing: "border-box", margin: "20px auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Add Sales Counselor</h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID No. is required and must be unique</p>
                </div>
                <button onClick={() => setAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 32 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <SectionHeader title="Basic Information" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div style={fieldStyle}><label style={labelStyle}>ID No.</label><input type="text" value={addData.id_no || ""} onChange={(e) => setAddData(prev => ({ ...prev, id_no: e.target.value }))} style={inputStyle} placeholder="e.g. M-SC-0001" /></div>
                    <div style={fieldStyle}><label style={labelStyle}>Full Name</label><input type="text" value={addData.full_name || ""} onChange={(e) => setAddData(prev => ({ ...prev, full_name: e.target.value }))} style={inputStyle} /></div>
                    <div style={fieldStyle}><label style={labelStyle}>Birthday</label><input type="date" value={addData.birthday || ""} onChange={(e) => setAddData(prev => ({ ...prev, birthday: e.target.value }))} style={inputStyle} /></div>
                  </div>
                </div>

                <div>
                  <SectionHeader title="Assignment" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div style={fieldStyle}><label style={labelStyle}>Position</label><input type="text" value={addData.position || ""} onChange={(e) => setAddData(prev => ({ ...prev, position: e.target.value }))} style={inputStyle} /></div>
                    <div style={fieldStyle}><label style={labelStyle}>Agency</label><input type="text" value={addData.agency || ""} onChange={(e) => setAddData(prev => ({ ...prev, agency: e.target.value }))} style={inputStyle} /></div>
                    <div style={fieldStyle}><label style={labelStyle}>Manager</label><input type="text" value={addData.manager || ""} onChange={(e) => setAddData(prev => ({ ...prev, manager: e.target.value }))} style={inputStyle} /></div>
                  </div>
                  <div style={{ gridColumn: "1 / -1", ...fieldStyle, marginTop: 16 }}><label style={labelStyle}>Address</label><input type="text" value={addData.address || ""} onChange={(e) => setAddData(prev => ({ ...prev, address: e.target.value }))} style={inputStyle} /></div>
                </div>

                <div>
                  <SectionHeader title="ID & Payment" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                    <div style={fieldStyle}><label style={labelStyle}>Expiry Date</label><input type="date" value={addData.expiry_date || ""} onChange={(e) => setAddData(prev => ({ ...prev, expiry_date: e.target.value }))} style={inputStyle} /></div>
                    <div style={fieldStyle}><label style={labelStyle}>OR Date</label><input type="date" value={addData.or_date || ""} onChange={(e) => setAddData(prev => ({ ...prev, or_date: e.target.value }))} style={inputStyle} /></div>
                    <div style={fieldStyle}><label style={labelStyle}>Date Released</label><input type="date" value={addData.date_released || ""} onChange={(e) => setAddData(prev => ({ ...prev, date_released: e.target.value }))} style={inputStyle} /></div>
                    <div style={fieldStyle}><label style={labelStyle}>Payment Status</label>
                      <select value={addData.is_paid || "No"} onChange={(e) => setAddData(prev => ({ ...prev, is_paid: e.target.value }))} style={inputStyle}>
                        <option value="Yes">Paid</option><option value="No">Unpaid</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <SectionHeader title="Attachments" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <label style={labelStyle}>Sales Counselor Picture</label>
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
                <button onClick={handleAdd} disabled={adding} style={{ padding: "11px 28px", borderRadius: 10, border: "none", background: adding ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: adding ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif" }}>{adding ? "Saving..." : "Add Sales Counselor"}</button>
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
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Sales Counselor Profile</h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID No.: {viewData.id_no}</p>
                </div>
                <button onClick={() => setViewModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, padding: "16px 20px", background: "#f6fbfe", borderRadius: 14, border: "1px solid rgba(1,63,153,0.06)" }}>
                {viewData.picture ? (
                  <img src={viewData.picture} alt="sales counselor" style={{ width: 100, height: 120, objectFit: "cover", objectPosition: "center top", borderRadius: 10, border: "3px solid rgba(1,63,153,0.15)", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 100, height: 120, borderRadius: 10, background: "linear-gradient(135deg, #013F99, #4CB1E9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{viewData.full_name?.[0]?.toUpperCase() || "?"}</span>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", fontFamily: "'Montserrat', sans-serif" }}>{viewData.full_name}</div>
                  <div style={{ fontSize: 13, color: "#4CB1E9", fontWeight: 500, marginTop: 2 }}>{viewData.position || "—"}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    {viewData.agency && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(1,63,153,0.08)", color: "#013F99", fontWeight: 600 }}>{viewData.agency}</span>}
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: String(viewData.is_paid).toLowerCase().startsWith("y") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: String(viewData.is_paid).toLowerCase().startsWith("y") ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{String(viewData.is_paid).toLowerCase().startsWith("y") ? "Paid" : "Unpaid"}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {[
                  ["Birthday", viewData.birthday], ["Manager", viewData.manager], ["Expiry Date", viewData.expiry_date],
                  ["OR Date", viewData.or_date], ["Date Released", viewData.date_released],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "16px 18px", background: "#f6fbfe", borderRadius: 12, border: "1px solid rgba(1,63,153,0.08)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
                    <div style={{ fontSize: 14, color: "#0b1a3b", fontWeight: 600 }}>{value || "—"}</div>
                  </div>
                ))}

                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", background: "#f6fbfe", borderRadius: 10, border: "1px solid rgba(1,63,153,0.06)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>Address</div>
                  <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500 }}>{viewData.address || "—"}</div>
                </div>

                {viewData.signature && (
                  <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 4, padding: "12px 16px", background: "#f6fbfe", borderRadius: 10, border: "1px solid rgba(1,63,153,0.06)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>Signature</div>
                    <img src={viewData.signature} alt="signature" style={{ width: 160, height: 80, objectFit: "contain", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)", background: "#fff", marginTop: 8 }} />
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
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Edit Sales Counselor</h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID No.: {editData.id_no}</p>
                </div>
                <button onClick={() => setEditModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  ["Full Name","full_name",null], ["Birthday","birthday","date"], ["Position","position",null],
                  ["Agency","agency",null], ["Manager","manager",null], ["Expiry Date","expiry_date","date"],
                  ["OR Date","or_date","date"], ["Date Released","date_released","date"],
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
                  <label style={labelStyle}>Payment Status</label>
                  <select value={editData.is_paid || "No"} onChange={(e) => handleEditChange("is_paid", e.target.value)} style={inputStyle}>
                    <option value="Yes">Paid</option><option value="No">Unpaid</option>
                  </select>
                </div>

                <div style={{ gridColumn: "1 / -1", ...fieldStyle }}>
                  <label style={labelStyle}>Picture</label>
                  {(editData.picture && !editPictureFile) && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <img src={editData.picture} alt="current" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)" }} />
                      <button type="button" onClick={() => handleEditChange("picture", null)}
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  )}
                  {editPictureFile && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <img src={URL.createObjectURL(editPictureFile)} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)" }} />
                      <button type="button" onClick={() => setEditPictureFile(null)}
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  )}
                  {editSignatureFile && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <img src={URL.createObjectURL(editSignatureFile)} alt="preview" style={{ width: 120, height: 60, objectFit: "contain", borderRadius: 10, border: "2px solid rgba(1,63,153,0.15)", background: "#f6fbfe" }} />
                      <button type="button" onClick={() => setEditSignatureFile(null)}
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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

      {/* PRINT PREVIEW */}
      {printData && (
        <div style={PRINT_MODAL_OVERLAY} className="no-print-overlay">
          <div style={PRINT_MODAL_TOOLBAR} className="no-print">
            <button onClick={() => setPrintData(null)} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#013F99", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>← Back to list</button>
            <button onClick={() => window.print()} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>🖨️ Print</button>
          </div>
          <div style={PRINT_MODAL_SCROLL} className="no-print-scroll">
            <SCLetter sc={printData} />
          </div>
        </div>
      )}
    </div>
  );
}

function SCLetter({ sc }) {
  const firstName = sc.full_name?.split(" ")[0] || "";
  return (
    <div className="print-area" style={{ width: "210mm", minHeight: "297mm", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ position: "relative", height: "78mm", overflow: "hidden" }}>
        <svg viewBox="0 0 850 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <rect width="850" height="300" fill="#013F99" />
          <path d="M0,0 L850,0 L850,90 Q450,180 0,60 Z" fill="#4CB1E9" />
          <path d="M0,120 L850,180 L850,300 L0,300 Z" fill="#013F99" />
          <path d="M0,150 L850,210 L850,300 L0,300 Z" fill="#0b2f73" />
        </svg>

        <div style={{ position: "absolute", top: "6mm", right: "8mm", color: "#fff", fontSize: "9pt", lineHeight: 1.5, textAlign: "right" }}>
          <div>{COMPANY.addressLine1}</div>
          <div>{COMPANY.addressLine2}</div>
          <div style={{ fontWeight: 700 }}>{COMPANY.phone}</div>
          <div style={{ fontWeight: 700 }}>{COMPANY.email}</div>
          <div>{COMPANY.website}</div>
        </div>

        <div style={{ position: "absolute", top: "12mm", left: "8mm", color: "#fff", fontSize: "24pt", fontWeight: 800 }}>Life Plan</div>

        {sc.picture && (
          <img src={sc.picture} alt={sc.full_name} style={{ position: "absolute", top: "34mm", right: "8mm", width: "22mm", height: "26mm", objectFit: "cover", border: "2px solid #fff", borderRadius: 4 }} />
        )}

        <div style={{ position: "absolute", left: "8mm", bottom: "5mm", right: "60mm", color: "#fff" }}>
          <div style={{ color: "#a7e0ff", fontSize: "10pt", marginBottom: 2 }}>{sc.agency}</div>
          {sc.id_no && <div style={{ color: "#F3CF47", fontWeight: 700, fontSize: "11pt", marginBottom: 2 }}>SALES COUNSELOR CODE: {sc.id_no}</div>}
          <div style={{ fontSize: "12pt", fontWeight: 600, lineHeight: 1.3 }}>{sc.full_name}</div>
          <div style={{ fontSize: "10.5pt", lineHeight: 1.3 }}>{sc.address}</div>
        </div>
      </div>

      <div style={{ padding: "10mm 12mm 12mm", fontSize: "10.5pt", color: "#0b1a3b", lineHeight: 1.5 }}>
        <p>Dear {firstName},</p>
        <p>
          It is our pleasure to welcome you as Sales Counselor for Angelica Life Plan. For easier identification, we
          are sending you your new Sales Counselor Identification card. We are thrilled to have you with us.
        </p>
        <p>
          At CCLPI Plans, we pride ourselves on offering our Sales Counselors a one-of-a-kind professional experience,
          we have unlimited income-earning opportunity, various incentives which includes promotional and travel
          incentives, and a flexible working arrangement. We value our Sales Counselors and treat them as one of the
          most important part of our company, and we work tirelessly to ensure providing service to you. Being a
          Sales Counselor, you become our partner in providing the Filipino people and serving them with the most
          affordable life plan, to help them secure future eventualities.
        </p>
        <p>If you have any question or would more information, please contact</p>
        <div style={{ margin: "10px 0 0 6mm", fontSize: "10.5pt" }}>
          <div><strong>Email:</strong> {COMPANY.email}</div>
          <div><strong>Web:</strong> {COMPANY.website}</div>
          <div><strong>Call:</strong> {COMPANY.phone}</div>
        </div>
        <p style={{ marginTop: 24 }}>Thank you and we look forward to working with you.</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "16mm" }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Warm regards,</div>
            {sc.signature ? (
              <img src={sc.signature} alt="signature" style={{ height: 60, objectFit: "contain" }} />
            ) : (
              <div style={{ fontFamily: "'Brush Script MT', cursive", fontSize: "26pt", color: "#013F99", lineHeight: 1 }}>
                {COMPANY.signatoryName.split(" ").map(w => w[0]).join("")}
              </div>
            )}
            <div style={{ color: "#013F99", fontWeight: 700, marginTop: 4 }}>{COMPANY.signatoryName}</div>
            <div style={{ fontWeight: 700 }}>{COMPANY.signatoryTitle}</div>
          </div>
          <div style={{ width: 70, height: 70, borderRadius: "50%", border: "3px solid #F3CF47", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#013F99" }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>CCLPI</div>
            <div style={{ fontSize: 8, letterSpacing: 1 }}>PLANS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRINT_MODAL_OVERLAY = { position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", flexDirection: "column" };
const PRINT_MODAL_TOOLBAR = { display: "flex", justifyContent: "space-between", padding: "12px 20px", background: "#fff" };
const PRINT_MODAL_SCROLL = { flex: 1, overflow: "auto", display: "flex", justifyContent: "center", padding: "24px 0 48px" };

const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 0; }
  body * { visibility: hidden; }
  .print-area, .print-area * { visibility: visible; }
  .print-area { position: absolute; top: 0; left: 0; width: 210mm; min-height: 297mm; box-shadow: none !important; }
  .no-print { display: none !important; }
  .no-print-scroll { padding: 0 !important; overflow: visible !important; }
}
`;
