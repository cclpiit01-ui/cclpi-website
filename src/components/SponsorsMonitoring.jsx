import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import { SPONSOR_LOGO_BUCKET, validateSponsorLogo, createSponsorLogoPath, describeSponsorError } from "@/lib/sponsorLogoUpload";

const inputStyle = { width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1px solid rgba(1,63,153,0.2)", borderRadius: 8, fontSize: 13 };
const buttonStyle = { padding: "9px 14px", borderRadius: 8, border: "1px solid rgba(1,63,153,0.2)", background: "#fff", color: "#013F99", fontSize: 12, fontWeight: 600, cursor: "pointer" };
const primaryStyle = { ...buttonStyle, background: "linear-gradient(90deg, #013F99, #4CB1E9)", color: "#fff", border: "none" };
const emptyForm = () => ({ sponsor_name: "", sponsorship_type: "Cash", amount: "", item_description: "", quantity: "", estimated_value: "", logo_url: "" });
const money = value => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value) || 0);
const sponsorType = row => String(row.sponsorship_type || "Cash").toLowerCase().replace(/[-_ ]/g, "") === "inkind" ? "In-Kind" : "Cash";
const logoPath = value => {
  if (!value) return "";
  if (!/^https?:\/\//i.test(value)) return value.replace(/^sponsor-logos\//, "");
  try {
    const path = new URL(value).pathname;
    const marker = "/sponsor-logos/";
    return path.includes(marker) ? decodeURIComponent(path.slice(path.indexOf(marker) + marker.length)) : "";
  } catch { return ""; }
};

// Resolve private bucket paths without making sponsor-logos public.
function SponsorLogo({ value, name, large = false, onPreview }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let active = true;
    let timer;
    const resolve = async () => {
      const path = logoPath(value);
      if (!path) { if (active) setUrl(""); return; }
      const { data, error } = await supabaseEmployees.storage.from(SPONSOR_LOGO_BUCKET).createSignedUrl(path, 3600);
      if (active) {
        setUrl(error ? "" : data.signedUrl);
        timer = setTimeout(resolve, 50 * 60 * 1000);
      }
    };
    resolve();
    return () => { active = false; clearTimeout(timer); };
  }, [value]);
  if (!value) return <span style={{ color: "#94a3b8" }}>No logo</span>;
  if (!url) return <span style={{ color: "#94a3b8" }}>Logo unavailable</span>;
  const image = <img src={url} alt={`${name} logo`} style={{ maxWidth: large ? "100%" : 64, height: large ? "auto" : 48, maxHeight: large ? "65vh" : 48, objectFit: "contain" }} />;
  return onPreview ? <button type="button" style={{ ...buttonStyle, padding: 4 }} onClick={onPreview} aria-label={`Preview ${name} logo`}>{image}</button> : image;
}

export default function SponsorsMonitoring({ event, onClose, showToast }) {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [preview, setPreview] = useState(null);
  const dialogRef = useRef(null);
  const operationRef = useRef(false);
  const formOpen = !!form;
  const deleteOpen = !!deleting;
  const previewOpen = !!preview;

  useEffect(() => {
    dialogRef.current?.focus();
  }, [formOpen, deleteOpen, previewOpen]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        // Page through results so totals and exports include more than the API row limit.
        const rows = [];
        for (let start = 0; ; start += 500) {
          const { data, error } = await supabaseEmployees.from("event_sponsors").select("*").eq("event_id", event.id).order("created_at", { ascending: false }).order("id").range(start, start + 499);
          if (error) throw error;
          rows.push(...data);
          if (data.length < 500) break;
        }
        if (active) setSponsors(rows);
      } catch (error) {
        if (active) { setLoadError(error.message); showToast("Unable to load sponsors: " + error.message, "error"); }
      } finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
    // Event identity is fixed by the parent's key; Toast updates must not reload data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  useEffect(() => {
    if (!file) { setFilePreview(""); return; }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);

  const closeForm = () => { setForm(null); setEditing(null); setFile(null); setSaveError(""); };
  const openForm = sponsor => {
    setEditing(sponsor || null);
    setSaveError("");
    setFile(null);
    setForm(sponsor ? { ...sponsor, sponsorship_type: sponsorType(sponsor) } : emptyForm());
  };
  const chooseFile = e => {
    const selected = e.target.files?.[0];
    setSaveError("");
    if (!selected) { setFile(null); return; }
    try {
      validateSponsorLogo(selected);
      setFile(selected);
    } catch (error) {
      e.target.value = "";
      setFile(null);
      showToast(error.message, "warning");
    }
  };
  const removeLogo = async value => {
    const path = logoPath(value);
    // Only remove files owned by this event, never arbitrary legacy paths.
    if (!path?.startsWith(`${event.id}/`)) return;
    const { error } = await supabaseEmployees.storage.from(SPONSOR_LOGO_BUCKET).remove([path]);
    if (error) showToast("Logo cleanup failed: " + describeSponsorError(error), "warning");
  };
  const save = async e => {
    e.preventDefault();
    if (operationRef.current) return;
    const cash = form.sponsorship_type === "Cash";
    const value = cash ? form.amount : form.estimated_value;
    if (!form.sponsor_name.trim() || value === "" || value == null || !Number.isFinite(Number(value)) || Number(value) < 0 || (!cash && (!form.item_description?.trim() || !Number.isSafeInteger(Number(form.quantity)) || Number(form.quantity) < 1))) {
      showToast("Enter a sponsor name, a non-negative value, and for In-Kind a description and positive whole quantity.", "warning");
      return;
    }
    operationRef.current = true;
    setBusy(true);
    setSaveError("");
    let uploadedPath = "";
    let committed = false;
    let stage = "checking your session";
    try {
      const { data: sessionData, error: sessionError } = await supabaseEmployees.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("Your session has expired. Sign in again before saving a sponsor.");
      let logo = form.logo_url || null;
      if (file) {
        stage = "uploading the logo to sponsor-logos";
        // Revalidate at upload time and derive the extension from the MIME type,
        // never from user-supplied filenames. No leading slash or bucket prefix.
        uploadedPath = createSponsorLogoPath(event.id, file);
        const { data: uploadData, error } = await supabaseEmployees.storage.from(SPONSOR_LOGO_BUCKET).upload(uploadedPath, file, { upsert: false, contentType: file.type });
        if (error) { uploadedPath = ""; throw error; }
        if (!uploadData?.path) throw new Error("Storage did not return the uploaded logo path.");
        logo = uploadData.path;
      }
      const payload = { event_id: event.id, sponsor_name: form.sponsor_name.trim(), sponsorship_type: form.sponsorship_type, amount: cash ? Number(form.amount) : null, item_description: cash ? null : form.item_description.trim(), quantity: cash ? null : Number(form.quantity), estimated_value: cash ? null : Number(form.estimated_value), logo_url: logo, updated_at: new Date().toISOString() };
      stage = editing ? "updating event_sponsors" : "adding to event_sponsors";
      const query = editing
        ? supabaseEmployees.from("event_sponsors").update(payload).eq("id", editing.id).eq("event_id", event.id)
        : supabaseEmployees.from("event_sponsors").insert(payload);
      const { data, error } = await query.select().single();
      if (error) throw error;
      committed = true;
      setSponsors(previous => editing ? previous.map(row => row.id === editing.id ? data : row) : [data, ...previous]);
      closeForm();
      showToast(editing ? "Sponsor updated successfully." : "Sponsor added successfully.");
      if (editing?.logo_url && editing.logo_url !== logo) await removeLogo(editing.logo_url);
    } catch (error) {
      const policyDenied = error.code === "42501" || /row.level security/i.test(error.message);
      const message = `Unable to save sponsor while ${stage}: ${describeSponsorError(error)}${policyDenied ? ". Verify the employees project's policies and your role's Events page access." : ""}`;
      setSaveError(message);
      showToast(message, "error");
      if (uploadedPath && !committed) await removeLogo(uploadedPath);
    } finally { operationRef.current = false; setBusy(false); }
  };
  const remove = async () => {
    if (operationRef.current) return;
    operationRef.current = true;
    setBusy(true);
    try {
      const { data, error } = await supabaseEmployees.from("event_sponsors").delete().eq("id", deleting.id).eq("event_id", event.id).select("id").single();
      if (error || !data) throw error || new Error("Sponsor was not deleted. Check access permissions.");
      setSponsors(previous => previous.filter(row => row.id !== deleting.id));
      setDeleting(null);
      showToast("Sponsor deleted successfully.");
      if (deleting.logo_url) await removeLogo(deleting.logo_url);
    } catch (error) { showToast("Unable to delete sponsor: " + error.message, "error"); }
    finally { operationRef.current = false; setBusy(false); }
  };
  const filtered = sponsors.filter(row => (filter === "All" || sponsorType(row) === filter) && `${row.sponsor_name} ${row.item_description || ""}`.toLowerCase().includes(search.trim().toLowerCase()));
  const cashTotal = sponsors.filter(row => sponsorType(row) === "Cash").reduce((total, row) => total + (Number(row.amount) || 0), 0);
  const kindTotal = sponsors.filter(row => sponsorType(row) === "In-Kind").reduce((total, row) => total + (Number(row.estimated_value) || 0), 0);
  const exportExcel = () => {
    try {
      const rows = filtered.map(row => ({ "Sponsor Name": row.sponsor_name, "Sponsorship Type": sponsorType(row), "Cash Amount (PHP)": sponsorType(row) === "Cash" ? Number(row.amount) || 0 : "", "Item Description": row.item_description || "", Quantity: row.quantity ?? "", "Estimated Total Value (PHP)": sponsorType(row) === "In-Kind" ? Number(row.estimated_value) || 0 : "", "Logo Storage Path": logoPath(row.logo_url), "Created At": row.created_at, "Updated At": row.updated_at }));
      const sheet = XLSX.utils.json_to_sheet(rows);
      sheet["!cols"] = [30, 20, 22, 40, 12, 30, 50, 26, 26].map(wch => ({ wch }));
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, "Sponsors");
      const title = event.title.replace(/[^a-z0-9_-]/gi, "_").slice(0, 60);
      XLSX.writeFile(book, `CCLPI_Sponsors_${title}_${filter}_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showToast("Sponsors exported successfully.");
    } catch (error) { showToast("Unable to export sponsors: " + error.message, "error"); }
  };
  const keyDown = e => {
    if (e.key === "Escape" && !busy) {
      e.stopPropagation();
      if (preview) setPreview(null);
      else if (deleting) setDeleting(null);
      else if (form) closeForm();
      else onClose();
    }
    if (e.key === "Tab") {
      const nodes = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')];
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  };
  const field = (label, name, props = {}) => <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#0b1a3b", fontWeight: 600 }}>{label}<input {...props} style={inputStyle} value={form[name] ?? ""} onChange={e => setForm(previous => ({ ...previous, [name]: e.target.value }))} /></label>;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, padding: 20, overflowY: "auto" }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="sponsors-title" tabIndex={-1} onKeyDown={keyDown} style={{ background: "#fff", borderRadius: 20, maxWidth: 1200, margin: "20px auto", padding: 24, color: "#0b1a3b", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div><h2 id="sponsors-title" style={{ fontSize: 20, margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Sponsors Monitoring</h2><p style={{ margin: "6px 0", fontSize: 13, color: "#64748b" }}>{event.title}</p></div>
          <button style={buttonStyle} disabled={busy} onClick={onClose} aria-label="Close Sponsors Monitoring">Close</button>
        </div>
        <div style={{ height: 3, background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)", margin: "14px 0 20px", borderRadius: 2 }} />
        {loading ? <p role="status">Loading sponsors...</p> : loadError ? <p role="alert" style={{ color: "#dc2626" }}>Unable to load sponsors: {loadError}. Close and reopen to retry.</p> : <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {[["Total Sponsors", sponsors.length], ["Total Cash Sponsorship", money(cashTotal)], ["Total In-Kind Value", money(kindTotal)], ["Combined Sponsorship Value", money(cashTotal + kindTotal)]].map(([label, value]) => <div key={label} style={{ padding: 16, background: "#f0f7ff", border: "1px solid rgba(1,63,153,0.1)", borderRadius: 12 }}><div style={{ fontSize: 11, color: "#64748b" }}>{label}</div><div style={{ fontSize: 21, fontWeight: 700, color: "#013F99", marginTop: 6 }}>{value}</div></div>)}
          </div>
          <p style={{ fontSize: 11, color: "#64748b" }}>Totals cover all sponsors for this event. Search and filters apply to the list and Excel export.</p>
          {!form && !deleting && !preview && <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "20px 0" }}>
              <input aria-label="Search sponsors" placeholder="Search sponsor or item..." style={{ ...inputStyle, flex: "1 1 220px" }} value={search} onChange={e => setSearch(e.target.value)} />
              <select aria-label="Filter sponsorship type" style={{ ...inputStyle, width: "auto" }} value={filter} onChange={e => setFilter(e.target.value)}>{["All", "Cash", "In-Kind"].map(type => <option key={type} value={type}>{type === "All" ? "All Types" : type}</option>)}</select>
              <button style={buttonStyle} disabled={!filtered.length || busy} onClick={exportExcel}>Export Excel</button>
              <button style={primaryStyle} disabled={busy} onClick={() => openForm(null)}>+ Add Sponsor</button>
            </div>
            <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
              <thead style={{ background: "#f0f7ff", color: "#013F99" }}><tr>{["Logo", "Sponsor", "Type", "Item Description", "Quantity", "Cash Amount", "In-Kind Value", "Actions"].map(label => <th key={label} style={{ padding: 12 }}>{label}</th>)}</tr></thead>
              <tbody>{filtered.map(row => <tr key={row.id} style={{ borderBottom: "1px solid #e9eef5" }}>
                <td style={{ padding: 10 }}><SponsorLogo value={row.logo_url} name={row.sponsor_name} onPreview={() => setPreview(row)} /></td>
                <td style={{ padding: 10, fontWeight: 600 }}>{row.sponsor_name}</td><td style={{ padding: 10 }}>{sponsorType(row)}</td>
                <td style={{ padding: 10 }}>{sponsorType(row) === "In-Kind" ? row.item_description : "—"}</td><td style={{ padding: 10 }}>{sponsorType(row) === "In-Kind" ? row.quantity : "—"}</td>
                <td style={{ padding: 10 }}>{sponsorType(row) === "Cash" ? money(row.amount) : "—"}</td><td style={{ padding: 10 }}>{sponsorType(row) === "In-Kind" ? money(row.estimated_value) : "—"}</td>
                <td style={{ padding: 10 }}><div style={{ display: "flex", gap: 6 }}><button style={buttonStyle} disabled={busy} onClick={() => openForm(row)}>Edit</button><button style={{ ...buttonStyle, color: "#dc2626" }} disabled={busy} onClick={() => setDeleting(row)}>Delete</button></div></td>
              </tr>)}</tbody>
            </table>{!filtered.length && <p style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>{sponsors.length ? "No sponsors match your search and filter." : "No sponsors yet. Add the first sponsor for this event."}</p>}</div>
            <p style={{ fontSize: 11, color: "#64748b" }}>Showing {filtered.length} of {sponsors.length} sponsors</p>
          </>}
          {form && <form onSubmit={save} style={{ marginTop: 20, background: "#f6fbfe", border: "1px solid #e9eef5", borderRadius: 12, padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>{editing ? "Edit Sponsor" : "Add Sponsor"}</h3>
            {saveError && <p role="alert" style={{ padding: 12, borderRadius: 8, background: "#fff5f5", color: "#dc2626", fontSize: 12, overflowWrap: "anywhere" }}>{saveError}</p>}
            <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: 16 }}>
              {field("Sponsor Name", "sponsor_name", { required: true, maxLength: 250 })}
              <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>Sponsorship Type<select style={inputStyle} value={form.sponsorship_type} onChange={e => setForm(previous => ({ ...previous, sponsorship_type: e.target.value }))}><option>Cash</option><option>In-Kind</option></select></label>
              {form.sponsorship_type === "Cash" ? field("Amount (PHP)", "amount", { type: "number", min: 0, step: "0.01", required: true }) : <>
                {field("Item Description", "item_description", { required: true, maxLength: 2000 })}
                {field("Quantity", "quantity", { type: "number", min: 1, step: 1, required: true })}
                {field("Estimated Total Value (PHP)", "estimated_value", { type: "number", min: 0, step: "0.01", required: true })}
                <small style={{ color: "#64748b" }}>Enter the total value for all items; this is not multiplied by quantity.</small>
              </>}
              <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>Logo (optional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseFile} style={inputStyle} /><small style={{ color: "#64748b" }}>PNG, JPG, or WEBP, maximum 5 MB. Leave empty to keep the existing logo.</small></label>
              {filePreview ? <img src={filePreview} alt="Selected sponsor logo preview" style={{ maxWidth: 220, maxHeight: 140, objectFit: "contain" }} /> : form.logo_url && <SponsorLogo value={form.logo_url} name={form.sponsor_name} />}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><button type="button" style={buttonStyle} onClick={closeForm}>Cancel</button><button type="submit" style={primaryStyle}>{busy ? "Saving..." : "Save Sponsor"}</button></div>
            </fieldset>
          </form>}
          {deleting && <div role="alert" style={{ padding: 24, marginTop: 20, borderRadius: 12, background: "#fff5f5" }}><h3>Delete sponsor?</h3><p>Remove {deleting.sponsor_name} and its logo from this event?</p><div style={{ display: "flex", gap: 10 }}><button style={buttonStyle} disabled={busy} onClick={() => setDeleting(null)}>Cancel</button><button style={{ ...primaryStyle, background: "#dc2626" }} disabled={busy} onClick={remove}>{busy ? "Deleting..." : "Delete Sponsor"}</button></div></div>}
          {preview && <div style={{ textAlign: "center", marginTop: 20 }}><h3>{preview.sponsor_name}</h3><SponsorLogo value={preview.logo_url} name={preview.sponsor_name} large /><div style={{ marginTop: 16 }}><button style={buttonStyle} onClick={() => setPreview(null)}>Back to Sponsors</button></div></div>}
        </>}
      </div>
    </div>
  );
}
