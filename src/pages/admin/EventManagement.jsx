import { useState, useEffect } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import QRCode from "qrcode";
import Toast from "@/components/toast";
export default function EventManagement() {
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type, id: Date.now() });
  const [events, setEvents] = useState([]);
  const [invitationCounts, setInvitationCounts] = useState({});
  const [loading, setLoading] = useState(true);
  // Create/Edit event form
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({});
  const [bannerFile, setBannerFile] = useState(null);
  const [headingFile, setHeadingFile] = useState(null);
  const [saving, setSaving] = useState(false);
  // ── CUSTOM INVITATIONS ─────────────────────────────
const openInvitationModal = async (event) => {
  setInvitationEvent(event);
  setInvitationModalOpen(true);
  setShowInvitationForm(false);
  setInvitationList([]);
  setInvitationListLoading(true);
  const { data, error } = await supabaseEmployees
    .from("event_invitations")
    .select(`
      *,
      event_invitation_participants (
        id,
        full_name,
        contact_number,
        requires_air_travel,
        birthdate,
        valid_id_url
      )
    `)
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });
  if (error) {
    showToast(String("Error loading invitations: " + error.message), "error");
    setInvitationListLoading(false);
    return;
  }
  setInvitationList(data || []);
  setInvitationListLoading(false);
};
const openNewInvitationForm = () => {
  setInvitationForm({
    organization_name: "",
    participant_limit: 1,
  });
  setShowInvitationForm(true);
};
const handleSaveInvitation = async () => {
  if (!invitationEvent) return;
  if (!invitationForm.organization_name.trim()) {
    showToast("Kailangan ang Organization / Group Name.", "info");
    return;
  }
  const participantLimit = Number(invitationForm.participant_limit);
  if (!participantLimit || participantLimit < 1) {
    showToast("Participant limit must be at least 1.", "info");
    return;
  }
  setSavingInvitation(true);
  const { error } = await supabaseEmployees
    .from("event_invitations")
    .insert({
      event_id: invitationEvent.id,
      organization_name: invitationForm.organization_name.trim(),
      participant_limit: participantLimit,
    });
  setSavingInvitation(false);
  if (error) {
    showToast(String("Error creating invitation: " + error.message), "error");
    return;
  }
const { data: refreshedInvitations, error: refreshError } =
  await supabaseEmployees
    .from("event_invitations")
    .select(`
      *,
      event_invitation_participants (
        id,
        full_name,
        contact_number,
        requires_air_travel,
        birthdate,
        valid_id_url
      )
    `)
    .eq("event_id", invitationEvent.id)
    .order("created_at", { ascending: false });
if (!refreshError) {
  setInvitationList(refreshedInvitations || []);
}
setShowInvitationForm(false);
setInvitationForm({
  organization_name: "",
  participant_limit: 1,
});
showToast("Custom invitation created successfully!", "info");
};
// ── CUSTOM INVITATION QR ─────────────────────────────
const openCustomQrModal = async (invitation) => {
  try {
    setSelectedInvitation(invitation);
    const invitationUrl = `${window.location.origin}/rsvp/invite/${invitation.invitation_token}`;
    setCustomInvitationUrl(invitationUrl);
    const qr = await QRCode.toDataURL(invitationUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    setCustomQrDataUrl(qr);
    setCustomQrModalOpen(true);
  } catch (error) {
    showToast(String("Error generating QR: " + error.message), "error");
  }
};
const handleDownloadCustomQr = () => {
  if (!customQrDataUrl || !selectedInvitation) return;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    // White background para JPEG
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const jpegUrl = canvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement("a");
    const safeName = selectedInvitation.organization_name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    link.download = `${safeName}_${selectedInvitation.participant_limit}_participants_QR.jpg`;
    link.href = jpegUrl;
    link.click();
  };
  img.src = customQrDataUrl;
};
const handleCopyCustomInvitationLink = async () => {
  if (!customInvitationUrl) return;
  try {
    await navigator.clipboard.writeText(customInvitationUrl);
    showToast("Invitation link copied!", "success");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = customInvitationUrl;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("Invitation link copied!", "success");
  }
};
// Custom invitation modal
const [invitationModalOpen, setInvitationModalOpen] = useState(false);
const [invitationEvent, setInvitationEvent] = useState(null);
const [invitationForm, setInvitationForm] = useState({
  organization_name: "",
  participant_limit: 1,
});
const [savingInvitation, setSavingInvitation] = useState(false);
const [invitationList, setInvitationList] = useState([]);
const [invitationListLoading, setInvitationListLoading] = useState(false);
const [showInvitationForm, setShowInvitationForm] = useState(false);
const [selectedInvitation, setSelectedInvitation] = useState(null);
const [customQrDataUrl, setCustomQrDataUrl] = useState(null);
const [customQrModalOpen, setCustomQrModalOpen] = useState(false);
const [customInvitationUrl, setCustomInvitationUrl] = useState("");
const [participantModalOpen, setParticipantModalOpen] = useState(false);
const [participantInvitation, setParticipantInvitation] = useState(null);
const [participantLoading, setParticipantLoading] = useState(false);
  const [removeInvitation, setRemoveInvitation] = useState(null);
  const [removingInvitation, setRemovingInvitation] = useState(false);
  const [invitationActionMenu, setInvitationActionMenu] = useState(null);
  const [editInvitation, setEditInvitation] = useState(null);
  const [editInvitationForm, setEditInvitationForm] = useState({ organization_name: "", participant_limit: 1 });
  const [savingInvitationEdit, setSavingInvitationEdit] = useState(false);
  useEffect(() => { fetchEvents(); }, []);
  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabaseEmployees
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setEvents(data);
    const { data: invitationData } = await supabaseEmployees
      .from("event_invitations")
      .select(`event_id, status, participant_limit, event_invitation_participants (id, requires_air_travel)`);
    const counts = {};
    (invitationData || []).forEach(inv => {
      if (!counts[inv.event_id]) counts[inv.event_id] = { pending: 0, confirmed: 0, declined: 0, participants: 0, airTravel: 0 };
      if (inv.status === "Confirmed") counts[inv.event_id].confirmed++;
      else if (inv.status === "Declined") counts[inv.event_id].declined++;
      else counts[inv.event_id].pending++;
      const participants = inv.event_invitation_participants || [];
      counts[inv.event_id].participants += participants.length;
      counts[inv.event_id].airTravel += participants.filter(p => p.requires_air_travel).length;
    });
    setInvitationCounts(counts);
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
  banner_image_url: null,
  heading_image_url: null,
  is_active: true,
      form_fields: [
        { id: "name", label: "Full Name", type: "text", required: true, locked: true },
      ],
    });
    setBannerFile(null);
    setHeadingFile(null);
    setFormOpen(true);
  };
  const openEditForm = (event) => {
    setEditingEvent(event);
    setEventForm({ ...event, form_fields: event.form_fields || [] });
    setBannerFile(null);
    setHeadingFile(null);
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
  const uploadHeadingImage = async (file) => {
  const ext = file.name.split(".").pop();
  const filename = `headings/${Date.now()}.${ext}`;
  const { error } = await supabaseEmployees.storage
    .from("event-banners")
    .upload(filename, file);
  if (error) throw error;
  const { data } = supabaseEmployees.storage
    .from("event-banners")
    .getPublicUrl(filename);
  return data.publicUrl;
};
  const handleSaveEvent = async () => {
    if (!eventForm.title) {
      showToast("Kailangan ng Event Title.", "info");
      return;
    }
    setSaving(true);
    try {
      let bannerUrl = eventForm.banner_image_url;
      if (bannerFile) bannerUrl = await uploadBanner(bannerFile);
      let headingImageUrl = eventForm.heading_image_url;
if (headingFile) {
  headingImageUrl = await uploadHeadingImage(headingFile);
}
const payload = {
  title: eventForm.title,
  description: eventForm.description || null,
  event_date: eventForm.event_date || null,
  location: eventForm.location || null,
  banner_image_url: bannerUrl || null,
  heading_image_url: headingImageUrl || null,
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
      showToast(String("Error saving event: " + err.message), "error");
    }
    setSaving(false);
  };
  const handleDeleteEvent = async (event) => {
    if (!confirm(`Burahin ang event na "${event.title}"? Mabubura din lahat ng RSVP responses nito.`)) return;
    const { error } = await supabaseEmployees.from("events").delete().eq("id", event.id);
    if (error) { showToast(String("Error deleting: " + error.message), "error"); return; }
    await fetchEvents();
  };
  const openParticipantDetails = (invitation) => {
    setParticipantInvitation(invitation);
    setParticipantModalOpen(true);
  };
  const normalizeValidIdPath = (value) => {
    if (!value) return "";
    let path = String(value).trim();
    try {
      if (/^https?:\/\//i.test(path)) {
        const url = new URL(path);
        const marker = "/event-valid-ids/";
        const markerIndex = url.pathname.indexOf(marker);
        if (markerIndex >= 0) path = url.pathname.slice(markerIndex + marker.length);
      }
    } catch {}
    path = decodeURIComponent(path);
    path = path.replace(/^\/+/, "").replace(/^event-valid-ids\//, "");
    return path;
  };
  const openValidId = async (value) => {
    const path = normalizeValidIdPath(value);
    if (!path) return showToast("No Valid ID file path found.", "warning");
    setParticipantLoading(true);
    try {
      const { data, error } = await supabaseEmployees.storage.from("event-valid-ids").createSignedUrl(path, 300);
      if (error) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      showToast("Unable to open Valid ID: " + error.message, "error");
    } finally {
      setParticipantLoading(false);
    }
  };
  const downloadValidId = async (value, participantName = "valid-id") => {
    const path = normalizeValidIdPath(value);
    if (!path) return showToast("No Valid ID file path found.", "warning");
    setParticipantLoading(true);
    try {
      const { data, error } = await supabaseEmployees.storage.from("event-valid-ids").download(path);
      if (error) throw error;
      const extension = path.includes(".") ? path.split(".").pop().split("?")[0] : "file";
      const safeName = String(participantName || "valid-id").replace(/[^a-z0-9_-]/gi, "_");
      const blobUrl = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${safeName}_valid_id.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      showToast("Unable to download Valid ID: " + error.message, "error");
    } finally {
      setParticipantLoading(false);
    }
  };
  const openEditInvitation = (invitation) => {
    setInvitationActionMenu(null);
    setEditInvitation(invitation);
    setEditInvitationForm({ organization_name: invitation.organization_name || "", participant_limit: invitation.participant_limit || 1 });
  };
  const handleSaveInvitationEdit = async () => {
    if (!editInvitation || savingInvitationEdit) return;
    const organizationName = editInvitationForm.organization_name.trim();
    const participantLimit = Number(editInvitationForm.participant_limit);
    const registeredCount = (editInvitation.event_invitation_participants || []).length;
    if (!organizationName) return showToast("Organization / Group Name is required.", "info");
    if (!Number.isInteger(participantLimit) || participantLimit < 1) return showToast("Number of slots must be at least 1.", "info");
    if (participantLimit < registeredCount) return showToast(`Cannot set slots below ${registeredCount}. This invitation already has ${registeredCount} registered participant${registeredCount === 1 ? "" : "s"}.`, "warning");
    setSavingInvitationEdit(true);
    try {
      const { data, error } = await supabaseEmployees.from("event_invitations").update({
        organization_name: organizationName,
        participant_limit: participantLimit,
        updated_at: new Date().toISOString(),
      }).eq("id", editInvitation.id).select().single();
      if (error) throw error;
      setInvitationList((prev) => prev.map((item) => item.id === editInvitation.id ? { ...item, ...data } : item));
      if (selectedInvitation?.id === editInvitation.id) setSelectedInvitation((prev) => ({ ...prev, ...data }));
      setEditInvitation(null);
      showToast("Invitation updated successfully.", "success");
      await fetchEvents();
    } catch (error) {
      showToast("Unable to update invitation: " + error.message, "error");
    } finally {
      setSavingInvitationEdit(false);
    }
  };
  const handleRemoveInvitation = async () => {
    if (!removeInvitation || removingInvitation) return;
    const invitationToRemove = removeInvitation;
    const participants = invitationToRemove.event_invitation_participants || [];
    const participantCount = participants.length;
    const airTravelCount = participants.filter((p) => p.requires_air_travel).length;
    setRemovingInvitation(true);
    try {
      const validIdPaths = participants.map((p) => normalizeValidIdPath(p.valid_id_url)).filter(Boolean);
      if (validIdPaths.length) {
        const { error: storageError } = await supabaseEmployees.storage.from("event-valid-ids").remove(validIdPaths);
        if (storageError) throw storageError;
      }
      const { error } = await supabaseEmployees.from("event_invitations").delete().eq("id", invitationToRemove.id);
      if (error) throw error;
      setInvitationList((prev) => prev.filter((item) => item.id !== invitationToRemove.id));
      setInvitationCounts((prev) => {
        const current = prev[invitationToRemove.event_id] || { pending: 0, confirmed: 0, declined: 0, participants: 0, airTravel: 0 };
        const next = {
          ...current,
          pending: Math.max(0, current.pending - (invitationToRemove.status === "Pending" ? 1 : 0)),
          confirmed: Math.max(0, current.confirmed - (invitationToRemove.status === "Confirmed" ? 1 : 0)),
          declined: Math.max(0, current.declined - (invitationToRemove.status === "Declined" ? 1 : 0)),
          participants: Math.max(0, current.participants - participantCount),
          airTravel: Math.max(0, current.airTravel - airTravelCount),
        };
        return { ...prev, [invitationToRemove.event_id]: next };
      });
      setRemoveInvitation(null);
      await fetchEvents();
      showToast("Invitation removed successfully.", "success");
    } catch (error) {
      showToast("Unable to remove invitation: " + error.message, "error");
    } finally {
      setRemovingInvitation(false);
    }
  };
  const inputStyle = { padding: "10px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box", background: "#fafcff" };
  const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 };
  return (
    <div>
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Events</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Create events, manage custom invitations, and monitor guest responses</p>
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
            const counts = invitationCounts[event.id] || { pending: 0, confirmed: 0, declined: 0, participants: 0, airTravel: 0 };
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 14 }}>
                    {[
                      ["Pending", counts.pending, "#d97706", "rgba(245,158,11,0.08)"],
                      ["Confirmed", counts.confirmed, "#16a34a", "rgba(34,197,94,0.08)"],
                      ["Declined", counts.declined, "#dc2626", "rgba(239,68,68,0.08)"],
                      ["Guests", counts.participants, "#013F99", "rgba(1,63,153,0.08)"],
                    ].map(([label, value, color, background]) => (
                      <div key={label} style={{ padding: "8px 5px", background, borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color }}>{value}</div>
                        <div style={{ fontSize: 8, color: "#64748b", textTransform: "uppercase" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => openInvitationModal(event)} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer", }}> Invitations / Monitoring </button>
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
              {/* RSVP HEADING BACKGROUND */}
<div style={fieldStyle}>
  <label style={labelStyle}>
    RSVP Heading Background
  </label>
  {/* Existing uploaded image */}
  {eventForm.heading_image_url && !headingFile && (
    <img
      src={eventForm.heading_image_url}
      alt="RSVP heading"
      style={{
        width: "100%",
        aspectRatio: "3 / 1",
        objectFit: "cover",
        borderRadius: 10,
        marginBottom: 8,
      }}
    />
  )}
  {/* New selected image preview */}
  {headingFile && (
    <img
      src={URL.createObjectURL(headingFile)}
      alt="RSVP heading preview"
      style={{
        width: "100%",
        aspectRatio: "3 / 1",
        objectFit: "cover",
        borderRadius: 10,
        marginBottom: 8,
      }}
    />
  )}
  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={(e) =>
      setHeadingFile(e.target.files?.[0] || null)
    }
    style={{
      padding: "8px 12px",
      border: "1px solid rgba(1,63,153,0.15)",
      borderRadius: 8,
      fontSize: 13,
      width: "100%",
      boxSizing: "border-box",
    }}
  />
  <div
    style={{
      fontSize: 10,
      color: "#94a3b8",
      marginTop: 5,
    }}
  >
    Recommended size: 1200 × 400 px (3:1)
  </div>
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
      {/* CUSTOM INVITATION MODAL */}
{/* CUSTOM INVITATIONS MANAGER */}
{invitationModalOpen && invitationEvent && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 20,
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        width: "95%",
        maxWidth: 1400,
        padding: 28,
        boxSizing: "border-box",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0b1a3b",
              margin: 0,
            }}
          >
            Custom Invitations
          </h2>
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              marginTop: 4,
            }}
          >
            {invitationEvent.title}
          </div>
        </div>
        <button
          onClick={() => { setInvitationActionMenu(null); setInvitationModalOpen(false); }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            fontSize: 20,
          }}
        >
          ✕
        </button>
      </div>
      <div
        style={{
          height: 3,
          background:
            "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)",
          borderRadius: 2,
          marginBottom: 20,
        }}
      />
      {/* CREATE FORM */}
      {showInvitationForm ? (
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0b1a3b",
              marginBottom: 18,
            }}
          >
            Create New Invitation
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Organization / Group Name
            </label>
            <input
              type="text"
              value={invitationForm.organization_name}
              onChange={(e) =>
                setInvitationForm((prev) => ({
                  ...prev,
                  organization_name: e.target.value,
                }))
              }
              placeholder="e.g. AIM Coop"
              style={{
                ...inputStyle,
                marginTop: 6,
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              Number of Participants
            </label>
            <input
              type="number"
              min="1"
              value={invitationForm.participant_limit}
              onChange={(e) =>
                setInvitationForm((prev) => ({
                  ...prev,
                  participant_limit: e.target.value,
                }))
              }
              style={{
                ...inputStyle,
                marginTop: 6,
              }}
            />
            <div
              style={{
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 6,
              }}
            >
              Maximum number of participants allowed.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              onClick={() => setShowInvitationForm(false)}
              disabled={savingInvitation}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "1px solid rgba(1,63,153,0.15)",
                background: "#fff",
                color: "#64748b",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back
            </button>
            <button
              onClick={handleSaveInvitation}
              disabled={savingInvitation}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                background: savingInvitation
                  ? "#94a3b8"
                  : "linear-gradient(90deg, #013F99, #4CB1E9)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: savingInvitation
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {savingInvitation
                ? "Creating..."
                : "Create Invitation"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* TOP ACTION */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
            }}
          >
            <button
              onClick={openNewInvitationForm}
              style={{
                padding: "9px 16px",
                borderRadius: 9,
                border: "none",
                background:
                  "linear-gradient(90deg, #013F99, #4CB1E9)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Create New Invitation
            </button>
          </div>
          {/* INVITATION LIST */}
          {invitationListLoading ? (
            <div
              style={{
                padding: 30,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              Loading invitations...
            </div>
          ) : invitationList.length === 0 ? (
            <div
              style={{
                padding: 30,
                textAlign: "center",
                background: "#f6fbfe",
                borderRadius: 12,
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              Wala pang custom invitation para sa event na ito.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ overflowX: "auto", border: "1px solid rgba(1,63,153,0.10)", borderRadius: 12 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850, fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#f6fbfe" }}>
                      {["Organization", "Status", "Limit", "Registered", "Air Travel", "Participants", "Response Date", "Actions"].map((heading) => (
                        <th key={heading} style={{ padding: "11px 12px", textAlign: "left", color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(1,63,153,0.10)", whiteSpace: "nowrap" }}>{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invitationList.map((invitation) => {
                      const participants = invitation.event_invitation_participants || [];
                      const airTravelCount = participants.filter((p) => p.requires_air_travel).length;
                      const participantNames = participants.map((p) => p.full_name).filter(Boolean).join(", ");
                      return (
                        <tr key={invitation.id} style={{ borderBottom: "1px solid rgba(1,63,153,0.07)" }}>
                          <td style={{ padding: "12px", fontWeight: 700, color: "#0b1a3b", verticalAlign: "top" }}>{invitation.organization_name}</td>
                          <td style={{ padding: "12px", verticalAlign: "top" }}><span style={{ padding: "4px 9px", borderRadius: 20, fontSize: 9, fontWeight: 700, background: invitation.status === "Confirmed" ? "rgba(34,197,94,0.1)" : invitation.status === "Declined" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: invitation.status === "Confirmed" ? "#16a34a" : invitation.status === "Declined" ? "#dc2626" : "#d97706" }}>{invitation.status}</span></td>
                          <td style={{ padding: "12px", color: "#64748b", verticalAlign: "top" }}>{invitation.participant_limit}</td>
                          <td style={{ padding: "12px", color: "#0b1a3b", fontWeight: 600, verticalAlign: "top" }}>{participants.length}</td>
                          <td style={{ padding: "12px", color: airTravelCount ? "#013F99" : "#64748b", fontWeight: airTravelCount ? 700 : 400, verticalAlign: "top" }}>{airTravelCount}</td>
                          <td style={{ padding: "12px", color: "#64748b", verticalAlign: "top", maxWidth: 220 }}>{participantNames || (invitation.status === "Declined" ? `Declined: ${invitation.decline_reason || "No reason provided"}` : "—")}</td>
                          <td style={{ padding: "12px", color: "#64748b", verticalAlign: "top", whiteSpace: "nowrap" }}>{invitation.responded_at ? new Date(invitation.responded_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : "—"}</td>
                          <td style={{ padding: "12px", verticalAlign: "top", position: "relative" }}>
                              <button type="button" onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const menuHeight = 170;
                                const openUpward = rect.bottom + menuHeight > window.innerHeight - 12;
                                setInvitationActionMenu((current) => current?.id === invitation.id ? null : {
                                  id: invitation.id,
                                  top: openUpward ? Math.max(12, rect.top - menuHeight - 6) : rect.bottom + 6,
                                  left: Math.max(12, Math.min(rect.right - 140, window.innerWidth - 152)),
                                });
                              }} style={{ width: 34, height: 30, borderRadius: 8, border: "1px solid rgba(1,63,153,0.18)", background: "#fff", color: "#013F99", fontSize: 18, lineHeight: 1, fontWeight: 700, cursor: "pointer" }}>⋯</button>
                              {invitationActionMenu?.id === invitation.id && (
                                <div style={{ position: "fixed", top: invitationActionMenu.top, left: invitationActionMenu.left, zIndex: 9999, width: 140, padding: 6, background: "#fff", border: "1px solid rgba(1,63,153,0.12)", borderRadius: 10, boxShadow: "0 10px 28px rgba(15,23,42,0.18)" }}>
                                  {(invitation.status === "Confirmed" || invitation.status === "Declined") && <button type="button" onClick={() => { setInvitationActionMenu(null); openParticipantDetails(invitation); }} style={{ width: "100%", padding: "8px 10px", border: "none", background: "transparent", textAlign: "left", color: "#0b1a3b", fontSize: 11, fontWeight: 600, cursor: "pointer", borderRadius: 7 }}>View</button>}
                                  <button type="button" onClick={() => { setInvitationActionMenu(null); openCustomQrModal(invitation); }} style={{ width: "100%", padding: "8px 10px", border: "none", background: "transparent", textAlign: "left", color: "#0b1a3b", fontSize: 11, fontWeight: 600, cursor: "pointer", borderRadius: 7 }}>QR</button>
                                  <button type="button" onClick={() => openEditInvitation(invitation)} style={{ width: "100%", padding: "8px 10px", border: "none", background: "transparent", textAlign: "left", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer", borderRadius: 7 }}>Edit</button>
                                  <div style={{ height: 1, background: "rgba(1,63,153,0.08)", margin: "4px 0" }} />
                                  <button type="button" onClick={() => { setInvitationActionMenu(null); setRemoveInvitation(invitation); }} style={{ width: "100%", padding: "8px 10px", border: "none", background: "transparent", textAlign: "left", color: "#dc2626", fontSize: 11, fontWeight: 600, cursor: "pointer", borderRadius: 7 }}>Remove</button>
                                </div>
                              )}
                            </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>
)}
{editInvitation && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1350, padding: 20 }}>
    <div style={{ background: "#fff", borderRadius: 18, width: "95%", maxWidth: 460, padding: 26, boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#0b1a3b" }}>Edit Invitation</div>
        <button type="button" disabled={savingInvitationEdit} onClick={() => setEditInvitation(null)} style={{ border: "none", background: "none", fontSize: 20, color: "#64748b", cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 20 }}>Update the organization name or participant slots.</div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Organization / Group Name</label>
        <input type="text" value={editInvitationForm.organization_name} onChange={(e) => setEditInvitationForm((prev) => ({ ...prev, organization_name: e.target.value }))} style={{ ...inputStyle, marginTop: 6 }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={labelStyle}>Number of Slots</label>
        <input type="number" min={(editInvitation.event_invitation_participants || []).length || 1} value={editInvitationForm.participant_limit} onChange={(e) => setEditInvitationForm((prev) => ({ ...prev, participant_limit: e.target.value }))} style={{ ...inputStyle, marginTop: 6 }} />
        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>Currently registered: {(editInvitation.event_invitation_participants || []).length}. Slots cannot be lower than the registered participant count.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
        <button type="button" disabled={savingInvitationEdit} onClick={() => setEditInvitation(null)} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: savingInvitationEdit ? "not-allowed" : "pointer" }}>Cancel</button>
        <button type="button" disabled={savingInvitationEdit} onClick={handleSaveInvitationEdit} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: savingInvitationEdit ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: savingInvitationEdit ? "not-allowed" : "pointer" }}>{savingInvitationEdit ? "Saving..." : "Save Changes"}</button>
      </div>
    </div>
  </div>
)}
{removeInvitation && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 18, width: "95%", maxWidth: 430, padding: 26, boxSizing: "border-box" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0b1a3b", marginBottom: 8 }}>Remove Invitation?</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>Permanently remove <strong style={{ color: "#0b1a3b" }}>{removeInvitation.organization_name}</strong>? Registered participant records and uploaded Valid IDs for this invitation will also be removed.</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
              <button type="button" disabled={removingInvitation} onClick={() => setRemoveInvitation(null)} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: removingInvitation ? "not-allowed" : "pointer" }}>Cancel</button>
              <button type="button" disabled={removingInvitation} onClick={handleRemoveInvitation} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: removingInvitation ? "#94a3b8" : "#dc2626", color: "#fff", fontSize: 11, fontWeight: 600, cursor: removingInvitation ? "not-allowed" : "pointer" }}>{removingInvitation ? "Removing..." : "Remove"}</button>
            </div>
          </div>
        </div>
      )}
      {/* PARTICIPANT DETAILS MODAL */}
{participantModalOpen && participantInvitation && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: 20 }}>
    <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto", padding: 28, boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b" }}>{participantInvitation.organization_name}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Status: {participantInvitation.status} · Limit: {participantInvitation.participant_limit}</div>
        </div>
        <button onClick={() => { setParticipantModalOpen(false); setParticipantInvitation(null); }} style={{ border: "none", background: "none", fontSize: 20, color: "#64748b", cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, margin: "16px 0 20px" }} />
      {participantInvitation.status === "Declined" ? (
        <div style={{ padding: 16, background: "rgba(239,68,68,0.06)", borderRadius: 10, color: "#991b1b", fontSize: 12 }}>
          <strong>Decline Reason:</strong> {participantInvitation.decline_reason || "No reason provided."}
        </div>
      ) : (participantInvitation.event_invitation_participants || []).length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", background: "#f6fbfe", borderRadius: 12, color: "#94a3b8", fontSize: 12 }}>No participant details submitted yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(participantInvitation.event_invitation_participants || []).map((p, index) => (
            <div key={p.id} style={{ padding: 14, border: "1px solid rgba(1,63,153,0.1)", borderRadius: 12, background: "#fafdff" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1a3b", marginBottom: 8 }}>{index + 1}. {p.full_name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8, fontSize: 11, color: "#64748b" }}>
                <div><strong>Contact:</strong> {p.contact_number}</div>
                <div><strong>Air Travel:</strong> {p.requires_air_travel ? "Yes" : "No"}</div>
                {p.requires_air_travel && <div><strong>Birthdate:</strong> {p.birthdate || "—"}</div>}
              </div>
              {p.requires_air_travel && p.valid_id_url && (
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <button type="button" disabled={participantLoading} onClick={() => openValidId(p.valid_id_url)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#013F99", fontSize: 10, fontWeight: 600, cursor: participantLoading ? "not-allowed" : "pointer" }}>{participantLoading ? "Opening..." : "View Valid ID"}</button>
                  <button type="button" disabled={participantLoading} onClick={() => downloadValidId(p.valid_id_url, p.full_name)} style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: "#013F99", color: "#fff", fontSize: 10, fontWeight: 600, cursor: participantLoading ? "not-allowed" : "pointer" }}>{participantLoading ? "Please wait..." : "Download ID"}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
{/* CUSTOM INVITATION QR MODAL */}
{customQrModalOpen && selectedInvitation && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1100,
      padding: 20,
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        width: "95%",
        maxWidth: 420,
        padding: 28,
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0b1a3b",
            }}
          >
            {selectedInvitation.organization_name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              marginTop: 3,
            }}
          >
            Custom Invitation
          </div>
        </div>
<div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 18,
  }}
>
  <button
    type="button"
    onClick={() => {
      setCustomQrModalOpen(false);
      setSelectedInvitation(null);
      setCustomQrDataUrl(null);
    }}
    style={{
      flex: 1,
      padding: "11px",
      borderRadius: 10,
      border: "1px solid rgba(1,63,153,0.15)",
      background: "#fff",
      color: "#64748b",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    Close
  </button>
</div>
      </div>
      {/* ACCENT LINE */}
      <div
        style={{
          height: 3,
          background:
            "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)",
          borderRadius: 2,
          margin: "16px 0 22px",
        }}
      />
      {/* QR CODE */}
      <div
        style={{
          display: "inline-block",
          padding: 14,
          background: "#fff",
          border: "1px solid rgba(1,63,153,0.12)",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(1,63,153,0.08)",
        }}
      >
        {customQrDataUrl ? (
          <img
            src={customQrDataUrl}
            alt={`${selectedInvitation.organization_name} QR Code`}
            style={{
              width: 230,
              height: 230,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: 230,
              height: 230,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Generating QR...
          </div>
        )}
      </div>
      {/* ORGANIZATION */}
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#0b1a3b",
          marginTop: 18,
        }}
      >
        {selectedInvitation.organization_name}
      </div>
      {/* PARTICIPANT LIMIT */}
      <div
        style={{
          fontSize: 12,
          color: "#64748b",
          marginTop: 5,
        }}
      >
        Maximum of{" "}
        <strong style={{ color: "#013F99" }}>
          {selectedInvitation.participant_limit}{" "}
          {selectedInvitation.participant_limit === 1
            ? "participant"
            : "participants"}
        </strong>
      </div>
      <div
        style={{
          marginTop: 16,
          padding: "10px 12px",
          background: "#f6fbfe",
          borderRadius: 10,
          fontSize: 11,
          color: "#64748b",
          lineHeight: 1.6,
        }}
      >
        Scan this QR code to accept or decline the invitation.
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button type="button" onClick={handleCopyCustomInvitationLink} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.18)", background: "#fff", color: "#013F99", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Copy Link</button>
        <button type="button" onClick={handleDownloadCustomQr} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Download QR</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
