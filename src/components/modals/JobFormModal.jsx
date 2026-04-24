import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JobFormModal({ job, onClose, refresh }) {
  const isEditing = !!job.id;

  const [formData, setFormData] = useState({
    position: job.position || "",
    area_assign: job.area_assign || "",
    status: job.status || "hiring",
    job_brief: job.job_brief || "",
    description: job.description || "",
    educational_requirements: Array.isArray(job.educational_requirements)
      ? job.educational_requirements.join(", ")
      : job.educational_requirements || "",
    competencies: Array.isArray(job.competencies)
      ? job.competencies.join(", ")
      : job.competencies || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const cleanArray = (str) =>
    str ? str.split(/[\n,]+/).map((s) => s.trim()).filter((s) => s !== "")
    : [];
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      position: formData.position,
      area_assign: formData.area_assign,
      status: formData.status,
      job_brief: formData.job_brief,
      description: formData.description,
      educational_requirements: cleanArray(formData.educational_requirements),
      competencies: cleanArray(formData.competencies),
    };

    let error;

    if (isEditing) {
      // UPDATE existing job
      ({ error } = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", job.id));
    } else {
      // INSERT new job
      ({ error } = await supabase
        .from("jobs")
        .insert(payload));
    }

    if (error) {
      setError(error.message);
    } else {
      refresh();
      onClose();
    }

    setIsSubmitting(false);
  };

  const inputClass =
    "w-full border border-slate-200 bg-slate-50 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition text-sm";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              {isEditing ? "✏️ Edit Job Listing" : "🚀 Post New Job"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing ? `Editing: ${job.position}` : "Fill in the details below"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Position Title</label>
              <input
                className={inputClass}
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Cashier"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Area Assignment</label>
              <input
                className={inputClass}
                name="area_assign"
                value={formData.area_assign}
                onChange={handleChange}
                placeholder="e.g. Bacolod City"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Job Brief</label>
            <textarea
              className={inputClass}
              name="job_brief"
              rows="2"
              value={formData.job_brief}
              onChange={handleChange}
              placeholder="Short summary of the role..."
            />
          </div>

          <div>
            <label className={labelClass}>Full Description</label>
            <textarea
              className={inputClass}
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed job description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Educational Requirements</label>
              <textarea
                className={inputClass}
                name="educational_requirements"
                rows="3"
                value={formData.educational_requirements}
                onChange={handleChange}
                placeholder="Degree in Business, High School Grad..."
              />
              <p className="text-[10px] text-slate-400 mt-1">Separate with commas</p>
            </div>
            <div>
              <label className={labelClass}>Competencies</label>
              <textarea
                className={inputClass}
                name="competencies"
                rows="3"
                value={formData.competencies}
                onChange={handleChange}
                placeholder="PC Literate, Customer Service..."
              />
              <p className="text-[10px] text-slate-400 mt-1">Separate with commas</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="hiring">Active Hiring</option>
              <option value="hired">Hired / Filled</option>
              <option value="closed">Closed / Internal</option>
            </select>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="job-form"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition text-sm shadow-lg shadow-blue-200"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Job" : "Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
}