import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import CCLPILogo from "@/assets/logo-box.png";

export default function EventRSVP() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null); // "Confirmed" | "Declined" | null

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabaseEmployees
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error || !data) setNotFound(true);
      else setEvent(data);
      setLoading(false);
    };
    fetchEvent();
  }, [slug]);

  const handleChange = (fieldId, value) => setAnswers(prev => ({ ...prev, [fieldId]: value }));

  const validateRequired = () => {
    const fields = event.form_fields || [];
    for (const f of fields) {
      if (f.required && !answers[f.id]) {
        alert(`Kailangan punan ang "${f.label}".`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (response) => {
    if (!validateRequired()) return;
    setSubmitting(true);
    const { error } = await supabaseEmployees.from("event_rsvps").insert({
      event_id: event.id,
      answers,
      response,
    });
    setSubmitting(false);
    if (error) {
      alert("May error, subukan ulit: " + error.message);
      return;
    }
    setSubmitted(response);
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
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0b1a3b" }}>Event not found or no longer active</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>I-check ang link o makipag-ugnayan sa organizer.</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #013F99, #4CB1E9)", fontFamily: "'Poppins', sans-serif", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{submitted === "Confirmed" ? "🎉" : "😔"}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", marginBottom: 8 }}>
            {submitted === "Confirmed" ? "Salamat sa pag-confirm!" : "Salamat sa pag-response"}
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {submitted === "Confirmed"
              ? `Nakatakda ka na para sa "${event.title}". Kitakits!`
              : `Naitala na na hindi ka makakadalo sa "${event.title}".`}
          </div>
        </div>
      </div>
    );
  }

  const fields = event.form_fields || [];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #013F99, #4CB1E9)", fontFamily: "'Poppins', sans-serif", padding: "40px 16px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {event.banner_image_url && (
          <img src={event.banner_image_url} alt={event.title} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: "16px 16px 0 0" }} />
        )}
        <div style={{ background: "#fff", borderRadius: event.banner_image_url ? "0 0 16px 16px" : 16, padding: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img src={CCLPILogo} alt="CCLPI" style={{ height: 40, marginBottom: 12 }} />
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0b1a3b", margin: 0 }}>{event.title}</h1>
            {event.description && <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>{event.description}</p>}
            {event.event_date && <p style={{ fontSize: 13, color: "#4CB1E9", fontWeight: 600, marginTop: 8 }}>📅 {new Date(event.event_date).toLocaleString("en-PH", { dateStyle: "full", timeStyle: "short" })}</p>}
            {event.location && <p style={{ fontSize: 13, color: "#64748b" }}>📍 {event.location}</p>}
          </div>

          <div style={{ height: 1, background: "rgba(1,63,153,0.08)", margin: "16px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map(field => (
              <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0b1a3b" }}>
                  {field.label}{field.required && <span style={{ color: "#dc2626" }}> *</span>}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={answers[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    style={{ padding: "12px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "'Poppins', sans-serif" }}
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={answers[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    style={{ padding: "12px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "'Poppins', sans-serif" }}
                  >
                    <option value="">Select...</option>
                    {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}

                {field.type === "yesno" && (
                  <div style={{ display: "flex", gap: 10 }}>
                    {["Yes", "No"].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange(field.id, opt)}
                        style={{
                          flex: 1, padding: "10px", borderRadius: 10,
                          border: answers[field.id] === opt ? "2px solid #013F99" : "1px solid rgba(1,63,153,0.15)",
                          background: answers[field.id] === opt ? "rgba(1,63,153,0.06)" : "#fff",
                          color: answers[field.id] === opt ? "#013F99" : "#64748b",
                          fontSize: 13, fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button
              onClick={() => handleSubmit("Declined")}
              disabled={submitting}
              style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.3)", background: "#fff", color: "#dc2626", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}
            >
              Decline
            </button>
            <button
              onClick={() => handleSubmit("Confirmed")}
              disabled={submitting}
              style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}