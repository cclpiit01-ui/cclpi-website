import { useState, useEffect, useRef } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import QRCode from "qrcode";

const CARD_BASE_URL = window.location.origin + "/card";

export default function CardManagement() {
  const [cards, setCards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create/Edit form
  const [formOpen, setFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [cardForm, setCardForm] = useState({});
  const [saving, setSaving] = useState(false);

  // QR modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCard, setQrCard] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const qrCanvasRef = useRef(null);

  useEffect(() => { fetchCards(); }, []);

  const fetchCards = async () => {
    setLoading(true);
    const { data: cardData, error: cardError } = await supabaseEmployees
      .from("employee_cards")
      .select("*, employees(id, full_name, job_position, picture, status)")
      .order("created_at", { ascending: false });
    if (cardError) console.error("Error fetching cards:", cardError);
    setCards(cardData || []);

    const { data: empData, error: empError } = await supabaseEmployees
      .from("employees")
      .select("id, full_name, job_position, picture, status")
      .order("full_name");
    if (empError) console.error("Error fetching employees:", empError);
    console.log("Fetched employees count:", empData?.length);
    setEmployees(empData || []);

    setLoading(false);
  };

  const slugify = (name, empId) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + empId;

  // ── FORM ─────────────────────────────
  const openCreateForm = () => {
    setEditingCard(null);
    setSelectedEmployee(null);
    setEmployeeSearch("");
    setCardForm({ phone: "", email: "", address: "", website: "www.cclpi.com.ph" });
    setFormOpen(true);
  };

  const openEditForm = (card) => {
    setEditingCard(card);
    setSelectedEmployee(card.employees);
    setEmployeeSearch(card.employees?.full_name || "");
    setCardForm({
      phone: card.phone || "",
      email: card.email || "",
      address: card.address || "",
      website: card.website || "www.cclpi.com.ph",
      is_active: card.is_active,
    });
    setFormOpen(true);
  };

  const availableEmployees = employees.filter(emp => {
    const alreadyHasCard = cards.some(c => c.employee_id === emp.id && (!editingCard || c.id !== editingCard.id));
    const matchesSearch = emp.full_name?.toLowerCase().includes(employeeSearch.toLowerCase()) || emp.id?.toLowerCase().includes(employeeSearch.toLowerCase());
    return !alreadyHasCard && matchesSearch;
  });

  const handleFormChange = (field, value) => setCardForm(prev => ({ ...prev, [field]: value }));

  const handleSaveCard = async () => {
    if (!selectedEmployee) {
      alert("Kailangan pumili ng employee.");
      return;
    }
    setSaving(true);
    try {
        const payload = {
        phone: cardForm.phone || null,
        email: cardForm.email || null,
        address: cardForm.address || null,
        website: cardForm.website || "www.cclpi.com.ph",
        is_active: cardForm.is_active !== false,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (editingCard) {
        ({ error } = await supabaseEmployees.from("employee_cards").update(payload).eq("id", editingCard.id));
      } else {
        payload.employee_id = selectedEmployee.id;
        payload.slug = slugify(selectedEmployee.full_name, selectedEmployee.id);
        ({ error } = await supabaseEmployees.from("employee_cards").insert(payload));
      }
      if (error) throw error;

      setFormOpen(false);
      await fetchCards();
    } catch (err) {
      alert("Error saving card: " + err.message);
    }
    setSaving(false);
  };

  const handleDeleteCard = async (card) => {
    if (!confirm(`Burahin ang digital card ni ${card.employees?.full_name}?`)) return;
    const { error } = await supabaseEmployees.from("employee_cards").delete().eq("id", card.id);
    if (error) { alert("Error deleting: " + error.message); return; }
    await fetchCards();
  };

  // ── QR CODE ─────────────────────────────
  const openQrModal = async (card) => {
    setQrCard(card);
    setQrModalOpen(true);
    const cardUrl = `${CARD_BASE_URL}/${card.slug}`;
    const dataUrl = await QRCode.toDataURL(cardUrl, { width: 400, margin: 1, color: { dark: "#013F99", light: "#FFFFFF" } });
    setQrDataUrl(dataUrl);
  };

  const handleCopyLink = () => {
    const cardUrl = `${CARD_BASE_URL}/${qrCard.slug}`;
    navigator.clipboard.writeText(cardUrl);
    alert("Na-copy na ang card link!");
  };

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.download = `${qrCard.employees?.full_name.replace(/\s+/g, "_")}_QR.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const filteredCards = cards.filter(c =>
    c.employees?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.employees?.job_position?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = { padding: "10px 14px", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 8, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif", width: "100%", boxSizing: "border-box", background: "#fafcff" };
  const fieldStyle = { display: "flex", flexDirection: "column", gap: 6 };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 };

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Digital Business Cards</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Tap-and-save NFC/QR calling cards para sa mga empleyado</p>
        </div>
        <button onClick={openCreateForm}
          style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Card
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ position: "relative", maxWidth: 320 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search by name or position..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 16px 10px 36px", border: "1px solid rgba(1,63,153,0.12)", borderRadius: 10, fontSize: 13, color: "#0b1a3b", outline: "none", fontFamily: "'Poppins', sans-serif" }} />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading cards...</div>
      ) : filteredCards.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 13, background: "#fff", borderRadius: 16, border: "1px solid rgba(1,63,153,0.08)" }}>Wala pang digital card. Click "Create Card" para makagawa ng una.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filteredCards.map(card => {
            const emp = card.employees;
            return (
              <div key={card.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(1,63,153,0.08)", padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  {emp?.picture ? (
                    <img src={emp.picture} alt={emp.full_name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(1,63,153,0.1)" }} />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #013F99, #4CB1E9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
                      {emp?.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0b1a3b" }}>{emp?.full_name || "—"}</div>
                    <div style={{ fontSize: 12, color: "#4CB1E9" }}>{emp?.job_position || "—"}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  <span style={{ padding: "3px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: card.is_active ? "rgba(34,197,94,0.1)" : "rgba(148,163,184,0.15)", color: card.is_active ? "#16a34a" : "#64748b" }}>{card.is_active ? "Active" : "Inactive"}</span>
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button onClick={() => openQrModal(card)} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>QR / Link</button>
                  <button onClick={() => openEditForm(card)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDeleteCard(card)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "#fff", color: "#dc2626", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {formOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 560, padding: 32, boxSizing: "border-box", margin: "20px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>{editingCard ? "Edit Card" : "Create Digital Card"}</h2>
              <button onClick={() => setFormOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, marginBottom: 24 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Employee picker */}
              <div style={{ ...fieldStyle, position: "relative" }}>
                <label style={labelStyle}>Employee</label>
                {editingCard ? (
                  <div style={{ ...inputStyle, background: "#e9eef5", display: "flex", alignItems: "center", gap: 8 }}>
                    {selectedEmployee?.full_name} — {selectedEmployee?.job_position}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={employeeSearch}
                      onChange={(e) => { setEmployeeSearch(e.target.value); setShowEmployeeDropdown(true); setSelectedEmployee(null); }}
                      onFocus={() => setShowEmployeeDropdown(true)}
                      placeholder="Search employee by name or ID..."
                      style={inputStyle}
                    />
                    {showEmployeeDropdown && employeeSearch && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid rgba(1,63,153,0.15)", borderRadius: 10, marginTop: 4, maxHeight: 220, overflowY: "auto", zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                        {availableEmployees.length === 0 ? (
                          <div style={{ padding: 14, fontSize: 12, color: "#94a3b8" }}>Walang nahanap na employee.</div>
                        ) : (
                          availableEmployees.slice(0, 8).map(emp => (
                            <div key={emp.id} onClick={() => { setSelectedEmployee(emp); setEmployeeSearch(emp.full_name); setShowEmployeeDropdown(false); }}
                              style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid rgba(1,63,153,0.05)" }}
                              onMouseEnter={e => e.currentTarget.style.background = "#f6fbfe"}
                              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                              <div style={{ fontWeight: 600, color: "#0b1a3b" }}>{emp.full_name}</div>
                              <div style={{ fontSize: 11, color: "#64748b" }}>{emp.id} · {emp.job_position || "—"}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Phone Number</label>
                <input type="text" value={cardForm.phone} onChange={(e) => handleFormChange("phone", e.target.value)} style={inputStyle} placeholder="e.g. 0917-123-4567" />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={cardForm.email} onChange={(e) => handleFormChange("email", e.target.value)} style={inputStyle} placeholder="e.g. juan.delacruz@cclpi.com.ph" />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Address</label>
                <input type="text" value={cardForm.address} onChange={(e) => handleFormChange("address", e.target.value)} style={inputStyle} />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Website</label>
                <input type="text" value={cardForm.website} onChange={(e) => handleFormChange("website", e.target.value)} style={inputStyle} />
              </div>

              {editingCard && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={cardForm.is_active !== false} onChange={(e) => handleFormChange("is_active", e.target.checked)} id="is_active" />
                  <label htmlFor="is_active" style={{ fontSize: 13, color: "#0b1a3b" }}>Active (visible sa public)</label>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(1,63,153,0.08)" }}>
              <button onClick={() => setFormOpen(false)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.15)", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveCard} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: saving ? "#94a3b8" : "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : editingCard ? "Save Changes" : "Create Card"}</button>
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrModalOpen && qrCard && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "95%", maxWidth: 380, padding: 24, boxSizing: "border-box", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0b1a3b", margin: 0 }}>{qrCard.employees?.full_name}'s Card</h2>
              <button onClick={() => setQrModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {qrDataUrl && <img src={qrDataUrl} alt="QR" style={{ width: "100%", maxWidth: 260, margin: "0 auto", borderRadius: 12, border: "1px solid rgba(1,63,153,0.08)" }} />}

            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 12, wordBreak: "break-all" }}>{CARD_BASE_URL}/{qrCard.slug}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={handleCopyLink} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Copy Link</button>
              <button onClick={handleDownloadQr} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Download QR</button>
            </div>
            <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 10 }}>I-program ang link na ito sa NFC card/sticker, o i-print ang QR code.</p>
          </div>
        </div>
      )}
    </div>
  );
}