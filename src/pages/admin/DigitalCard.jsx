import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import CCLPILogo from "@/assets/logo-box.png";

export default function DigitalCard() {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      const { data, error } = await supabaseEmployees
        .from("employee_cards")
        .select("*, employees(id, full_name, job_position, picture)")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error || !data) setNotFound(true);
      else setCard(data);
      setLoading(false);
    };
    fetchCard();
  }, [slug]);

  const handleSaveContact = () => {
    const emp = card.employees;
    const nameParts = emp.full_name.trim().split(" ");
    const lastName = nameParts.pop();
    const firstName = nameParts.join(" ");

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lastName};${firstName};;;`,
      `FN:${emp.full_name}`,
      emp.job_position ? `TITLE:${emp.job_position}` : "",
      "ORG:Cosmopolitan CLIMBS Life Plan Inc.",
      card.email ? `EMAIL;TYPE=WORK:${card.email}` : "",
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : "",
      card.address ? `ADR;TYPE=WORK:;;${card.address};;;;` : "",
      card.website ? `URL:https://${card.website.replace(/^https?:\/\//, "")}` : "",
      "END:VCARD",
    ].filter(Boolean).join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${emp.full_name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0b1a3b" }}>Card not found</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Baka mali ang link o na-deactivate na ang card na ito.</div>
      </div>
    );
  }

  const emp = card.employees;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #013F99, #4CB1E9)", fontFamily: "'Poppins', sans-serif", padding: "40px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "36px 28px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <img src={CCLPILogo} alt="CCLPI" style={{ height: 36, marginBottom: 20 }} />

          {emp.picture ? (
            <img src={emp.picture} alt={emp.full_name} style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(1,63,153,0.1)", margin: "0 auto" }} />
          ) : (
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #013F99, #4CB1E9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 32, margin: "0 auto" }}>
              {emp.full_name?.[0]?.toUpperCase() || "?"}
            </div>
          )}

          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0b1a3b", margin: "16px 0 2px" }}>{emp.full_name}</h1>
          <p style={{ fontSize: 13, color: "#4CB1E9", fontWeight: 600, margin: 0 }}>{emp.job_position || "—"}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>Cosmopolitan CLIMBS Life Plan Inc.</p>

          <div style={{ height: 1, background: "rgba(1,63,153,0.08)", margin: "20px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
                        {card.phone && (
              <ContactRow
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>}
                label="Phone" value={card.phone} href={`tel:${card.phone}`} />
            )}
            {card.email && (
              <ContactRow
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                label="Email" value={card.email} href={`mailto:${card.email}`} />
            )}
            {card.address && (
              <ContactRow
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                label="Address" value={card.address} />
            )}
            {card.website && (
              <ContactRow
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#013F99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                label="Website" value={card.website} href={`https://${card.website.replace(/^https?:\/\//, "")}`} />
            )}
          </div>

          <button
            onClick={handleSaveContact}
            style={{ width: "100%", marginTop: 28, padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Save to Contacts
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value, href }) {
  const content = (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ fontSize: 18, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
        <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500, wordBreak: "break-word" }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} style={{ textDecoration: "none" }}>{content}</a> : content;
}