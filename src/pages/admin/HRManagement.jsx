import { useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";

export default function HRManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [birthMonth, setBirthMonth] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [sortOrder]);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabaseEmployees
      .from("employees")
      .select("*")
      .order("id", { ascending: sortOrder === "asc" });
    if (!error) setEmployees(data);
    setLoading(false);
  };

      const openEdit = (emp) => {
      setEditData({ ...emp });
      setEditModal(true);
    };

    const handleEditChange = (field, value) => {
      setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
      setSaving(true);
      const { error } = await supabaseEmployees
        .from("employees")
        .update({
          first_name:     editData.first_name,
          middle_name:    editData.middle_name,
          last_name:      editData.last_name,
          full_name:      `${editData.first_name} ${editData.middle_name ? editData.middle_name[0] + '. ' : ''}${editData.last_name}`,
          nickname:       editData.nickname,
          job_position:   editData.job_position,
          department:     editData.department,
          area:           editData.area,
          status:         editData.status,
          blood_type:     editData.blood_type,
          dob:            editData.dob,
          sss:            editData.sss,
          tin:            editData.tin,
          philhealth:     editData.philhealth,
          hdmf:           editData.hdmf,
          contact_person: editData.contact_person,
          address:        editData.address,
          contact_number: editData.contact_number,
        })
        .eq("id", editData.id);

      setSaving(false);
      if (!error) {
        setEditModal(false);
        fetchEmployees();
      } else {
        alert("Error saving: " + error.message);
      }
    };

  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.id?.toLowerCase().includes(search.toLowerCase()) ||
      emp.job_position?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || emp.status === statusFilter;
    const matchBirthMonth = birthMonth === "All" || (
      emp.dob && new Date(emp.dob).getMonth() + 1 === parseInt(birthMonth)
    );
    return matchSearch && matchStatus && matchBirthMonth;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const total = employees.length;
  const active = employees.filter((e) => e.status === "Active").length;
  const inactive = employees.filter((e) => e.status === "In-active").length;

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
          HR Management
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
          Manage employee records
        </p>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { label: "Total Employees", value: total, color: "#013F99" },
          { label: "Active", value: active, color: "#22c55e" },
          { label: "Inactive", value: inactive, color: "#ef4444" },
        ].map((card) => (
          <div key={card.label} style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px",
            border: "1px solid rgba(1,63,153,0.08)",
            borderLeft: `4px solid ${card.color}`,
          }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: card.color, marginTop: 8 }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* TABLE CARD */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(1,63,153,0.08)", overflow: "hidden" }}>

        {/* FILTERS */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(1,63,153,0.08)", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          
          {/* SEARCH */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search by name, ID, or position..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "10px 16px 10px 36px",
                border: "1px solid rgba(1,63,153,0.12)",
                borderRadius: 10, fontSize: 13, color: "#0b1a3b",
                outline: "none", fontFamily: "'Poppins', sans-serif",
              }}
            />
          </div>

          {/* BIRTHDAY MONTH FILTER */}
          <select
            value={birthMonth}
            onChange={(e) => { setBirthMonth(e.target.value); setCurrentPage(1); }}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: "1px solid rgba(1,63,153,0.12)",
              background: birthMonth !== "All" ? "#013F99" : "#fff",
              color: birthMonth !== "All" ? "#fff" : "#64748b",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
            }}
          >
            <option value="All">All Birthdays</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          {/* STATUS FILTER */}
          {["All", "Active", "In-active"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              style={{
                padding: "9px 18px",
                borderRadius: 10,
                border: "1px solid rgba(1,63,153,0.12)",
                background: statusFilter === s ? "#013F99" : "#fff",
                color: statusFilter === s ? "#fff" : "#64748b",
                fontSize: 12, fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {s}
            </button>
          ))}

{/* SORT BUTTON */}
<button
  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
  style={{
    padding: "9px 18px",
    borderRadius: 10,
    border: "1px solid rgba(1,63,153,0.12)",
    background: "#fff",
    color: "#013F99",
    fontSize: 12, fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    display: "flex", alignItems: "center", gap: 6,
  }}
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {sortOrder === "asc" ? (
      <>
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
      </>
    ) : (
      <>
        <line x1="12" y1="5" x2="12" y2="19"/>
        <polyline points="19 12 12 19 5 12"/>
      </>
    )}
  </svg>
  {sortOrder === "asc" ? "Oldest First" : "Newest First"}
</button>

{/* ADD BUTTON */}
<button style={{
  padding: "9px 18px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(90deg, #013F99, #4CB1E9)",
  color: "#fff",
  fontSize: 12, fontWeight: 600,
  cursor: "pointer",
  fontFamily: "'Poppins', sans-serif",
  display: "flex", alignItems: "center", gap: 6,
}}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
  Add Employee
</button>
</div>

        {/* TABLE */}
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading employees...</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f6fbfe" }}>
                    {["ID No.", "Name", "Position", "Department", "Area", "Status", "Actions"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        borderBottom: "1px solid rgba(1,63,153,0.08)",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((emp, i) => (
                      <tr
                          key={emp.id}
                          style={{ borderBottom: "1px solid rgba(1,63,153,0.05)", background: i % 2 === 0 ? "#fff" : "#fafcff", transition: "background 0.15s", cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(1,63,153,0.04)"}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafcff"}
                        >
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#013F99" }}>{emp.id}</td>
                        <td style={{ padding: "12px 16px", color: "#0b1a3b", fontWeight: 500 }}>{emp.full_name}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{emp.job_position || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{emp.department || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{emp.area || "—"}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                            background: emp.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                            color: emp.status === "Active" ? "#16a34a" : "#dc2626",
                          }}>
                            {emp.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => openEdit(emp)}
                          style={{
                            padding: "6px 12px", borderRadius: 8,
                            border: "1px solid rgba(1,63,153,0.2)",
                            background: "#fff", color: "#013F99",
                            fontSize: 11, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                          }}>

                          Edit
                        </button>
                        <button
                          onClick={() => { setViewData(emp); setViewModal(true); }}
                          style={{
                            padding: "6px 10px", borderRadius: 8,
                            border: "1px solid rgba(76,177,233,0.3)",
                            background: "#fff", color: "#4CB1E9",
                            fontSize: 11, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>
                      </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(1,63,153,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} employees
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "7px 14px", borderRadius: 8,
                      border: "1px solid rgba(1,63,153,0.12)",
                      background: currentPage === 1 ? "#f6fbfe" : "#fff",
                      color: currentPage === 1 ? "#94a3b8" : "#013F99",
                      fontSize: 12, fontWeight: 600,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) => (
                      p === "..." ? (
                        <span key={`dots-${idx}`} style={{ padding: "7px 10px", color: "#94a3b8", fontSize: 12 }}>...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          style={{
                            padding: "7px 12px", borderRadius: 8,
                            border: "1px solid rgba(1,63,153,0.12)",
                            background: currentPage === p ? "#013F99" : "#fff",
                            color: currentPage === p ? "#fff" : "#013F99",
                            fontSize: 12, fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {p}
                        </button>
                      )
                    ))
                  }

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "7px 14px", borderRadius: 8,
                      border: "1px solid rgba(1,63,153,0.12)",
                      background: currentPage === totalPages ? "#f6fbfe" : "#fff",
                      color: currentPage === totalPages ? "#94a3b8" : "#013F99",
                      fontSize: 12, fontWeight: 600,
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

{/* VIEW MODAL */}
{viewModal && viewData && (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 20,
  }}>
    <div style={{
      background: "#fff", borderRadius: 20,
      width: "100%", maxWidth: 600,
      maxHeight: "90vh", overflowY: "auto",
      padding: 32,
    }}>
      {/* MODAL HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
            Employee Profile
          </h2>
          <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID: {viewData.id}</p>
        </div>
        <button
          onClick={() => setViewModal(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* ACCENT LINE */}
      <div style={{
        height: 3,
        background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)",
        borderRadius: 2, marginBottom: 24,
      }} />

      {/* PROFILE INFO */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "First Name", value: viewData.first_name },
          { label: "Middle Name", value: viewData.middle_name },
          { label: "Last Name", value: viewData.last_name },
          { label: "Nickname", value: viewData.nickname },
          { label: "Job Position", value: viewData.job_position },
          { label: "Department", value: viewData.department },
          { label: "Area", value: viewData.area },
          { label: "Blood Type", value: viewData.blood_type },
          { label: "Date of Birth", value: viewData.dob },
          { label: "Contact Number", value: viewData.contact_number },
          { label: "SSS No.", value: viewData.sss },
          { label: "TIN No.", value: viewData.tin },
          { label: "PhilHealth No.", value: viewData.philhealth },
          { label: "HDMF No.", value: viewData.hdmf },
          { label: "Contact Person", value: viewData.contact_person },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: "flex", flexDirection: "column", gap: 4,
            padding: "12px 16px",
            background: "#f6fbfe",
            borderRadius: 10,
            border: "1px solid rgba(1,63,153,0.06)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>
              {label}
            </div>
            <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500 }}>
              {value || "—"}
            </div>
          </div>
        ))}

        {/* ADDRESS - full width */}
        <div style={{
          gridColumn: "1 / -1",
          display: "flex", flexDirection: "column", gap: 4,
          padding: "12px 16px",
          background: "#f6fbfe",
          borderRadius: 10,
          border: "1px solid rgba(1,63,153,0.06)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>
            Address
          </div>
          <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500 }}>
            {viewData.address || "—"}
          </div>
        </div>

        {/* STATUS - full width */}
        <div style={{
          gridColumn: "1 / -1",
          display: "flex", flexDirection: "column", gap: 4,
          padding: "12px 16px",
          background: "#f6fbfe",
          borderRadius: 10,
          border: "1px solid rgba(1,63,153,0.06)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>
            Status
          </div>
          <span style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 12, fontWeight: 600,
            background: viewData.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: viewData.status === "Active" ? "#16a34a" : "#dc2626",
            width: "fit-content",
          }}>
            {viewData.status}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <button
          onClick={() => setViewModal(false)}
          style={{
            padding: "10px 24px", borderRadius: 10,
            border: "1px solid rgba(1,63,153,0.15)",
            background: "#fff", color: "#64748b",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* EDIT MODAL */}
{editModal && editData && (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 20,
  }}>
    <div style={{
      background: "#fff", borderRadius: 20,
      width: "100%", maxWidth: 600,
      maxHeight: "90vh", overflowY: "auto",
      padding: 32,
    }}>
      {/* MODAL HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
            Edit Employee
          </h2>
          <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID: {editData.id}</p>
        </div>
        <button
          onClick={() => setEditModal(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* FORM FIELDS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "First Name", field: "first_name" },
          { label: "Middle Name", field: "middle_name" },
          { label: "Last Name", field: "last_name" },
          { label: "Nickname", field: "nickname" },
          { label: "Job Position", field: "job_position" },
          { label: "Department", field: "department" },
          { label: "Area", field: "area" },
          { label: "Blood Type", field: "blood_type" },
          { label: "Date of Birth", field: "dob", type: "date" },
          { label: "Contact Number", field: "contact_number" },
          { label: "SSS No.", field: "sss" },
          { label: "TIN No.", field: "tin" },
          { label: "PhilHealth No.", field: "philhealth" },
          { label: "HDMF No.", field: "hdmf" },
          { label: "Contact Person", field: "contact_person" },
        ].map(({ label, field, type }) => (
          <div key={field} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 }}>
              {label}
            </label>
            <input
              type={type || "text"}
              value={editData[field] || ""}
              onChange={(e) => handleEditChange(field, e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid rgba(1,63,153,0.15)",
                borderRadius: 8, fontSize: 13, color: "#0b1a3b",
                outline: "none", fontFamily: "'Poppins', sans-serif",
              }}
            />
          </div>
        ))}

        {/* ADDRESS - full width */}
        <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 }}>
            Address
          </label>
          <input
            type="text"
            value={editData.address || ""}
            onChange={(e) => handleEditChange("address", e.target.value)}
            style={{
              padding: "10px 12px",
              border: "1px solid rgba(1,63,153,0.15)",
              borderRadius: 8, fontSize: 13, color: "#0b1a3b",
              outline: "none", fontFamily: "'Poppins', sans-serif",
            }}
          />
        </div>

        {/* STATUS - full width */}
        <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 }}>
            Status
          </label>
          <select
            value={editData.status || "Active"}
            onChange={(e) => handleEditChange("status", e.target.value)}
            style={{
              padding: "10px 12px",
              border: "1px solid rgba(1,63,153,0.15)",
              borderRadius: 8, fontSize: 13, color: "#0b1a3b",
              outline: "none", fontFamily: "'Poppins', sans-serif",
            }}
          >
            <option value="Active">Active</option>
            <option value="In-active">In-active</option>
          </select>
        </div>
      </div>

      {/* MODAL FOOTER */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
        <button
          onClick={() => setEditModal(false)}
          style={{
            padding: "10px 24px", borderRadius: 10,
            border: "1px solid rgba(1,63,153,0.15)",
            background: "#fff", color: "#64748b",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "10px 24px", borderRadius: 10,
            border: "none",
            background: saving ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)",
            color: "#fff",
            fontSize: 13, fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}