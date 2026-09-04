import { useState, useEffect } from "react";
import headerWave from '../../assets/header-wave.png';
import cclpiLogo from '../../assets/cclpi-logo.jpg';
import signatureImg from '../../assets/signature.png';
import angelicaLogo from '../../assets/angelica.png';
import QRCode from "qrcode";



const API_URL = import.meta.env.VITE_SALES_COUNSELOR_API_URL;
// Set VITE_SALES_COUNSELOR_API_TOKEN in your .env file (and .env.example),
// e.g. VITE_SALES_COUNSELOR_API_TOKEN=your-bearer-token-here
const API_TOKEN = import.meta.env.VITE_SALES_COUNSELOR_API_TOKEN;

const CARD_BASE_URL = window.location.origin + "/counselor";

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
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [agencyFilter, setAgencyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;


  const [printData, setPrintData] = useState(null);

  useEffect(() => { fetchCounselors(); }, []);

  const fetchCounselors = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      const rows = Array.isArray(json) ? json : (json.data || []);
      // Normalize: API returns "validity_date" — UI expects "expiry_date"
      const normalized = rows.map((r) => ({
        ...r,
        expiry_date: r.expiry_date ?? r.validity_date ?? null,
      }));
      setCounselors(normalized);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load sales counselors.");
      setCounselors([]);
    }
    setLoading(false);
  };

  // Client-side sort by date_released since the API doesn't support ?order params here.
  const sorted = [...counselors].sort((a, b) => {
    const da = a.date_released ? new Date(a.date_released).getTime() : 0;
    const db = b.date_released ? new Date(b.date_released).getTime() : 0;
    return sortOrder === "asc" ? da - db : db - da;
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
    const counselorUrl = `${CARD_BASE_URL}/${sc.id_no}`;
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
    } catch (err) {
      alert("Error generating QR: " + err.message);
    }
  };

  return (
    <div>
      <style>{PRINT_CSS}</style>

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

            <button onClick={fetchCounselors}
              style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Refresh
            </button>
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
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => window.open(`/counselor/${sc.id_no}`, "_blank")} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(76,177,233,0.3)", background: "#fff", color: "#4CB1E9", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                  View
                                </button>
                                <button onClick={() => setPrintData(sc)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(243,207,71,0.4)", background: "#fff", color: "#b8860b", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                  Print
                                </button>
                                <button onClick={() => handleDownloadQr(sc)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="17" y1="17" x2="17" y2="21"/><line x1="21" y1="17" x2="21" y2="21"/><line x1="17" y1="21" x2="21" y2="21"/></svg>
                                  QR
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