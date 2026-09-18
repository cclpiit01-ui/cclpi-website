import { useState, useEffect } from "react";
import headerWave from '../../assets/header-wave.png';
import cclpiLogo from '../../assets/cclpi-logo.jpg';
import signatureImg from '../../assets/signature.png';
import angelicaLogo from '../../assets/angelica.png';
import QRCode from "qrcode";
import initSqlJs from "sql.js";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import { runSync } from "@/pages/admin/SyncSalesCounselors";
import Toast from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

/**
 * This page reads ONLY from Supabase now — it never calls the main
 * Sales Counselor API directly. Keeping Supabase caught up with new
 * counselors from that API is SyncSalesCounselors.jsx's job (run it
 * manually or on a schedule); this file just displays/edits what's
 * already in Supabase, which keeps it fast regardless of how many
 * thousand records exist.
 */

const CARD_BASE_URL = window.location.origin + "/sales-counselor";
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

// --- Counselor code obfuscation -------------------------------------------
// Turns "M-00000" into an opaque URL-safe token so counselor codes can't be
// guessed/enumerated by editing the URL (e.g. /counselor/M-00001,
// /counselor/M-00002, ...). This is XOR + base64url, NOT real encryption —
// anyone reading the deployed JS bundle can find the key and reverse it.
// It's meant to stop casual guessing, not a determined attacker.
// Move this key to an env var (e.g. VITE_QR_OBFUSCATION_KEY) if you want it
// out of the source file; either way, change it from the placeholder below.
const OBFUSCATION_KEY = import.meta.env.VITE_QR_OBFUSCATION_KEY || "cclpi-sc-2024-secure";



function encodeCounselorId(id) {
  if (!id) return "";
  let result = "";
  for (let i = 0; i < id.length; i++) {
    result += String.fromCharCode(
      id.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length)
    );
  }
  return btoa(result).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeCounselorId(encoded) {
  if (!encoded) return "";
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const decoded = atob(padded);
  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(
      decoded.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length)
    );
  }
  return result;
}

function getCounselorUrl(idNo) {
  return `${CARD_BASE_URL}/${encodeCounselorId(idNo)}`;
}
// ---------------------------------------------------------------------------

// Treats "1", "true", or anything starting with "y" (case-insensitive) as paid.
// (Kept for reference in the profile detail grid — no longer drives the status badge.)
const isPaidValue = (val) => {
  const s = String(val ?? "").trim().toLowerCase();
  return s === "1" || s === "true" || s.startsWith("y");
};

// Determines Active/Expired based on the counselor's validity/expiry date.
const isActiveValue = (expiryDateStr) => {
  if (!expiryDateStr) return false; // no date on record → treat as Expired
  const expiry = new Date(expiryDateStr);
  if (isNaN(expiry.getTime())) return false; // unparseable date → treat as Expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry.getTime() >= today.getTime();
};

export default function SalesCounselorManagement() {
  const [counselors, setCounselors] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirmSync, setConfirmSync] = useState(null);

  const showToast = (
    message,
    type = "success",
    duration = 4000
  ) => {
    setToast({
      message,
      type,
      duration,
    });
  };

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [agencyFilter, setAgencyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;

  const [printData, setPrintData] = useState(null);

  // --- Editable extras (Supabase) -----------------------------------------
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

// --- sc picture (Supabase) -----------------------------------------
  const [pictureFile, setPictureFile] = useState(null);
  const [picturePreview, setPicturePreview] = useState("");

  // --- Row action menu (⋮ dropdown instead of 4 inline buttons) ----------
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  // --- Export dropdown (combines CSV + SQLite into one button) -----------
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

// Sync dropdown
const [syncMenuOpen, setSyncMenuOpen] = useState(false);

// Supabase sync loading
const [syncing, setSyncing] = useState(false);

// CardExchange sync loading
const [syncingCardExchange, setSyncingCardExchange] = useState(false);

  // Close the open row menu / export menu on any click outside them.
useEffect(() => {
  if (!openMenuId && !exportMenuOpen && !syncMenuOpen) return;

  const closeMenus = () => {
    setOpenMenuId(null);
    setExportMenuOpen(false);
    setSyncMenuOpen(false);
  };

  document.addEventListener("click", closeMenus);

  return () => document.removeEventListener("click", closeMenus);
}, [openMenuId, exportMenuOpen, syncMenuOpen]);
  useEffect(() => { fetchCounselors(); }, []);

  // Supabase is now the single source this page reads from — no more main
  // API calls here at all, so this stays fast no matter how many thousand
  // records exist. New counselors from the main API arrive via
  // SyncSalesCounselors.jsx, run separately (button or schedule).
  //
  // PostgREST (Supabase's API layer) caps every request at 1000 rows by
  // default, silently — no error, it just returns the first 1000 and
  // stops. With 5,000+ sales counselors, a single select("*") call only
  // ever returns the first batch. This loops with .range() until a page
  // comes back with fewer rows than the page size, meaning we've reached
  // the end.
  const fetchAllRows = async () => {
    const PAGE_SIZE = 1000;
    let allRows = [];
    let from = 0;

    while (true) {
      const { data, error } = await supabaseEmployees
        .from(SC_TABLE)
        .select("*")
        .order("full_name", { ascending: true })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw error;

      allRows = allRows.concat(data || []);
      if (!data || data.length < PAGE_SIZE) break; // last page reached
      from += PAGE_SIZE;
    }

    return allRows;
  };

  const fetchCounselors = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchAllRows();
      setCounselors(data || []);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load sales counselors.");
      setCounselors([]);
    }
    setLoading(false);
  };

  // Refresh now does two things: pull any new/changed data from the main
  // API into Supabase first (via the same runSync used by
  // SyncSalesCounselors.jsx), then reload this page's list from Supabase
  // so the table reflects it. Stays on this page — no navigation.
  const handleRefresh = async () => {
    setSyncing(true);
    try {
      await runSync();
    } catch (err) {
      console.error("Sync failed:", err.message);
      alert("Couldn't sync from the main API: " + err.message + "\n\nShowing existing Supabase data instead.");
    }
    await fetchCounselors();
    setSyncing(false);
  };

const syncCardExchange = async () => {
  try {
    const recordsToSync = filtered.map(getExportRow);

    if (recordsToSync.length === 0) {
      alert(
        "No records found using the current filters.\n\n" +
        "CardExchange database was not changed."
      );
      return;
    }


    // Start spinning only after confirmation
    setSyncingCardExchange(true);

    const response = await fetch(
      "http://localhost:3001/sync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: recordsToSync,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "CardExchange sync failed."
      );
    }

    console.log("CardExchange sync result:", result);

showToast(
  `${result.syncedRecords} record(s) synced successfully. A backup of the previous database was created.`,
  "success",
  5000
);

  } catch (error) {
    console.error("CardExchange sync failed:", error);

    alert(
      "CardExchange Sync Failed!\n\n" +
      error.message +
      "\n\nMake sure the CardExchange Local Service is running."
    );
  } finally {
    setSyncingCardExchange(false);
  }
};
const openEdit = (sc) => {
  setEditData({
    id_no: sc.id_no,
    full_name: sc.full_name,
    position: sc.position || "",
    date_release: sc.date_release || "",
    uploaded_picture: sc.uploaded_picture || "",
  });

  setPictureFile(null);
  setPicturePreview("");

  setEditModal(true);
};

const handleSaveEdit = async () => {
  setSavingEdit(true);

  try {
    // Keep existing uploaded picture if no new file is selected
    let pictureUrl = editData.uploaded_picture || null;

    // If user selected a new picture, upload it to Storage
    if (pictureFile) {
      const fileExtension = pictureFile.name
        .split(".")
        .pop()
        .toLowerCase();

      const fileName = `${editData.id_no}.${fileExtension}`;

      const { error: uploadError } = await supabaseEmployees.storage
        .from("sales-counselor-pictures")
        .upload(fileName, pictureFile, {
          upsert: true,
          contentType: pictureFile.type,
        });

      if (uploadError) throw uploadError;

      // Get URL from Storage
      const { data: publicUrlData } = supabaseEmployees.storage
        .from("sales-counselor-pictures")
        .getPublicUrl(fileName);

      pictureUrl = publicUrlData.publicUrl;
    }

    // Save the Storage URL to uploaded_picture
    const { error } = await supabaseEmployees
      .from(SC_TABLE)
      .update({
        position: editData.position || null,
        date_release: editData.date_release || null,
        uploaded_picture: pictureUrl,
      })
      .eq("id_no", editData.id_no);

    if (error) throw error;

    // Update only this counselor in the current React table
    setCounselors((prev) =>
      prev.map((sc) =>
        sc.id_no === editData.id_no
          ? {
              ...sc,
              position: editData.position || null,
              date_release: editData.date_release || null,
              uploaded_picture: pictureUrl,
            }
          : sc
      )
    );

    setPictureFile(null);
    setPicturePreview("");
    setEditModal(false);

    showToast(
      "Sales Counselor updated successfully.",
      "success",
      4000
    );

  } catch (err) {
    console.error("Error saving counselor:", err);

    showToast(
      "Error saving: " + err.message,
      "error",
      5000
    );

  } finally {
    setSavingEdit(false);
  }
};
  // Client-side sort by id_no — these are sequential (M-00000, M-00001, ...)
  // in creation order, so sorting by id_no doubles as Oldest/Newest First.
  // Unlike created_at or date_release, id_no is always present on every
  // existing record today, so the toggle actually works right now instead
  // of only for rows added after some future column exists.
  const sorted = [...counselors].sort((a, b) => {
    const idA = a.id_no || "";
    const idB = b.id_no || "";
    return sortOrder === "asc" ? idA.localeCompare(idB) : idB.localeCompare(idA);
  });

  const filtered = sorted.filter((sc) => {
    const q = search.toLowerCase();
    const matchSearch =
      sc.full_name?.toLowerCase().includes(q) ||
      sc.id_no?.toLowerCase().includes(q) ||
      sc.position?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" ? isActiveValue(sc.expiry_date) : !isActiveValue(sc.expiry_date));
    const matchAgency = agencyFilter === "All" || sc.agency === agencyFilter;
    return matchSearch && matchStatus && matchAgency;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const agencies = ["All", ...new Set(counselors.map((sc) => sc.agency).filter(Boolean).sort())];
  const total = counselors.length;
  const active = counselors.filter((sc) => isActiveValue(sc.expiry_date)).length;
  const expired = total - active;

  const handleDownloadQr = async (sc) => {
    const counselorUrl = getCounselorUrl(sc.id_no);
    try {
      const dataUrl = await QRCode.toDataURL(counselorUrl, {
        width: 400,
        margin: 1,
        color: { dark: "#013F99", light: "#FFFFFF" },
      });
      const link = document.createElement("a");
      link.download = `${sc.full_name?.replace(/\s+/g, "_") || sc.id_no}_QR.png`;
      link.href = dataUrl;
      link.click();

      // Persist the link too, so it's on record in Supabase and not just a
      // one-off download — future loads/exports can reference sc.qr_link.
      // The row already exists (inserted by SyncSalesCounselors), so this
      // is a plain update, not an upsert.
      const { error } = await supabaseEmployees
        .from(SC_TABLE)
        .update({ qr_link: counselorUrl })
        .eq("id_no", sc.id_no);
      if (error) console.error("Saving qr_link failed:", error.message);
      else setCounselors((prev) => prev.map((c) => c.id_no === sc.id_no ? { ...c, qr_link: counselorUrl } : c));
    } catch (err) {
      alert("Error generating QR: " + err.message);
    }
  };

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const EXPORT_COLUMNS = [
    "id_no", "full_name", "birthday", "address", "validity_date",
    "is_paid", "or_date", "picture", "signature", "date_released",
    "position", "manager", "agency", "qr_link",
  ];

  const getExportRow = (sc) => ({
    id_no: sc.id_no,
    full_name: sc.full_name,
    birthday: sc.birthday,
    address: sc.address,
    validity_date: sc.expiry_date, // normalized field, mapped back to original column name
    is_paid: sc.is_paid,
    or_date: sc.or_date,
    picture: sc.picture,
    signature: sc.signature,
    date_released: sc.date_release,
    position: sc.position,
    manager: sc.manager,
    agency: sc.agency,
    qr_link: sc.qr_link || getCounselorUrl(sc.id_no),
  });

  const handleExportCSV = () => {
    const rows = filtered.map(getExportRow);
    const csvBody = rows.map((row) =>
      EXPORT_COLUMNS.map((col) => escapeCSV(row[col])).join(",")
    );
    const csv = [EXPORT_COLUMNS.join(","), ...csvBody].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sales_counselors_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportSQLite = async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: () => sqlWasmUrl,
      });

      const db = new SQL.Database();

      db.run(`
        CREATE TABLE sales_counselors (
          id_no TEXT,
          full_name TEXT,
          birthday TEXT,
          address TEXT,
          validity_date TEXT,
          is_paid TEXT,
          or_date TEXT,
          picture TEXT,
          signature TEXT,
          date_released TEXT,
          position TEXT,
          manager TEXT,
          agency TEXT,
          qr_link TEXT
        );
      `);

      const placeholders = EXPORT_COLUMNS.map(() => "?").join(", ");
      const stmt = db.prepare(
        `INSERT INTO sales_counselors (${EXPORT_COLUMNS.join(", ")}) VALUES (${placeholders})`
      );

      filtered.forEach((sc) => {
        const row = getExportRow(sc);
        stmt.run(
          EXPORT_COLUMNS.map((col) => {
            const value = row[col];
            return value === undefined || value === "" ? null : value;
          })
        );
      });

      stmt.free();

      const data = db.export();
      db.close();

      const blob = new Blob([data], { type: "application/vnd.sqlite3" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `sales_counselors_${new Date().toISOString().slice(0, 10)}.sqlite`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("SQLite export failed:", err);
      alert("Error exporting SQLite database: " + err.message);
    }
  };

  const inputStyle = { padding: "10px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box", background: "#fafcff" };
  const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 };

  return (
    <div>
      <style>{PRINT_CSS}</style>
      <style>{SPIN_CSS}</style>

      <div className="no-print">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Sales Counselor Management</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>View sales counselor records</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
          {[{ label: "Total Sales Counselors", value: total, color: "#013F99" }, { label: "Active", value: active, color: "#22c55e" }, { label: "Expired", value: expired, color: "#ef4444" }].map((card) => (
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

            {["All", "Active", "Expired"].map((s) => (
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


<div style={{ position: "relative" }}>

  {/* SYNC DATA BUTTON */}
  <button
    onClick={(e) => {
      e.stopPropagation();

      if (!syncing && !syncingCardExchange) {
        setSyncMenuOpen((v) => !v);
        setExportMenuOpen(false);
      }
    }}
    disabled={syncing || syncingCardExchange}
    style={{
      padding: "9px 18px",
      borderRadius: 10,
      border: "1px solid rgba(1,63,153,0.12)",
      background:
  syncing || syncingCardExchange
    ? "#94a3b8"
    : "linear-gradient(90deg, #013F99, #4CB1E9)",

color: "#fff",
      color: "#fff",
      fontSize: 12,
      fontWeight: 600,
      cursor:
        syncing || syncingCardExchange
          ? "not-allowed"
          : "pointer",
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      alignItems: "center",
      gap: 6,
      opacity:
        syncing || syncingCardExchange
          ? 0.75
          : 1,
    }}
  >

    {/* SYNC ICON */}
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{
        animation:
          syncing || syncingCardExchange
            ? "spin 1s linear infinite"
            : "none",
      }}
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>

    {syncing
      ? "Syncing Supabase..."
      : syncingCardExchange
      ? "Syncing CardExchange..."
      : "Sync Data"}

    {/* DROPDOWN ARROW */}
    {!syncing && !syncingCardExchange && (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    )}
  </button>


  {/* SYNC DROPDOWN */}
  {syncMenuOpen && (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: 0,
        top: "100%",
        marginTop: 4,
        background: "#fff",
        borderRadius: 10,
        border: "1px solid rgba(1,63,153,0.12)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        zIndex: 30,
        minWidth: 200,
        overflow: "hidden",
      }}
    >

      {/* SYNC SUPABASE */}
      <MenuItem
        onClick={() => {
          setSyncMenuOpen(false);
          handleRefresh();
        }}
        color="#013F99"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>

        Sync Supabase
      </MenuItem>


      {/* SYNC CARDEXCHANGE */}
      <MenuItem
onClick={() => {
  setSyncMenuOpen(false);
  setConfirmSync(true);
}}
        color="#013F99"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>

        Sync CardExchange
      </MenuItem>

    </div>
  )}
</div>

<div style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                e.stopPropagation();

                setExportMenuOpen((v) => !v);
                setSyncMenuOpen(false);
              }}
               style={{
  padding: "9px 18px",
  borderRadius: 10,
  border: "none",

  background:
    syncing || syncingCardExchange
      ? "#94a3b8"
      : "linear-gradient(90deg, #013F99, #4CB1E9)",

  color: "#fff",
  fontSize: 12,
  fontWeight: 600,

  cursor:
    syncing || syncingCardExchange
      ? "not-allowed"
      : "pointer",

  fontFamily: "'Poppins', sans-serif",

  display: "flex",
  alignItems: "center",
  gap: 6,

  whiteSpace: "nowrap",
}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              {exportMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute", left: 0, top: "100%", marginTop: 4,
                    background: "#fff", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 20,
                    minWidth: 160, overflow: "hidden",
                  }}
                >
                  <MenuItem onClick={() => { handleExportCSV(); setExportMenuOpen(false); }} color="#013F99">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export as CSV
                  </MenuItem>
                  <MenuItem onClick={() => { handleExportSQLite(); setExportMenuOpen(false); }} color="#013F99">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export as SQLite
                  </MenuItem>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading sales counselors...</div>
          ) : errorMsg ? (
            <div style={{ padding: 40, textAlign: "center", color: "#dc2626", fontSize: 13 }}>{errorMsg}</div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f6fbfe" }}>
                      {["ID No.", "Name", "Position", "Agency", "Expiration Date", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid rgba(1,63,153,0.08)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No sales counselors found.</td></tr>
                    ) : (
                      paginated.map((sc, i) => {
                        const activeRow = isActiveValue(sc.expiry_date);
                        return (
                          <tr key={sc.id_no} style={{ borderBottom: "1px solid rgba(1,63,153,0.05)", background: i % 2 === 0 ? "#fff" : "#fafcff", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(1,63,153,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafcff"}>
                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "#013F99" }}>{sc.id_no}</td>
                            <td style={{ padding: "12px 16px", color: "#0b1a3b", fontWeight: 500 }}>{sc.full_name}</td>
                            <td style={{ padding: "12px 16px", color: "#64748b" }}>{sc.position || "—"}</td>
                            <td style={{ padding: "12px 16px", color: "#64748b" }}>{sc.agency || "—"}</td>
                            <td style={{ padding: "12px 16px", color: "#64748b" }}>{sc.expiry_date || "—"}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: activeRow ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: activeRow ? "#16a34a" : "#dc2626" }}>{activeRow ? "Active" : "Expired"}</span>
                            </td>
                            <td style={{ padding: "12px 16px", position: "relative" }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  if (openMenuId === sc.id_no) {
                                    setOpenMenuId(null);
                                    return;
                                  }

                                  const rect = e.currentTarget.getBoundingClientRect();

                                  setMenuPosition({
                                    top: rect.bottom + 6,
                                    right: window.innerWidth - rect.right,
                                  });

                                  setOpenMenuId(sc.id_no);
                                }}
                                style={{
                                  width: 32, height: 32, borderRadius: 8,
                                  border: "1px solid rgba(1,63,153,0.15)", background: "#fff",
                                  color: "#013F99", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                                title="Actions"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>
                              </button>

                                  {openMenuId === sc.id_no && (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        position: "fixed",
                                        top: menuPosition.top,
                                        right: menuPosition.right,
                                        background: "#fff",
                                        borderRadius: 10,
                                        border: "1px solid rgba(1,63,153,0.12)",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                        zIndex: 99999,
                                        minWidth: 150,
                                        overflow: "hidden",
                                      }}
                                    >
                                  <MenuItem onClick={() => { openEdit(sc); setOpenMenuId(null); }} color="#013F99">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Edit
                                  </MenuItem>
                                  <MenuItem onClick={() => { window.open(getCounselorUrl(sc.id_no), "_blank"); setOpenMenuId(null); }} color="#4CB1E9">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    View Card
                                  </MenuItem>
                                  <MenuItem onClick={() => { setPrintData(sc); setOpenMenuId(null); }} color="#b8860b">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                    Print Letter
                                  </MenuItem>
                                  <MenuItem onClick={() => { handleDownloadQr(sc); setOpenMenuId(null); }} color="#013F99">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="17" y1="17" x2="17" y2="21"/><line x1="21" y1="17" x2="21" y2="21"/><line x1="17" y1="21" x2="21" y2="21"/></svg>
                                    Download QR
                                  </MenuItem>
                                </div>
                              )}
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

        {/* EDIT MODAL (Supabase),
            never touches the main API. */}
        {editModal && editData && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
            <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 480, overflowX: "hidden", padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Edit Sales Counselor</h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>{editData.full_name} · {editData.id_no}</p>
                </div>
                <button onClick={() => setEditModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 20 }} />

              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>
                Editable dito lang — hindi galing/babalik sa main API. Yung ibang fields (pangalan, address, atbp.) ay laging galing sa API mismo.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Position</label>

                  <select
                    value={editData.position || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    style={inputStyle}
                  >
                    <option value="">Select Position</option>
                    <option value="Sales Counselor">Sales Counselor</option>
                    <option value="Unit Manager">Unit Manager</option>
                    <option value="Agency Manager">Agency Manager</option>
                  </select>
                </div>
                
                <div style={fieldStyle}>
                  <label style={labelStyle}>Picture</label>

                  {/* Picture Preview */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid #e2e8f0",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {picturePreview || editData.uploaded_picture ? (
                        <img
                          src={picturePreview || editData.uploaded_picture}
                          alt="Sales Counselor"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                          }}
                        >
                          No Picture
                        </span>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
<label
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    background: "#013F99",
    color: "#fff",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    transition: "0.2s",
  }}
>
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>

  Choose Picture

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setPictureFile(file);
      setPicturePreview(URL.createObjectURL(file));
    }}
    style={{ display: "none" }}
  />
</label>

                      <div
                        style={{
                          fontSize: 10,
                          color: "#94a3b8",
                          marginTop: 6,
                        }}
                      >
                        JPG, PNG or WebP
                      </div>
                    </div>
                  </div>
                </div>


                <div style={fieldStyle}>
                  <label style={labelStyle}>Date Released</label>
                  <input type="date" value={editData.date_release} onChange={(e) => setEditData(prev => ({ ...prev, date_release: e.target.value }))} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(1,63,153,0.08)" }}>
                <button onClick={() => setEditModal(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
                <button onClick={handleSaveEdit} disabled={savingEdit} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: savingEdit ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: savingEdit ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif" }}>{savingEdit ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRINT PREVIEW */}
      {printData && (
        <div style={PRINT_MODAL_OVERLAY} className="no-print-overlay">
          <div style={PRINT_MODAL_TOOLBAR} className="no-print">
            <button
              onClick={() => setPrintData(null)}
            >
              ← Back to list
            </button>

            <button onClick={() => window.print()}>
              🖨️ Print
            </button>
          </div>

          <div
            style={PRINT_MODAL_SCROLL}
            className="no-print-scroll"
          >
            <SCLetter sc={printData} />
          </div>
        </div>
      )}

      {/* REUSABLE TOAST NOTIFICATION */}
      <ConfirmModal
          open={confirmSync}
          title="Sync CardExchange"
          message={`The current local CardExchange records will be replaced with the records matching your current filters.`}
          confirmText="Sync Now"
          onCancel={() => setConfirmSync(false)}
          onConfirm={() => {
            setConfirmSync(false);
            syncCardExchange();
          }}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

function MenuItem({ onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 8,
        padding: "10px 14px", border: "none", background: "#fff",
        color, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
        textAlign: "left", fontFamily: "'Poppins', sans-serif",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f6fbfe")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
    >
      {children}
    </button>
  );
}

function SCLetter({ sc }) {
  const firstName = sc.full_name?.split(" ")[0] || "";
  return (
    <div className="print-area" style={{ width: "210mm", minHeight: "297mm", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ position: "relative", height: "92mm", overflow: "hidden" }}>
        {/* Real header wave graphic from the CCLPI letterhead template */}
        <img
          src={headerWave}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Top-right company contact block */}
        <div style={{ position: "absolute", top: "6mm", right: "8mm", color: "#fff", fontSize: "9pt", lineHeight: 1.5, textAlign: "right", right: "13mm"}}>
          <div>{COMPANY.addressLine1}</div>
          <div>{COMPANY.addressLine2}</div>
          <div style={{ fontWeight: 700 }}>{COMPANY.phone}</div>
          <div style={{ fontWeight: 700 }}>{COMPANY.email}</div>
          <div>{COMPANY.website}</div>
        </div>

        {/* Angelica Life Plan logo */}
        <img
          src={angelicaLogo}
          alt="Angelica Life Plan"
          style={{ position: "absolute", top: "16mm", left: "18mm", width: "70mm", height: "auto" }}
        />

        {/* Bottom-left counselor info block — stacked in normal flow so nothing overlaps */}
        <div style={{ position: "absolute", left: "15mm", bottom: "15mm", right: "45mm", color: "#fff" }}>
          <div style={{ color: "#5FC9F0", fontSize: "10pt", marginBottom: 3 }}>{sc.agency}</div>
          {sc.id_no && (
            <div style={{ fontSize: "11pt", fontWeight: 700, marginBottom: 3 }}>
              <span style={{ color: "#F3CF47" }}>SALES COUNSELOR CODE:</span> {sc.id_no}
            </div>
          )}
          <div style={{ fontSize: "12pt", fontWeight: 700, marginBottom: 3, lineHeight: 1.3 }}>{sc.full_name}</div>
          <div style={{ fontSize: "10pt", lineHeight: 1.35, width: "85mm", wordWrap: "break-word", overflowWrap: "break-word" }}>{sc.address}
          </div>
        </div>
      </div>

      <div style={{ padding: "10mm 15mm 12mm", fontSize: "10.5pt", color: "#0b1a3b", lineHeight: 1.5, textAlign: "justify" }}>
        <p>Dear <b>{firstName}</b>,</p>
        <br></br>
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
        <br></br>
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
            <img src={signatureImg} alt="Signature" style={{ height: "20mm", display: "block", marginBottom: 4 }} />
            <div style={{ color: "#013F99", fontWeight: 700 }}>{COMPANY.signatoryName}</div>
            <div style={{ fontWeight: 700 }}>{COMPANY.signatoryTitle}</div>
          </div>
          <img src={cclpiLogo} alt="CCLPI Plans" style={{ width: "26mm", height: "auto", marginRight: "40mm" }} />
        </div>
      </div>
    </div>
  );
}



const PRINT_MODAL_OVERLAY = { position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", flexDirection: "column" };
const PRINT_MODAL_TOOLBAR = { display: "flex", justifyContent: "space-between", padding: "12px 20px", background: "#fff" };
const PRINT_MODAL_SCROLL = { flex: 1, overflow: "auto", display: "flex", justifyContent: "center", padding: "24px 0 48px" };

const SPIN_CSS = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

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