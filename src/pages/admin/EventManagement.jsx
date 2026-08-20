import { useState, useEffect, useRef } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import QRCode from "qrcode";
import * as XLSX from "xlsx";

const RSVP_BASE_URL = window.location.origin + "/rsvp"; // adjust kung iba ang deployed domain

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [rsvpCounts, setRsvpCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Create/Edit event form
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({});
  const [bannerFile, setBannerFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // RSVP list modal
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [rsvpList, setRsvpList] = useState([]);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Invitation card modal
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardEvent, setCardEvent] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabaseEmployees
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setEvents(data);

    const { data: rsvpData } = await supabaseEmployees
      .from("event_rsvps")
      .select("event_id, response");

    const counts = {};
    (rsvpData || []).forEach(r => {
      if (!counts[r.event_id]) counts[r.event_id] = { confirmed: 0, declined: 0 };
      if (r.response === "Confirmed") counts[r.event_id].confirmed++;
      else counts[r.event_id].declined++;
    });
    setRsvpCounts(counts);
    setLoading(false);
  };

  const slugify = (title) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

  // ── EVENT FORM ─────────────────────────────
  const openCreateForm = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      event_date: "",
      location: "",
      is_active: true,
      form_fields: [
        { id: "name", label: "Full Name", type: "text", required: true, locked: true },
      ],
    });
    setBannerFile(null);
    setFormOpen(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setEventForm({ ...event, form_fields: event.form_fields || [] });
    setBannerFile(null);
    setFormOpen(true);
  };

  const handleEventFormChange = (field, value) => setEventForm(prev => ({ ...prev, [field]: value }));

  const addCustomField = () => {
    setEventForm(prev => ({
      ...prev,
      form_fields: [
        ...prev.form_fields,
        { id: `field_${Date.now()}`, label: "", type: "text", options: [], required: false },
      ],
    }));
  };

  const updateCustomField = (index, key, value) => {
    setEventForm(prev => {
      const fields = [...prev.form_fields];
      fields[index] = { ...fields[index], [key]: value };
      return { ...prev, form_fields: fields };
    });
  };

  const removeCustomField = (index) => {
    setEventForm(prev => ({
      ...prev,
      form_fields: prev.form_fields.filter((_, i) => i !== index),
    }));
  };

  const uploadBanner = async (file) => {
    const ext = file.name.split(".").pop();
    const filename = `banners/${Date.now()}.${ext}`;
    const { error } = await supabaseEmployees.storage.from("event-banners").upload(filename, file);
    if (error) throw error;
    const { data } = supabaseEmployees.storage.from("event-banners").getPublicUrl(filename);
    return data.publicUrl;
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title) {
      alert("Kailangan ng Event Title.");
      return;
    }
    setSaving(true);
    try {
      let bannerUrl = eventForm.banner_image_url;
      if (bannerFile) bannerUrl = await uploadBanner(bannerFile);

      const payload = {
        title: eventForm.title,
        description: eventForm.description || null,
        event_date: eventForm.event_date || null,
        location: eventForm.location || null,
        banner_image_url: bannerUrl || null,
        form_fields: eventForm.form_fields || [],
        is_active: eventForm.is_active !== false,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (editingEvent) {
        ({ error } = await supabaseEmployees.from("events").update(payload).eq("id", editingEvent.id));
      } else {
        payload.slug = slugify(eventForm.title);
        ({ error } = await supabaseEmployees.from("events").insert(payload));
      }
      if (error) throw error;

      setFormOpen(false);
      await fetchEvents();
    } catch (err) {
      alert("Error saving event: " + err.message);
    }
    setSaving(false);
  };

  const handleDeleteEvent = async (event) => {
    if (!confirm(`Burahin ang event na "${event.title}"? Mabubura din lahat ng RSVP responses nito.`)) return;
    const { error } = await supabaseEmployees.from("events").delete().eq("id", event.id);
    if (error) { alert("Error deleting: " + error.message); return; }
    await fetchEvents();
  };

  // ── RSVP LIST ─────────────────────────────
  const openRsvpList = async (event) => {
    setActiveEvent(event);
    setRsvpModalOpen(true);
    setRsvpLoading(true);
    const { data } = await supabaseEmployees
      .from("event_rsvps")
      .select("*")
      .eq("event_id", event.id)
      .order("responded_at", { ascending: false });
    setRsvpList(data || []);
    setRsvpLoading(false);
  };

  const handleExportRsvps = () => {
    if (!activeEvent) return;
    const fieldLabels = (activeEvent.form_fields || []).reduce((acc, f) => {
      acc[f.id] = f.label;
      return acc;
    }, {});

    const rows = rsvpList.map(r => {
      const row = { "Response": r.response, "Submitted At": new Date(r.responded_at).toLocaleString() };
      Object.entries(r.answers || {}).forEach(([key, val]) => {
        row[fieldLabels[key] || key] = val;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");
    XLSX.writeFile(workbook, `${activeEvent.title.replace(/\s+/g, "_")}_RSVPs.xlsx`);
  };

  // ── INVITATION CARD / QR ─────────────────────────────
  const openCardModal = async (event) => {
    setCardEvent(event);
    setCardModalOpen(true);
    const rsvpUrl = `${RSVP_BASE_URL}/${event.slug}`;
    const dataUrl = await QRCode.toDataURL(rsvpUrl, { width: 400, margin: 1, color: { dark: "#013F99", light: "#FFFFFF" } });
    setQrDataUrl(dataUrl);
  };

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${cardEvent.title.replace(/\s+/g, "_")}_Invitation.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopyLink = () => {
    const rsvpUrl = `${RSVP_BASE_URL}/${cardEvent.slug}`;
    navigator.clipboard.writeText(rsvpUrl);
    alert("Na-copy na ang RSVP link!");
  };

  // ── Draw invitation card on canvas whenever QR + event ready ──
  useEffect(() => {
    if (!cardModalOpen || !qrDataUrl || !cardEvent) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 800, H = 1000;
    canvas.width = W;
    canvas.height = H;

    const drawEverything = (bannerImg) => {
      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#013F99");
      grad.addColorStop(1, "#4CB1E9");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Banner image (top portion) if available
      if (bannerImg) {
        const bannerH = 380;
        ctx.drawImage(bannerImg, 0, 0, W, bannerH);
        ctx.fillStyle = "rgba(1,63,153,0.25)";
        ctx.fillRect(0, 0, W, bannerH);
      }

      // White card panel
      const panelY = bannerImg ? 340 : 60;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 40, panelY, W - 80, H - panelY - 40, 24);
      ctx.fill();

      // Title
      ctx.fillStyle = "#0b1a3b";
      ctx.font = "bold 42px Arial";
      ctx.textAlign = "center";
      wrapText(ctx, cardEvent.title, W / 2, panelY + 70, W - 160, 50);

      // Date / Location
      ctx.font = "20px Arial";
      ctx.fillStyle = "#4CB1E9";
      let infoY = panelY + 150;
      if (cardEvent.event_date) {
        ctx.fillText(new Date(cardEvent.event_date).toLocaleString("en-PH", { dateStyle: "full", timeStyle: "short" }), W / 2, infoY);
        infoY += 32;
      }
      if (cardEvent.location) {
        ctx.fillStyle = "#64748b";
        ctx.fillText(cardEvent.location, W / 2, infoY);
        infoY += 32;
      }

      // QR Code
      const qrImg = new Image();
      qrImg.onload = () => {
        const qrSize = 260;
        const qrX = (W - qrSize) / 2;
        const qrY = infoY + 30;
        ctx.fillStyle = "#fff";
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.strokeStyle = "#013F99";
        ctx.lineWidth = 3;
        ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        ctx.font = "16px Arial";
        ctx.fillStyle = "#64748b";
        ctx.fillText("Scan to confirm or decline your attendance", W / 2, qrY + qrSize + 40);

        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "#013F99";
        ctx.fillText("CCLPI Plans", W / 2, H - 30);
      };
      qrImg.src = qrDataUrl;
    };

    if (cardEvent.banner_image_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => drawEverything(img);
      img.onerror = () => drawEverything(null);
      img.src = cardEvent.banner_image_url;
    } else {
      drawEverything(null);
    }
  }, [cardModalOpen, qrDataUrl, cardEvent]);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let lines = [];
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line !== "") {
        lines.push(line);
        line = word + " ";
      } else {
        line = test;
      }
    }
    lines.push(line);
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx.fillText(l.trim(), x, startY + i * lineHeight));
  }

  const inputStyle = { padding: "10px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box", background: "#fafcff" };
  const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 };

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Events</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Create events, generate QR invitations, at track RSVPs</p>
        </div>
        <button onClick={openCreateForm}
          style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Event
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading events...</div>
      ) : events.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 13, background: "#fff", borderRadius: 16, border: "1px solid rgba(1,63,153,0.08)" }}>Wala pang event. Click "Create Event" para makagawa ng una.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {events.map(event => {
            const counts = rsvpCounts[event.id] || { confirmed: 0, declined: 0 };
            return (
              <div key={event.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(1,63,153,0.08)", overflow: "hidden" }}>
                {event.banner_image_url ? (
                  <div style={{ height: 140, background: `url(${event.banner_image_url}) center/cover` }} />
                ) : (
                  <div style={{ height: 140, background: "linear-gradient(135deg, #013F99, #4CB1E9)" }} />
                )}
                <div style={{ padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0b1a3b" }}>{event.title}</div>
                    <span style={{ padding: "3px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: event.is_active ? "rgba(34,197,94,0.1)" : "rgba(148,163,184,0.15)", color: event.is_active ? "#16a34a" : "#64748b" }}>{event.is_active ? "Active" : "Closed"}</span>
                  </div>
                  {event.event_date && <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>📅 {new Date(event.event_date).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}</div>}
                  {event.location && <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>📍 {event.location}</div>}

                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <div style={{ flex: 1, padding: "8px 10px", background: "rgba(34,197,94,0.08)", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>{counts.confirmed}</div>
                      <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase" }}>Confirmed</div>
                    </div>
                    <div style={{ flex: 1, padding: "8px 10px", background: "rgba(239,68,68,0.08)", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#dc2626" }}>{counts.declined}</div>
                      <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase" }}>Declined</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => openCardModal(event)} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>QR / Invitation</button>
                    <button onClick={() => openRsvpList(event)} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>View RSVPs</button>
                    <button onClick={() => openEditForm(event)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDeleteEvent(event)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "#fff", color: "#dc2626", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE/EDIT EVENT MODAL */}
      {formOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 800, padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>{editingEvent ? "Edit Event" : "Create Event"}</h2>
              <button onClick={() => setFormOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Event Title</label>
                <input type="text" value={eventForm.title || ""} onChange={(e) => handleEventFormChange("title", e.target.value)} style={inputStyle} placeholder="e.g. CCLPI Christmas Party 2026" />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Description</label>
                <input type="text" value={eventForm.description || ""} onChange={(e) => handleEventFormChange("description", e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Date & Time</label>
                  <input type="datetime-local" value={eventForm.event_date || ""} onChange={(e) => handleEventFormChange("event_date", e.target.value)} style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Location</label>
                  <input type="text" value={eventForm.location || ""} onChange={(e) => handleEventFormChange("location", e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Banner Image</label>
                {eventForm.banner_image_url && !bannerFile && (
                  <img src={eventForm.banner_image_url} alt="banner" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, marginBottom: 8 }} />
                )}
                <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} style={{ padding: "8px 12px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, width: "100%", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={eventForm.is_active !== false} onChange={(e) => handleEventFormChange("is_active", e.target.checked)} id="is_active" />
                <label htmlFor="is_active" style={{ fontSize: 13, color: "#0b1a3b" }}>Active (pwedeng mag-RSVP)</label>
              </div>

              <div style={{ height: 1, background: "rgba(1,63,153,0.08)", margin: "8px 0" }} />

              {/* FORM FIELD BUILDER */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1a3b", fontFamily: "'Montserrat', sans-serif" }}>RSVP Form Fields</div>
                  <button onClick={addCustomField} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Add Field</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(eventForm.form_fields || []).map((field, index) => (
                    <div key={field.id} style={{ padding: 14, background: "#f6fbfe", borderRadius: 10, border: "1px solid rgba(1,63,153,0.08)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: field.locked ? "1fr" : "2fr 1fr auto", gap: 10, alignItems: "center" }}>
                        <input
                          type="text"
                          value={field.label}
                          disabled={field.locked}
                          onChange={(e) => updateCustomField(index, "label", e.target.value)}
                          placeholder="Field label (e.g. Dietary Restrictions)"
                          style={{ ...inputStyle, background: field.locked ? "#e9eef5" : "#fff" }}
                        />
                        {!field.locked && (
                          <>
                            <select value={field.type} onChange={(e) => updateCustomField(index, "type", e.target.value)} style={inputStyle}>
                              <option value="text">Text</option>
                              <option value="select">Dropdown</option>
                              <option value="yesno">Yes/No</option>
                            </select>
                            <button onClick={() => removeCustomField(index)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "#dc2626" }}>✕</button>
                          </>
                        )}
                        {field.locked && <span style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>Default field, hindi puwedeng burahin</span>}
                      </div>

                      {!field.locked && field.type === "select" && (
                        <div style={{ marginTop: 8 }}>
                          <input
                            type="text"
                            value={(field.options || []).join(", ")}
                            onChange={(e) => updateCustomField(index, "options", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            placeholder="Options separated by comma (e.g. Small, Medium, Large)"
                            style={inputStyle}
                          />
                        </div>
                      )}

                      {!field.locked && (
                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" checked={field.required || false} onChange={(e) => updateCustomField(index, "required", e.target.checked)} id={`req-${field.id}`} />
                          <label htmlFor={`req-${field.id}`} style={{ fontSize: 11, color: "#64748b" }}>Required field</label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(1,63,153,0.08)" }}>
              <button onClick={() => setFormOpen(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveEvent} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: saving ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : editingEvent ? "Save Changes" : "Create Event"}</button>
            </div>
          </div>
        </div>
      )}

      {/* RSVP LIST MODAL */}
      {rsvpModalOpen && activeEvent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 800, padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0 }}>{activeEvent.title} — RSVPs</h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>{rsvpList.length} total responses</p>
              </div>
              <button onClick={() => setRsvpModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 16 }} />

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={handleExportRsvps} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", background: "#fff", color: "#16a34a", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Export to Excel</button>
            </div>

            {rsvpLoading ? (
              <div style={{ padding: 30, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading...</div>
            ) : rsvpList.length === 0 ? (
              <div style={{ padding: 30, textAlign: "center", color: "#94a3b8", fontSize: 13, background: "#f6fbfe", borderRadius: 12 }}>Wala pang RSVP para sa event na ito.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }}>
                {rsvpList.map(r => (
                  <div key={r.id} style={{ padding: "12px 16px", background: "#f6fbfe", borderRadius: 10, border: "1px solid rgba(1,63,153,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0b1a3b" }}>{r.answers?.name || "—"}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                        {Object.entries(r.answers || {}).filter(([k]) => k !== "name").map(([k, v]) => `${k}: ${v}`).join(" · ")}
                      </div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{new Date(r.responded_at).toLocaleString()}</div>
                    </div>
                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: r.response === "Confirmed" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: r.response === "Confirmed" ? "#16a34a" : "#dc2626" }}>{r.response}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INVITATION CARD / QR MODAL */}
      {cardModalOpen && cardEvent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 480, padding: 24, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0b1a3b", margin: 0 }}>Invitation Card</h2>
              <button onClick={() => setCardModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <canvas ref={canvasRef} style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(1,63,153,0.08)" }} />

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={handleCopyLink} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Copy RSVP Link</button>
              <button onClick={handleDownloadCard} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Download Card</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}