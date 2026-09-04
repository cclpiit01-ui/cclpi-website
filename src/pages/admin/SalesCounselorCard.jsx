import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CCLPILogo from "@/assets/logo-box.png";

const API_URL = import.meta.env.VITE_SALES_COUNSELOR_API_URL;
const API_TOKEN = import.meta.env.VITE_SALES_COUNSELOR_API_TOKEN;

const isActiveValue = (expiryDateStr) => {
  if (!expiryDateStr) return false;
  const expiry = new Date(expiryDateStr);
  if (isNaN(expiry.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry.getTime() >= today.getTime();
};

export default function SalesCounselorCard() {
  const { id } = useParams();
  const [sc, setSc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        const rows = Array.isArray(json) ? json : (json.data || []);
        const normalized = rows.map((r) => ({
          ...r,
          expiry_date: r.expiry_date ?? r.validity_date ?? null,
        }));
        const match = normalized.find((row) => row.id_no === id);
        if (!match) setNotFound(true);
        else setSc(match);
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchCounselor();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", color: "#013F99" }}>
        Loading...
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", flexDirection: "column", gap: 12, padding: 20, textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0b1a3b" }}>Sales counselor not found</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Baka mali ang link o wala nang record na ito.</div>
      </div>
    );
  }

  const active = isActiveValue(sc.expiry_date);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #013F99, #4CB1E9)", fontFamily: "'Poppins', sans-serif", padding: "40px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "36px 28px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <img src={CCLPILogo} alt="CCLPI" style={{ height: 36, marginBottom: 20 }} />

          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #013F99, #4CB1E9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 32, margin: "0 auto" }}>
            {sc.full_name?.[0]?.toUpperCase() || "?"}
          </div>

          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0b1a3b", margin: "16px 0 2px" }}>{sc.full_name}</h1>
          <p style={{ fontSize: 13, color: "#4CB1E9", fontWeight: 600, margin: 0 }}>{sc.position || "—"}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>Sales Counselor Code: {sc.id_no}</p>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            {sc.agency && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(1,63,153,0.08)", color: "#013F99", fontWeight: 600 }}>{sc.agency}</span>}
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: active ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{active ? "Active" : "Expired"}</span>
          </div>

          <div style={{ height: 1, background: "rgba(1,63,153,0.08)", margin: "20px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
            {sc.birthday && (
              <ProfileRow
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                label="Birthday" value={sc.birthday} />
            )}
            {sc.expiry_date && (
              <ProfileRow
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                label="Expiry Date" value={sc.expiry_date} />
            )}
            <ProfileRow
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9M14 17H5M17 21l4-4-4-4M7 3 3 7l4 4"/></svg>}
              label="Batch No." value={sc.batch_no || "—"} />
            {sc.or_date && (
              <ProfileRow
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                label="OR Date (Started Date)" value={sc.or_date} />
            )}
            {sc.address && (
              <ProfileRow
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                label="Address" value={sc.address} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ fontSize: 18, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
        <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500, wordBreak: "break-word" }}>{value}</div>
      </div>
    </div>
  );
}