import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, X, Facebook, Image as ImageIcon } from "lucide-react";
import JobPoster from "@/components/ui/JobPoster";

export default function PosterModal({ job, onClose }) {
  const posterRef = useRef(null);
  const [staffPhoto, setStaffPhoto] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Convert job data from Supabase format → PosterTool formData format
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

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#0b3d91",
      });
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
    if (!posterRef.current) return;
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#0b3d91",
      });

      // Download the image first (Facebook sharing requires manual upload)
      const link = document.createElement("a");
      link.download = `CCLPI-${job.position}.png`;
      link.href = dataUrl;
      link.click();

      // Then open Facebook share dialog
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
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f172a] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-yellow-400 uppercase tracking-tight">
              🎨 Recruitment Poster
            </h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              {job.position} — {job.area_assign}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white hover:bg-slate-700 w-9 h-9 rounded-full flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT: Controls */}
          <div className="w-56 flex flex-col gap-4 p-5 border-r border-slate-800 bg-slate-900">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Staff Photo
            </p>
            <input
              type="file"
              id="poster-photo-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                setStaffPhoto(URL.createObjectURL(e.target.files[0]))
              }
            />
            <label
              htmlFor="poster-photo-upload"
              className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-yellow-500 hover:bg-yellow-500/5 transition-all text-xs font-bold text-slate-400 text-center"
            >
              <ImageIcon size={20} className="text-slate-500" />
              {staffPhoto ? "Change Photo" : "Upload Staff Photo"}
            </label>

            {staffPhoto && (
              <img
                src={staffPhoto}
                alt="Preview"
                className="w-full h-28 object-cover rounded-xl border border-slate-700"
              />
            )}

            <div className="mt-auto space-y-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-800 text-slate-900 font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition active:scale-95"
              >
                <Download size={16} />
                {isDownloading ? "Saving..." : "Download"}
              </button>

              <button
                onClick={handleShareFacebook}
                className="w-full bg-[#1877F2] hover:bg-[#1464d4] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition active:scale-95"
              >
                <Facebook size={16} />
                Post to Facebook
              </button>
              <p className="text-[9px] text-slate-600 text-center leading-tight">
                Image will download first, then Facebook will open for you to upload it.
              </p>
            </div>
          </div>

          {/* RIGHT: Poster Preview */}
          <div className="flex-1 bg-[#1e293b] flex items-center justify-center p-8 overflow-auto">
            <div className="scale-[0.65] origin-center drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]">
              <JobPoster ref={posterRef} data={posterData} staffPhoto={staffPhoto} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
