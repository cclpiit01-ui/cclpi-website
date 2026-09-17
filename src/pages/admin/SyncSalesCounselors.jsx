import { useState } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";

/**
 * Sync Sales Counselors (Main API → Supabase)
 * ---------------------------------------------------------------
 * The job of this file: pull records from the main (slow,
 * read-only) Sales Counselor API and upsert them into Supabase's
 * `sales_counselors` table — inserting brand-new counselors AND
 * refreshing core fields (name, address, expiry_date, etc.) on
 * existing ones, so edits made on the main API side show up here
 * too.
 *
 * It NEVER touches position / date_release / qr_link — those
 * columns are simply left out of the upsert payload, and Postgres
 * only writes columns that are present, so anything edited via
 * SalesCounselorManagement stays exactly as-is no matter how many
 * times this sync runs.
 *
 * SalesCounselorManagement.jsx no longer talks to the main API at
 * all — it reads only from Supabase, which is why it's fast and
 * "real-time" from the app's point of view. This file is what
 * keeps Supabase caught up with new counselors from the API.
 *
 * Run this however fits your workflow:
 *   - Manually, via the "Sync Now" button below
 *   - On a schedule (n8n, a cron hitting a small backend endpoint
 *     that calls runSync-equivalent logic, etc.)
 *   - Both `SyncSalesCounselors` (the page) and `runSync` (the
 *     underlying function) are exported, so you can reuse runSync
 *     from anywhere else in the app too (e.g. a "Sync" button
 *     inside SalesCounselorManagement's toolbar) without
 *     duplicating this logic.
 * ---------------------------------------------------------------
 */

const API_URL = import.meta.env.VITE_SALES_COUNSELOR_API_URL;
const API_TOKEN = import.meta.env.VITE_SALES_COUNSELOR_API_TOKEN;
const SC_TABLE = "sales_counselors";

export async function runSync() {
  // 1. Pull everything from the main API.
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  const json = await res.json();
  const apiRows = Array.isArray(json) ? json : (json.data || []);

  // 2. Get existing id_no's from Supabase — id_no only, so this stays
  //    light even with 5,000+ rows. Used only for the New vs Updated
  //    counts below; the actual write is one upsert covering everyone.
  const { data: existing, error: fetchErr } = await supabaseEmployees
    .from(SC_TABLE)
    .select("id_no");
  if (fetchErr) throw fetchErr;
  const existingSet = new Set((existing || []).map((r) => r.id_no));

  const validRows = apiRows.filter((r) => r.id_no);
  const newCount = validRows.filter((r) => !existingSet.has(r.id_no)).length;
  const updatedCount = validRows.length - newCount;

  // 3. Upsert EVERY row from the API — inserts brand-new counselors and
  //    refreshes core fields on existing ones (so edits made on the main
  //    API side, like a corrected address or a renewed expiry_date, show
  //    up here too). Only core fields are listed in the payload, so
  //    position / date_release / qr_link — which this app owns, not the
  //    API — are never touched by this upsert; PostgREST only writes the
  //    columns you include.
  if (validRows.length > 0) {
    const payload = validRows.map((r) => ({
      id_no: r.id_no,
      full_name: r.full_name,
      birthday: r.birthday,
      address: r.address,
      expiry_date: r.expiry_date ?? r.validity_date ?? null,
      is_paid: r.is_paid,
      or_date: r.or_date,
      picture: r.picture,
      signature: r.signature,
      manager: r.manager,
      agency: r.agency,
      // position, date_release, qr_link intentionally left out —
      // those are edited only via Sales Counselor Management, and
      // omitting them here means this upsert never overwrites them.
    }));
    const { error: upsertErr } = await supabaseEmployees
      .from(SC_TABLE)
      .upsert(payload, { onConflict: "id_no" });
    if (upsertErr) throw upsertErr;
  }

  return {
    totalInApi: apiRows.length,
    newlyInserted: newCount,
    updated: updatedCount,
  };
}

export default function SyncSalesCounselors() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastRunAt, setLastRunAt] = useState(null);

  const handleSync = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const summary = await runSync();
      setResult(summary);
      setLastRunAt(new Date());
    } catch (err) {
      setError(err.message || "Sync failed.");
    }
    setRunning(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Sync Sales Counselors</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Inserts new counselors and refreshes core fields from the main API. Never touches position, date released, or QR link.</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(1,63,153,0.08)", padding: 28, maxWidth: 560 }}>
        <button
          onClick={handleSync}
          disabled={running}
          style={{
            padding: "12px 24px", borderRadius: 10, border: "none",
            background: running ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)",
            color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: running ? "not-allowed" : "pointer",
            fontFamily: "'Poppins', sans-serif",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {running ? "Syncing..." : "Sync Now"}
        </button>

        {error && (
          <div style={{ marginTop: 20, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 10, fontSize: 13 }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div style={{ padding: "14px 16px", background: "#f6fbfe", borderRadius: 10, border: "1px solid rgba(1,63,153,0.08)" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>In API</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#013F99", marginTop: 4 }}>{result.totalInApi}</div>
            </div>
            <div style={{ padding: "14px 16px", background: "#f0fdf4", borderRadius: 10, border: "1px solid rgba(34,197,94,0.2)" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Newly Inserted</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#16a34a", marginTop: 4 }}>{result.newlyInserted}</div>
            </div>
            <div style={{ padding: "14px 16px", background: "#fffbeb", borderRadius: 10, border: "1px solid rgba(243,207,71,0.4)" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Updated (Core Fields)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#b8860b", marginTop: 4 }}>{result.updated}</div>
            </div>
          </div>
        )}

        {lastRunAt && (
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 16 }}>Last run: {lastRunAt.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
