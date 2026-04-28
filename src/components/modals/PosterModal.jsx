import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, X, Facebook, Image as ImageIcon } from "lucide-react";
import JobPoster from "@/components/ui/JobPoster";

export default function PosterModal({ job, onClose }) {
  const posterRef = useRef(null);
  const [staffPhoto, setStaffPhoto] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const posterData = {
    position: job.position || "",
    area: job.area_assign || "",
    description: job.description || "",
    brief: job.job_brief || "",
    education: Array.isArray(job.educational_requirements)
      ? job.educational_requirements.join("\n")
      : job.educational_requirements || "",
    competencies: Array.isArray(job.competencies)
      ? job.competencies.join("\n")
      : job.competencies || "",
  };

  // ✅ FIXED: Same download fix as PosterTool
  const exportPoster = async () => {
    if (!posterRef.current) return null;
    return await toPng(posterRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      width: 650,
      height: 840,
      style: {
        transform: "none",
        transformOrigin: "unset",
        margin: "0",
        padding: "0",
      },
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await exportPoster();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.download = `CCLPI-${job.position}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Error downloading poster.");
    }
    setIsDownloading(false);
  };

  const handleShareFacebook = async () => {
    setIsSharing(true);
    try {
      const dataUrl = await exportPoster();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.download = `CCLPI-${job.position}.png`;
      link.href = dataUrl;
      link.click();
      setTimeout(() => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
          "_blank",
          "width=600,height=400"
        );
      }, 500);
    } catch (err) {
      console.error("Share failed:", err);
    }
    setIsSharing(false);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: 20,
        width: "100%", maxWidth: 900,
        maxHeight: "92vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "0.5px solid rgba(0,0,0,0.08)",
      }}>

        {/* HEADER */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px",
          borderBottom: "0.5px solid #f2f2f7",
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1c1c1e", margin: 0, letterSpacing: -0.3 }}>
              Recruitment Poster
            </h2>
            <p style={{ fontSize: 12, color: "#8e8e93", margin: "2px 0 0" }}>
              {job.position} — {job.area_assign}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              border: "none", background: "#f2f2f7",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#636366", flexShrink: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#e5e5ea"}
            onMouseLeave={e => e.currentTarget.style.background = "#f2f2f7"}
          >
            <X size={15} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* LEFT: CONTROLS */}
          <div style={{
            width: 220, flexShrink: 0,
            borderRight: "0.5px solid #f2f2f7",
            display: "flex", flexDirection: "column",
            padding: 18, gap: 16,
            background: "#fafafa",
          }}>

            {/* STAFF PHOTO SECTION */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#8e8e93", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px" }}>
                Staff Photo
              </p>

              <input
                type="file"
                id="poster-photo-upload"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => setStaffPhoto(URL.createObjectURL(e.target.files[0]))}
              />

              {staffPhoto ? (
                <div style={{ position: "relative", marginBottom: 10 }}>
                  <img
                    src={staffPhoto}
                    alt="Preview"
                    style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.08)" }}
                  />
                  <label
                    htmlFor="poster-photo-upload"
                    style={{
                      position: "absolute", bottom: 8, right: 8,
                      background: "rgba(0,0,0,0.55)", color: "#fff",
                      fontSize: 11, fontWeight: 600, padding: "4px 10px",
                      borderRadius: 20, cursor: "pointer",
                    }}
                  >
                    Change
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="poster-photo-upload"
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "20px 12px",
                    border: "1.5px dashed rgba(0,0,0,0.12)",
                    borderRadius: 12, cursor: "pointer",
                    fontSize: 12, fontWeight: 500, color: "#8e8e93",
                    textAlign: "center", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#0b3d91"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"}
                >
                  <ImageIcon size={18} color="#8e8e93" />
                  Upload Staff Photo
                </label>
              )}
            </div>

            {/* SPACER */}
            <div style={{ flex: 1 }} />

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                style={{
                  width: "100%", padding: "11px",
                  background: isDownloading ? "#8e8e93" : "#0b3d91",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 13, fontWeight: 600, cursor: isDownloading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!isDownloading) e.currentTarget.style.background = "#0a3480"; }}
                onMouseLeave={e => { if (!isDownloading) e.currentTarget.style.background = "#0b3d91"; }}
              >
                <Download size={15} />
                {isDownloading ? "Saving…" : "Download"}
              </button>

              <button
                onClick={handleShareFacebook}
                disabled={isSharing}
                style={{
                  width: "100%", padding: "11px",
                  background: isSharing ? "#8e8e93" : "#1877F2",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 13, fontWeight: 600, cursor: isSharing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!isSharing) e.currentTarget.style.background = "#1464d4"; }}
                onMouseLeave={e => { if (!isSharing) e.currentTarget.style.background = "#1877F2"; }}
              >
                <Facebook size={15} />
                {isSharing ? "Opening…" : "Post to Facebook"}
              </button>

              <p style={{ fontSize: 10, color: "#8e8e93", textAlign: "center", margin: 0, lineHeight: 1.4 }}>
                Image will download first, then Facebook will open for you to upload it.
              </p>
            </div>
          </div>

          {/* RIGHT: POSTER PREVIEW */}
          <div style={{
              flex: 1, background: "#f2f2f7",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "flex-start",
              padding: "24px 32px",
              overflow: "auto",
            }}>
              <span style={{
                display: "inline-block", marginBottom: 18, flexShrink: 0,
                background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)",
                borderRadius: 20, padding: "4px 14px",
                fontSize: 11, fontWeight: 600, color: "#8e8e93",
                textTransform: "uppercase", letterSpacing: "0.5px",
              }}>
                Live Preview
              </span>

              {/* ✅ Wrapper na nag-re-reserve ng exact scaled space */}
              <div style={{
                width: 650 * 0.58,
                height: 840 * 0.58,
                flexShrink: 0,
                position: "relative",
              }}>
                <div style={{
                  transform: "scale(0.58)",
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0, left: 0,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                }}>
                  <JobPoster ref={posterRef} data={posterData} staffPhoto={staffPhoto} />
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}