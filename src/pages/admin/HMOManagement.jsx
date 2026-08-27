import { useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import * as XLSX from "xlsx";

export default function HMOManagement() {
  const [employees, setEmployees] = useState([]);
  const [membershipMap, setMembershipMap] = useState({});   // employee_id -> current hmo_employees row
  const [dependentCounts, setDependentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");       // Enrolled / Not Enrolled
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState("All");  // Active / In-active
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Main modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [activeMembership, setActiveMembership] = useState(null);
  const [dependents, setDependents] = useState([]);
  const [depLoading, setDepLoading] = useState(false);

  // Membership form (enroll / edit / renew)
  const [membershipFormOpen, setMembershipFormOpen] = useState(false);
  const [membershipFormMode, setMembershipFormMode] = useState("enroll"); // enroll | edit | renew
  const [membershipForm, setMembershipForm] = useState({});
  const [savingMembership, setSavingMembership] = useState(false);

  // Dependent form (add / edit)
  const [depFormOpen, setDepFormOpen] = useState(false);
  const [depForm, setDepForm] = useState({});
  const [editingDepId, setEditingDepId] = useState(null);
  const [savingDep, setSavingDep] = useState(false);
  const [idDocFile, setIdDocFile] = useState(null);
  const [birthCertFile, setBirthCertFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data: empData, error: empError } = await supabaseEmployees
      .from("employees")
      .select("id, full_name, job_position, department, status")
      .order("id");

    if (!empError) setEmployees(empData);

    const { data: memData } = await supabaseEmployees
      .from("hmo_employees")
      .select("*")
      .eq("is_current", true);

    const memMap = {};
    (memData || []).forEach(m => { memMap[m.employee_id] = m; });
    setMembershipMap(memMap);

    const { data: depData } = await supabaseEmployees
      .from("hmo_dependents")
      .select("employee_id");

    const counts = {};
    (depData || []).forEach(d => { counts[d.employee_id] = (counts[d.employee_id] || 0) + 1; });
    setDependentCounts(counts);

    setLoading(false);
  };

  const uploadDependentFile = async (file, folder) => {
    const filename = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { error } = await supabaseEmployees.storage.from('hmo-documents').upload(filename, file);
    if (error) throw error;
    const { data: urlData } = supabaseEmployees.storage.from('hmo-documents').getPublicUrl(filename);
    return urlData.publicUrl;
  };

const handleExportExcel = async () => {
  // 1. Kunin lahat ng current memberships
  const { data: memberships } = await supabaseEmployees
    .from("hmo_employees")
    .select("employee_id, hmo_member_id, effective_date, valid_until")
    .eq("is_current", true);

  const membershipMap = {};
  (memberships || []).forEach(m => { membershipMap[m.employee_id] = m; });

  // 2. Kunin lahat ng dependents
  const { data: allDependents } = await supabaseEmployees
    .from("hmo_dependents")
    .select("employee_id, full_name, hmo_card_number, relationship, birth_date, gender");

  const depsByEmployee = {};
  (allDependents || []).forEach(d => {
    if (!depsByEmployee[d.employee_id]) depsByEmployee[d.employee_id] = [];
    depsByEmployee[d.employee_id].push(d);
  });

  // 3. Gawa ng flat rows: isang row per dependent (o isang row kung walang dependent)
  const rows = [];
  employees.forEach(emp => {
    const deps = depsByEmployee[emp.id] || [];
    const membership = membershipMap[emp.id];
    const totalDeps = deps.length;

    if (deps.length === 0) {
      rows.push({
        "Employee ID": emp.id,
        "Full Name": emp.full_name,
        "HMO Member ID": membership?.hmo_member_id || "",
        "Effectivity Date": membership?.effective_date || "",
        "Valid Until": membership?.valid_until || "",
        "Total Dependents": totalDeps,
        "Dependent Name": "",
        "HMO Card Number": "",
        "Relationship": "",
        "Date of Birth": "",
        "Gender": "",
      });
    } else {
      deps.forEach(dep => {
        rows.push({
          "Employee ID": emp.id,
          "Full Name": emp.full_name,
          "HMO Member ID": membership?.hmo_member_id || "",
          "Effectivity Date": membership?.effective_date || "",
          "Valid Until": membership?.valid_until || "",
          "Total Dependents": totalDeps,
          "Dependent Name": dep.full_name,
          "HMO Card Number": dep.hmo_card_number || "",
          "Relationship": dep.relationship || "",
          "Date of Birth": dep.birth_date || "",
          "Gender": dep.gender || "",
        });
      });
    }
  });

  // 4. Gawa ng worksheet at workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 12 }, // Employee ID
    { wch: 26 }, // Full Name
    { wch: 16 }, // HMO Member ID
    { wch: 14 }, // Effectivity Date
    { wch: 14 }, // Valid Until
    { wch: 14 }, // Total Dependents
    { wch: 26 }, // Dependent Name
    { wch: 18 }, // HMO Card Number
    { wch: 14 }, // Relationship
    { wch: 14 }, // Date of Birth
    { wch: 10 }, // Gender
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "HMO Dependents");

  const dateStr = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `HMO_Dependents_Export_${dateStr}.xlsx`);
};


const handleExportExcelForID = async () => {
  // 1. Kunin lahat ng current memberships
  const { data: memberships } = await supabaseEmployees
    .from("hmo_employees")
    .select("employee_id, hmo_member_id, effective_date, valid_until")
    .eq("is_current", true);

  const membershipMap = {};
  (memberships || []).forEach(m => { membershipMap[m.employee_id] = m; });

  // 2. Kunin lahat ng dependents
  const { data: allDependents } = await supabaseEmployees
    .from("hmo_dependents")
    .select("employee_id, full_name, hmo_card_number, relationship, birth_date, gender")
    .order("created_at");

  const depsByEmployee = {};
  (allDependents || []).forEach(d => {
    if (!depsByEmployee[d.employee_id]) depsByEmployee[d.employee_id] = [];
    depsByEmployee[d.employee_id].push(d);
  });

  // 3. Alamin ang pinaka-maraming dependents (para malaman ilang column blocks ang kailangan)
  const maxDependents = Math.max(1, ...employees.map(emp => (depsByEmployee[emp.id] || []).length));

  // 4. Gawa ng isang row per employee, may numbered dependent columns
  const rows = employees.map(emp => {
    const deps = depsByEmployee[emp.id] || [];
    const membership = membershipMap[emp.id];

    const row = {
      "Employee ID": emp.id,
      "Full Name": emp.full_name,
      "HMO Member ID": membership?.hmo_member_id || "",
      "Effectivity Date": membership?.effective_date || "",
      "Valid Until": membership?.valid_until || "",
      "Total Dependents": deps.length,
    };

    for (let i = 0; i < maxDependents; i++) {
      const dep = deps[i];
      const n = i + 1;
      row[`Dependent Name ${n}`] = dep?.full_name || "";
      row[`HMO Card Number ${n}`] = dep?.hmo_card_number || "";
      row[`Relationship ${n}`] = dep?.relationship || "";
      row[`Date of Birth ${n}`] = dep?.birth_date || "";
      row[`Gender ${n}`] = dep?.gender || "";
    }

    return row;
  });

  // 5. Gawa ng worksheet at workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);

  const baseCols = [
    { wch: 12 }, // Employee ID
    { wch: 26 }, // Full Name
    { wch: 16 }, // HMO Member ID
    { wch: 14 }, // Effectivity Date
    { wch: 14 }, // Valid Until
    { wch: 14 }, // Total Dependents
  ];
  const depCols = [];
  for (let i = 0; i < maxDependents; i++) {
    depCols.push({ wch: 24 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 10 });
  }
  worksheet["!cols"] = [...baseCols, ...depCols];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "HMO ID Export");

  const dateStr = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `HMO_ID_Export_${dateStr}.xlsx`);
};

const handleExportSQLite = async () => {
  try {
    const initSqlJs = (await import("sql.js")).default;
    const wasmUrl = "https://sql.js.org/dist/sql-wasm.wasm";
    const wasmResponse = await fetch(wasmUrl);
    if (!wasmResponse.ok) throw new Error("Hindi makuha ang SQLite engine (wasm file). I-check ang internet connection.");
    const wasmBinary = await wasmResponse.arrayBuffer();
    const SQL = await initSqlJs({ wasmBinary });

    // 1. Kunin lahat ng current memberships
    const { data: memberships } = await supabaseEmployees
      .from("hmo_employees")
      .select("employee_id, hmo_member_id, effective_date, valid_until")
      .eq("is_current", true);

    const membershipMap = {};
    (memberships || []).forEach(m => { membershipMap[m.employee_id] = m; });

    // 2. Kunin lahat ng dependents
    const { data: allDependents } = await supabaseEmployees
      .from("hmo_dependents")
      .select("employee_id, full_name, hmo_card_number, relationship, birth_date, gender")
      .order("created_at");

    const depsByEmployee = {};
    (allDependents || []).forEach(d => {
      if (!depsByEmployee[d.employee_id]) depsByEmployee[d.employee_id] = [];
      depsByEmployee[d.employee_id].push(d);
    });

    // 3. Alamin ang pinaka-maraming dependents
    const maxDependents = Math.max(1, ...employees.map(emp => (depsByEmployee[emp.id] || []).length));

    // 4. Gawa ng SQLite database in-memory
    const db = new SQL.Database();

    // Build CREATE TABLE statement dynamically base sa maxDependents
    let createCols = [
      `"Employee ID" TEXT`,
      `"Full Name" TEXT`,
      `"HMO Member ID" TEXT`,
      `"Effectivity Date" TEXT`,
      `"Valid Until" TEXT`,
      `"Total Dependents" INTEGER`,
    ];
    for (let i = 1; i <= maxDependents; i++) {
      createCols.push(
        `"Dependent Name ${i}" TEXT`,
        `"HMO Card Number ${i}" TEXT`,
        `"Relationship ${i}" TEXT`,
        `"Date of Birth ${i}" TEXT`,
        `"Gender ${i}" TEXT`
      );
    }
    db.run(`CREATE TABLE hmo_id_export (${createCols.join(", ")});`);

    // Prepare insert statement
    const allColNames = [
      "Employee ID", "Full Name", "HMO Member ID", "Effectivity Date", "Valid Until", "Total Dependents",
    ];
    for (let i = 1; i <= maxDependents; i++) {
      allColNames.push(`Dependent Name ${i}`, `HMO Card Number ${i}`, `Relationship ${i}`, `Date of Birth ${i}`, `Gender ${i}`);
    }
    const placeholders = allColNames.map(() => "?").join(", ");
    const insertSql = `INSERT INTO hmo_id_export (${allColNames.map(c => `"${c}"`).join(", ")}) VALUES (${placeholders});`;
    const stmt = db.prepare(insertSql);

    // 5. I-insert ang data, isang row per employee
    employees.forEach(emp => {
      const deps = depsByEmployee[emp.id] || [];
      const membership = membershipMap[emp.id];

      const values = [
        emp.id,
        emp.full_name,
        membership?.hmo_member_id || "",
        membership?.effective_date || "",
        membership?.valid_until || "",
        deps.length,
      ];

      for (let i = 0; i < maxDependents; i++) {
        const dep = deps[i];
        values.push(
          dep?.full_name || "",
          dep?.hmo_card_number || "",
          dep?.relationship || "",
          dep?.birth_date || "",
          dep?.gender || ""
        );
      }

      stmt.run(values);
    });
    stmt.free();

    // 6. I-export bilang binary at i-download
    const binaryArray = db.export();
    const blob = new Blob([binaryArray], { type: "application/x-sqlite3" });
    const url = window.URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split("T")[0];
    const a = document.createElement("a");
    a.href = url;
    a.download = `HMO_ID_Export_${dateStr}.sqlite`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    db.close();
  } catch (err) {
    alert("Error generating SQLite file: " + err.message);
  }
};

  const refreshMembership = async (empId) => {
    const { data } = await supabaseEmployees
      .from("hmo_employees")
      .select("*")
      .eq("employee_id", empId)
      .eq("is_current", true)
      .maybeSingle();
    setActiveMembership(data || null);
    setMembershipMap(prev => ({ ...prev, [empId]: data || undefined }));
  };

  const refreshDependents = async (empId) => {
    setDepLoading(true);
    const { data } = await supabaseEmployees
      .from("hmo_dependents")
      .select("*")
      .eq("employee_id", empId)
      .order("created_at");
    setDependents(data || []);
    setDepLoading(false);
  };

  const openModal = async (emp) => {
    setActiveEmployee(emp);
    setModalOpen(true);
    setMembershipFormOpen(false);
    setDepFormOpen(false);
    await refreshMembership(emp.id);
    await refreshDependents(emp.id);
  };

  // ── MEMBERSHIP ACTIONS ─────────────────────────────
  const openEnrollForm = () => {
    setMembershipFormMode("enroll");
    setMembershipForm({ status: "Active" });
    setMembershipFormOpen(true);
  };

  const openEditMembershipForm = () => {
    setMembershipFormMode("edit");
    setMembershipForm({ ...activeMembership });
    setMembershipFormOpen(true);
  };

  const openRenewForm = () => {
    setMembershipFormMode("renew");
    setMembershipForm({
      hmo_member_id: "",
      hmo_provider: activeMembership?.hmo_provider || "",
      effective_date: "",
      valid_until: "",
      status: "Active",
      remarks: "",
    });
    setMembershipFormOpen(true);
  };

  const handleMembershipChange = (field, value) => setMembershipForm(prev => ({ ...prev, [field]: value }));

  const handleSaveMembership = async () => {
    if (!membershipForm.hmo_member_id) {
      alert("Kailangan ng HMO Member ID.");
      return;
    }
    setSavingMembership(true);

    try {
      if (membershipFormMode === "edit") {
        const { error } = await supabaseEmployees
          .from("hmo_employees")
          .update({
            hmo_member_id: membershipForm.hmo_member_id,
            hmo_provider: membershipForm.hmo_provider || null,
            effective_date: membershipForm.effective_date || null,
            valid_until: membershipForm.valid_until || null,
            status: membershipForm.status || "Active",
            remarks: membershipForm.remarks || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", activeMembership.id);
        if (error) throw error;
      } else {
        // enroll or renew: archive old current record (if any), insert new one
        if (activeMembership) {
          const { error: archiveError } = await supabaseEmployees
            .from("hmo_employees")
            .update({ is_current: false })
            .eq("id", activeMembership.id);
          if (archiveError) throw archiveError;
        }

        const { error: insertError } = await supabaseEmployees
          .from("hmo_employees")
          .insert({
            employee_id: activeEmployee.id,
            hmo_member_id: membershipForm.hmo_member_id,
            hmo_provider: membershipForm.hmo_provider || null,
            effective_date: membershipForm.effective_date || null,
            valid_until: membershipForm.valid_until || null,
            status: membershipForm.status || "Active",
            remarks: membershipForm.remarks || null,
            is_current: true,
          });
        if (insertError) throw insertError;
      }

      setMembershipFormOpen(false);
      await refreshMembership(activeEmployee.id);
    } catch (err) {
      alert("Error saving HMO membership: " + err.message);
    }
    setSavingMembership(false);
  };

  // ── DEPENDENT ACTIONS ─────────────────────────────
const openAddDepForm = () => {
    setDepForm({ relationship: "Spouse", hmo_status: "Active" });
    setEditingDepId(null);
    setIdDocFile(null);
    setBirthCertFile(null);
    setDepFormOpen(true);
  };

  const openEditDepForm = (dep) => {
    setDepForm({ ...dep });
    setEditingDepId(dep.id);
    setIdDocFile(null);
    setBirthCertFile(null);
    setDepFormOpen(true);
  };

  const handleDepFormChange = (field, value) => setDepForm(prev => ({ ...prev, [field]: value }));

const handleSaveDependent = async () => {
    if (!depForm.full_name || !depForm.relationship) {
      alert("Kailangan ng Full Name at Relationship.");
      return;
    }
    setSavingDep(true);

    try {
      let idDocUrl = depForm.id_document_url;
      let birthCertUrl = depForm.birth_cert_url;

      if (idDocFile) idDocUrl = await uploadDependentFile(idDocFile, 'id-documents');
      if (birthCertFile) birthCertUrl = await uploadDependentFile(birthCertFile, 'birth-certificates');

      const payload = {
        employee_id: activeEmployee.id,
        full_name: depForm.full_name,
        relationship: depForm.relationship,
        birth_date: depForm.birth_date || null,
        gender: depForm.gender || null,
        hmo_provider: depForm.hmo_provider || null,
        hmo_card_number: depForm.hmo_card_number || null,
        hmo_status: depForm.hmo_status || "Active",
        effectivity_date: depForm.effectivity_date || null,
        remarks: depForm.remarks || null,
        id_document_url: idDocUrl || null,
        birth_cert_url: birthCertUrl || null,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (editingDepId) {
        ({ error } = await supabaseEmployees.from("hmo_dependents").update(payload).eq("id", editingDepId));
      } else {
        ({ error } = await supabaseEmployees.from("hmo_dependents").insert(payload));
      }

      if (error) throw error;

      setDepFormOpen(false);
      setIdDocFile(null);
      setBirthCertFile(null);
      await refreshDependents(activeEmployee.id);
      setDependentCounts(prev => ({ ...prev, [activeEmployee.id]: (prev[activeEmployee.id] || 0) + (editingDepId ? 0 : 1) }));
    } catch (err) {
      alert("Error saving dependent: " + err.message);
    }
    setSavingDep(false);
  };

  const handleDeleteDependent = async (dep) => {
    if (!confirm(`Alisin si ${dep.full_name} bilang dependent?`)) return;
    const { error } = await supabaseEmployees.from("hmo_dependents").delete().eq("id", dep.id);
    if (error) { alert("Error deleting: " + error.message); return; }
    await refreshDependents(activeEmployee.id);
    setDependentCounts(prev => ({ ...prev, [activeEmployee.id]: Math.max(0, (prev[activeEmployee.id] || 1) - 1) }));
  };

  const handleDownloadDependentFiles = async (dep) => {
  if (!dep.id_document_url && !dep.birth_cert_url) {
    alert("Walang naka-upload na files para kay " + dep.full_name);
    return;
  }

  const downloadFile = async (url, label) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const ext = url.split('.').pop().split('?')[0];
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${dep.full_name.replace(/\s+/g, "_")}_${label}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert(`Error downloading ${label}: ` + err.message);
    }
  };

  if (dep.id_document_url) await downloadFile(dep.id_document_url, "Valid_ID");
  if (dep.birth_cert_url) await downloadFile(dep.birth_cert_url, "Birth_Certificate");
};

  // ── FILTERS / PAGINATION ─────────────────────────
const filtered = employees.filter((emp) => {
    const matchSearch = emp.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.id?.toLowerCase().includes(search.toLowerCase()) ||
      membershipMap[emp.id]?.hmo_member_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" ||
      (statusFilter === "Enrolled" && membershipMap[emp.id]) ||
      (statusFilter === "Not Enrolled" && !membershipMap[emp.id]);
    const matchEmployeeStatus = employeeStatusFilter === "All" || emp.status === employeeStatusFilter;
    return matchSearch && matchStatus && matchEmployeeStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const enrolledCount = Object.keys(membershipMap).filter(k => membershipMap[k]).length;
  const totalDependents = Object.values(dependentCounts).reduce((a, b) => a + b, 0);

  const inputStyle = { padding: "10px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box", background: "#fafcff" };
  const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>HMO Management</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Manage HMO membership and dependents per employee</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { label: "Total Employees", value: employees.length, color: "#013F99" },
          { label: "Enrolled in HMO", value: enrolledCount, color: "#22c55e" },
          { label: "Total Dependents", value: totalDependents, color: "#4CB1E9" },
        ].map((card) => (
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
            <input placeholder="Search by name, ID, or Member ID..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 16px 10px 36px", border: "1px solid rgba(1,63,153,0.12)", borderRadius: 10, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif" }} />
          </div>
<button onClick={() => { setStatusFilter("All"); setEmployeeStatusFilter("All"); setCurrentPage(1); }}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: (statusFilter === "All" && employeeStatusFilter === "All") ? "#013F99" : "#fff", color: (statusFilter === "All" && employeeStatusFilter === "All") ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
            All
          </button>

          <div style={{ width: 1, height: 24, background: "rgba(1,63,153,0.12)" }} />

          {["Enrolled", "Not Enrolled"].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: statusFilter === s ? "#013F99" : "#fff", color: statusFilter === s ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              {s}
            </button>
          ))}

          <div style={{ width: 1, height: 24, background: "rgba(1,63,153,0.12)" }} />

          {["Active", "In-active"].map((s) => (
            <button key={s} onClick={() => { setEmployeeStatusFilter(s); setCurrentPage(1); }}
              style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: employeeStatusFilter === s ? "#013F99" : "#fff", color: employeeStatusFilter === s ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              {s}
            </button>
          ))}
                  <div style={{ position: "relative" }}>
                    <button onClick={() => setExportMenuOpen(prev => !prev)}
                      style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: "#fff", color: "#013F99", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Export
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: exportMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>

                    {exportMenuOpen && (
                      <>
                        <div onClick={() => setExportMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />
                        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", borderRadius: 12, border: "1px solid rgba(1,63,153,0.12)", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 21, minWidth: 260 }}>
                          <button
                            onClick={() => { setExportMenuOpen(false); handleExportExcel(); }}
                            style={{ width: "100%", padding: "12px 16px", border: "none", background: "#fff", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 2 }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f6fbfe"}
                            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                          >
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0b1a3b" }}>Excel — per dependent</span>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>Isang row bawat dependent</span>
                          </button>
                          <div style={{ height: 1, background: "rgba(1,63,153,0.06)" }} />
                          <button
                            onClick={() => { setExportMenuOpen(false); handleExportExcelForID(); }}
                            style={{ width: "100%", padding: "12px 16px", border: "none", background: "#fff", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 2 }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f6fbfe"}
                            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                          >
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0b1a3b" }}>Excel — for ID</span>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>Isang row bawat employee, numbered dependent columns</span>
                          </button>
                          <div style={{ height: 1, background: "rgba(1,63,153,0.06)" }} />
                          <button
                            onClick={() => { setExportMenuOpen(false); handleExportSQLite(); }}
                            style={{ width: "100%", padding: "12px 16px", border: "none", background: "#fff", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 2 }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f6fbfe"}
                            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                          >
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0b1a3b" }}>SQLite Database (.db)</span>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>Parehong format ng "for ID", pero .db file</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
        </div>


        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading employees...</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f6fbfe" }}>
                    {["ID No.", "Name", "Department", "HMO Member ID", "Dependents", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid rgba(1,63,153,0.08)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No employees found.</td></tr>
                  ) : (
                    paginated.map((emp, i) => {
                      const membership = membershipMap[emp.id];
                      const count = dependentCounts[emp.id] || 0;
                      return (
                        <tr key={emp.id} style={{ borderBottom: "1px solid rgba(1,63,153,0.05)", background: i % 2 === 0 ? "#fff" : "#fafcff" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(1,63,153,0.04)"}
                          onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafcff"}>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: "#013F99" }}>{emp.id}</td>
                          <td style={{ padding: "12px 16px", color: "#0b1a3b", fontWeight: 500 }}>{emp.full_name}</td>
                          <td style={{ padding: "12px 16px", color: "#64748b" }}>{emp.department || "—"}</td>
                          <td style={{ padding: "12px 16px" }}>
                            {membership ? (
                              <span style={{ fontWeight: 600, color: "#013F99" }}>{membership.hmo_member_id}</span>
                            ) : (
                              <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(148,163,184,0.12)", color: "#94a3b8" }}>Not Enrolled</span>
                            )}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: count > 0 ? "rgba(76,177,233,0.12)" : "rgba(148,163,184,0.12)", color: count > 0 ? "#013F99" : "#94a3b8" }}>
                              {count} {count === 1 ? "dependent" : "dependents"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <button onClick={() => openModal(emp)}
                              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              Manage HMO
                            </button>
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

      {/* MAIN MODAL: Membership + Dependents */}
      {modalOpen && activeEmployee && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 900, overflowX: "hidden", padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>{activeEmployee.full_name}</h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>ID: {activeEmployee.id} · {activeEmployee.department || "—"}</p>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

            {/* ── MEMBERSHIP SECTION ── */}
            {!membershipFormOpen ? (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1a3b", fontFamily: "'Montserrat', sans-serif" }}>HMO Membership</div>
                  {activeMembership ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={openEditMembershipForm} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                      <button onClick={openRenewForm} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Renew</button>
                    </div>
                  ) : (
                    <button onClick={openEnrollForm} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Enroll in HMO</button>
                  )}
                </div>

                {activeMembership ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                    {[
                      ["Member ID", activeMembership.hmo_member_id],
                      ["Provider", activeMembership.hmo_provider],
                      ["Effective Date", activeMembership.effective_date],
                      ["Valid Until", activeMembership.valid_until],
                    ].map(([label, value]) => (
                      <div key={label} style={{ padding: "12px 14px", background: "#f6fbfe", borderRadius: 10, border: "1px solid rgba(1,63,153,0.08)" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#4CB1E9", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                        <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 600, marginTop: 4 }}>{value || "—"}</div>
                      </div>
                    ))}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: activeMembership.status === "Active" ? "rgba(34,197,94,0.1)" : activeMembership.status === "Expired" ? "rgba(239,68,68,0.1)" : "rgba(148,163,184,0.12)", color: activeMembership.status === "Active" ? "#16a34a" : activeMembership.status === "Expired" ? "#dc2626" : "#64748b" }}>{activeMembership.status}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13, background: "#f6fbfe", borderRadius: 12 }}>Wala pang HMO enrollment.</div>
                )}
              </div>
            ) : (
              // MEMBERSHIP FORM
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1a3b", fontFamily: "'Montserrat', sans-serif", marginBottom: 12 }}>
                  {membershipFormMode === "enroll" ? "Enroll in HMO" : membershipFormMode === "renew" ? "Renew HMO Membership" : "Edit HMO Membership"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>HMO Member ID</label>
                    <input type="text" value={membershipForm.hmo_member_id || ""} onChange={(e) => handleMembershipChange("hmo_member_id", e.target.value)} style={inputStyle} placeholder="e.g. 202608-17-006" />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Provider</label>
                    <input type="text" value={membershipForm.hmo_provider || ""} onChange={(e) => handleMembershipChange("hmo_provider", e.target.value)} style={inputStyle} placeholder="e.g. Maxicare" />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Effective Date</label>
                    <input type="date" value={membershipForm.effective_date || ""} onChange={(e) => handleMembershipChange("effective_date", e.target.value)} style={inputStyle} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Valid Until</label>
                    <input type="date" value={membershipForm.valid_until || ""} onChange={(e) => handleMembershipChange("valid_until", e.target.value)} style={inputStyle} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Status</label>
                    <select value={membershipForm.status || "Active"} onChange={(e) => handleMembershipChange("status", e.target.value)} style={inputStyle}>
                      {["Active", "In-active", "Expired"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Remarks</label>
                    <input type="text" value={membershipForm.remarks || ""} onChange={(e) => handleMembershipChange("remarks", e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
                  <button onClick={() => setMembershipFormOpen(false)} style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button onClick={handleSaveMembership} disabled={savingMembership} style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: savingMembership ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: savingMembership ? "not-allowed" : "pointer" }}>{savingMembership ? "Saving..." : "Save"}</button>
                </div>
              </div>
            )}

            <div style={{ height: 1, background: "rgba(1,63,153,0.08)", marginBottom: 24 }} />

            {/* ── DEPENDENTS SECTION ── */}
            {!depFormOpen ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1a3b", fontFamily: "'Montserrat', sans-serif" }}>Dependents</div>
                  <button onClick={openAddDepForm}
                    style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Dependent
                  </button>
                </div>

                {depLoading ? (
                  <div style={{ padding: 30, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading dependents...</div>
                ) : dependents.length === 0 ? (
                  <div style={{ padding: 30, textAlign: "center", color: "#94a3b8", fontSize: 13, background: "#f6fbfe", borderRadius: 12 }}>Walang naka-register na dependent.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {dependents.map((dep) => (
                      <div key={dep.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "#f6fbfe", borderRadius: 12, border: "1px solid rgba(1,63,153,0.08)" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0b1a3b" }}>{dep.full_name}</div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                            {dep.relationship} {dep.birth_date && `· Born ${dep.birth_date}`}
                          </div>
                          {dep.hmo_card_number && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Card No: {dep.hmo_card_number}</div>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: dep.hmo_status === "Active" ? "rgba(34,197,94,0.1)" : dep.hmo_status === "Pending" ? "rgba(243,207,71,0.15)" : "rgba(239,68,68,0.1)", color: dep.hmo_status === "Active" ? "#16a34a" : dep.hmo_status === "Pending" ? "#b8860b" : "#dc2626" }}>{dep.hmo_status}</span>
                          <button onClick={() => openEditDepForm(dep)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                          {/* <button onClick={() => handleDeleteDependent(dep)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "#fff", color: "#dc2626", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Delete</button> */}
                                                     <button
                            onClick={() => handleDownloadDependentFiles(dep)}
                            disabled={!dep.id_document_url && !dep.birth_cert_url}
                            style={{
                              padding: "6px 12px", borderRadius: 8,
                              border: "1px solid rgba(76,177,233,0.3)",
                              background: "#fff",
                              color: (dep.id_document_url || dep.birth_cert_url) ? "#4CB1E9" : "#cbd5e1",
                              fontSize: 11, fontWeight: 600,
                              cursor: (dep.id_document_url || dep.birth_cert_url) ? "pointer" : "not-allowed",
                              display: "flex", alignItems: "center", gap: 4,
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download Files
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <button onClick={() => setModalOpen(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Close</button>
                </div>
              </>
            ) : (
              // DEPENDENT FORM
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1a3b", fontFamily: "'Montserrat', sans-serif", marginBottom: 12 }}>
                  {editingDepId ? "Edit Dependent" : "Add Dependent"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" value={depForm.full_name || ""} onChange={(e) => handleDepFormChange("full_name", e.target.value)} style={inputStyle} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Relationship</label>
                    <select value={depForm.relationship || "Spouse"} onChange={(e) => handleDepFormChange("relationship", e.target.value)} style={inputStyle}>
                      {["Spouse", "Child", "Parent", "Sibling", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Birth Date</label>
                    <input type="date" value={depForm.birth_date || ""} onChange={(e) => handleDepFormChange("birth_date", e.target.value)} style={inputStyle} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>HMO Status</label>
                    <select value={depForm.hmo_status || "Active"} onChange={(e) => handleDepFormChange("hmo_status", e.target.value)} style={inputStyle}>
                      {["Active", "In-active", "Pending"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Gender</label>
                    <select value={depForm.gender || ""} onChange={(e) => handleDepFormChange("gender", e.target.value)} style={inputStyle}>
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>HMO Card Number</label>
                    <input type="text" value={depForm.hmo_card_number || ""} onChange={(e) => handleDepFormChange("hmo_card_number", e.target.value)} style={inputStyle} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Effectivity Date</label>
                    <input type="date" value={depForm.effectivity_date || ""} onChange={(e) => handleDepFormChange("effectivity_date", e.target.value)} style={inputStyle} />
                  </div>
                 <div style={{ gridColumn: "1 / -1", ...fieldStyle }}>
                    <label style={labelStyle}>Remarks</label>
                    <input type="text" value={depForm.remarks || ""} onChange={(e) => handleDepFormChange("remarks", e.target.value)} style={inputStyle} />
                  </div>

                  <div style={{ gridColumn: "1 / -1", ...fieldStyle }}>
                    <label style={labelStyle}>Valid ID</label>
                    {(depForm.id_document_url && !idDocFile) && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "8px 12px", background: "#f6fbfe", borderRadius: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span style={{ fontSize: 12, color: "#0b1a3b", flex: 1 }}>Uploaded na</span>
                        <a href={depForm.id_document_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: "#013F99", textDecoration: "none" }}>View/Download</a>
                        <button type="button" onClick={() => handleDepFormChange("id_document_url", null)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 6, width: 20, height: 20, cursor: "pointer", color: "#dc2626", fontSize: 12 }}>✕</button>
                      </div>
                    )}
                    <input type="file" accept="image/*,.pdf" onChange={(e) => setIdDocFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box" }} />
                    {idDocFile && <p style={{ fontSize: 11, color: "#16a34a", margin: "4px 0 0" }}>Bagong file: {idDocFile.name}</p>}
                  </div>

                  <div style={{ gridColumn: "1 / -1", ...fieldStyle }}>
                    <label style={labelStyle}>Birth Certificate</label>
                    {(depForm.birth_cert_url && !birthCertFile) && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "8px 12px", background: "#f6fbfe", borderRadius: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span style={{ fontSize: 12, color: "#0b1a3b", flex: 1 }}>Uploaded na</span>
                        <a href={depForm.birth_cert_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: "#013F99", textDecoration: "none" }}>View/Download</a>
                        <button type="button" onClick={() => handleDepFormChange("birth_cert_url", null)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 6, width: 20, height: 20, cursor: "pointer", color: "#dc2626", fontSize: 12 }}>✕</button>
                      </div>
                    )}
                    <input type="file" accept="image/*,.pdf" onChange={(e) => setBirthCertFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box" }} />
                    {birthCertFile && <p style={{ fontSize: 11, color: "#16a34a", margin: "4px 0 0" }}>Bagong file: {birthCertFile.name}</p>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(1,63,153,0.08)" }}>
                  <button onClick={() => setDepFormOpen(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
                  <button onClick={handleSaveDependent} disabled={savingDep} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: savingDep ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: savingDep ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif" }}>{savingDep ? "Saving..." : editingDepId ? "Save Changes" : "Add Dependent"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}