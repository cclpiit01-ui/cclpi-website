import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const buttonStyle = { padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 12, fontWeight: 600, cursor: "pointer" };

export default function EventCardOptions({ event, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const deletingRef = useRef(false);

  useEffect(() => {
    if (!menuOpen) return;
    const outside = e => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [menuOpen]);

  const changeConfirmation = open => {
    if (deletingRef.current) return;
    setConfirmOpen(open);
    setConfirmation("");
  };
  const submitDelete = async e => {
    e.preventDefault();
    if (deletingRef.current || confirmation !== event.title) return;
    deletingRef.current = true;
    setDeleting(true);
    try {
      const deleted = await onDelete(event, confirmation);
      if (deleted) { setConfirmOpen(false); setConfirmation(""); }
    } finally { deletingRef.current = false; setDeleting(false); }
  };

  return (
    <Dialog.Root open={confirmOpen} onOpenChange={changeConfirmation}>
      <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setMenuOpen(false); }} onKeyDown={e => {
        if (e.key === "Escape") { setMenuOpen(false); triggerRef.current?.focus(); }
      }}>
        <button className="event-card-action event-card-action--more" ref={triggerRef} type="button" aria-label={`More options for ${event.title}`} aria-expanded={menuOpen} aria-controls={`event-options-${event.id}`} onClick={() => setMenuOpen(previous => !previous)} style={{ padding: 0, borderRadius: 8, borderWidth: 1, borderStyle: "solid", fontWeight: 600, cursor: "pointer", width: 40, minHeight: 40, fontSize: 24, lineHeight: 1 }}>⋯</button>
        {menuOpen && <div id={`event-options-${event.id}`} role="group" aria-label="Event options" style={{ position: "absolute", right: 0, bottom: "calc(100% + 6px)", width: 170, padding: 6, border: "1px solid rgba(1,63,153,0.15)", borderRadius: 10, background: "#fff", boxShadow: "0 6px 24px rgba(1,63,153,0.15)", zIndex: 10 }}>
          <button type="button" style={{ ...buttonStyle, width: "100%", textAlign: "left", border: "none", minHeight: 44 }} onClick={() => { setMenuOpen(false); onEdit(event); }}>Edit Event</button>
          <button type="button" style={{ ...buttonStyle, width: "100%", textAlign: "left", border: "none", minHeight: 44, color: "#dc2626" }} onClick={() => { setMenuOpen(false); changeConfirmation(true); }}>Delete Event</button>
        </div>}
      </div>
      <Dialog.Portal>
        <Dialog.Overlay style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1200 }} />
        <Dialog.Content onCloseAutoFocus={e => { e.preventDefault(); triggerRef.current?.focus(); }} onEscapeKeyDown={e => { if (deletingRef.current) e.preventDefault(); }} onPointerDownOutside={e => { if (deletingRef.current) e.preventDefault(); }} style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "calc(100vw - 32px)", maxWidth: 520, maxHeight: "calc(100dvh - 32px)", overflowY: "auto", boxSizing: "border-box", padding: 24, borderRadius: 18, background: "#fff", zIndex: 1201, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: "'Poppins', sans-serif", color: "#0b1a3b" }}>
          <Dialog.Title style={{ margin: 0, fontSize: 20, fontFamily: "'Montserrat', sans-serif" }}>Delete Event</Dialog.Title>
          <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", borderRadius: 2, margin: "14px 0 20px" }} />
          <Dialog.Description style={{ padding: 14, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, color: "#991b1b", fontSize: 13, lineHeight: 1.7 }}>Deleting this event is permanent. Associated invitations, participants, RSVP responses, and sponsorship records may also be permanently deleted under the existing database rules. Review any records you need to keep before continuing. This action cannot be undone.</Dialog.Description>
          <form onSubmit={submitDelete}>
            <p style={{ fontSize: 13, overflowWrap: "anywhere" }}>To confirm, type the exact event name: <strong style={{ display: "block", marginTop: 8 }}>{event.title}</strong></p>
            <label htmlFor={`delete-event-name-${event.id}`} style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Event name (case-sensitive)</label>
            <input id={`delete-event-name-${event.id}`} autoComplete="off" spellCheck={false} value={confirmation} disabled={deleting} onChange={e => setConfirmation(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid rgba(1,63,153,0.25)", borderRadius: 8, fontSize: 14 }} />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button type="button" disabled={deleting} onClick={() => changeConfirmation(false)} style={buttonStyle}>Cancel</button>
              <button type="submit" disabled={deleting || confirmation !== event.title} style={{ ...buttonStyle, border: "none", background: deleting || confirmation !== event.title ? "#e2e8f0" : "#dc2626", color: deleting || confirmation !== event.title ? "#64748b" : "#fff", cursor: deleting || confirmation !== event.title ? "not-allowed" : "pointer" }}>{deleting ? "Deleting..." : "Delete Event"}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
