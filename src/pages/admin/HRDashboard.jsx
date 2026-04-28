// src/pages/admin/HRDashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import JobFormModal from "@/components/modals/JobFormModal";
import PosterModal from "@/components/modals/PosterModal";

export default function HRDashboard() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [posterJob, setPosterJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching jobs:", error);
    else setJobs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase();
    return (
      job.position?.toLowerCase().includes(search) ||
      job.area_assign?.toLowerCase().includes(search)
    );
  });

  const totalPersonnel = jobs.length;
  const activeHiring = jobs.filter((j) => j.status === "hiring").length;

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job post?")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (!error) fetchJobs();
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] p-7 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display',sans-serif]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#1c1c1e]">
            HRAD <span className="text-[#0b3d91]">Overview</span>
          </h1>
          <p className="text-[13px] text-[#8e8e93] mt-0.5">Recruitment pipeline</p>
        </div>
        <button
          onClick={() => setEditingJob({
            position: "",
            area_assign: "",
            status: "hiring",
            educational_requirements: [],
            competencies: [],
          })}
          className="flex items-center gap-2 bg-[#0b3d91] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a3480] transition-colors active:scale-95"
        >
          <span className="text-lg leading-none">+</span> Post New Job
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        <div className="bg-white rounded-[18px] border border-black/[0.07] px-5 py-5">
          <p className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.6px] mb-1.5">
            Total Vacancies
          </p>
          <p className="text-[40px] font-bold leading-none tracking-[-2px] text-[#1c1c1e]">
            {totalPersonnel}
          </p>
          <p className="text-[12px] text-[#8e8e93] mt-1.5">All job posts</p>
        </div>
        <div className="bg-white rounded-[18px] border border-black/[0.07] px-5 py-5">
          <p className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.6px] mb-1.5">
            Active Hiring
          </p>
          <p className="text-[40px] font-bold leading-none tracking-[-2px] text-[#30d158]">
            {activeHiring}
          </p>
          <p className="text-[12px] text-[#8e8e93] mt-1.5">Open positions</p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-[20px] border border-black/[0.07] overflow-hidden">

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#f2f2f7]">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#8e8e93]"
              viewBox="0 0 20 20" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round"
            >
              <circle cx="9" cy="9" r="6" />
              <line x1="13.5" y1="13.5" x2="18" y2="18" />
            </svg>
            <input
              type="text"
              placeholder="Search position or area…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f2f2f7] text-[14px] text-[#1c1c1e] placeholder:text-[#8e8e93] rounded-[10px] pl-9 pr-4 py-2.5 outline-none border-none"
            />
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-7 h-7 border-2 border-[#0b3d91] border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] text-[#8e8e93]">Loading jobs…</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 text-[14px] text-[#8e8e93]">
            No jobs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f9f9fb]">
                  <th className="py-3 px-5 text-left text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.5px]">Position</th>
                  <th className="py-3 px-5 text-left text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.5px]">Area</th>
                  <th className="py-3 px-5 text-left text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.5px]">Status</th>
                  <th className="py-3 px-5 text-right text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.5px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-t border-[#f2f2f7] hover:bg-[#f9f9fb] transition-colors"
                  >
                    <td className="py-4 px-5 text-[14px] font-semibold text-[#1c1c1e]">
                      {job.position}
                    </td>
                    <td className="py-4 px-5 text-[13px] text-[#636366]">
                      {job.area_assign}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2px] ${
                        job.status === "hiring"
                          ? "bg-[#d1f2e0] text-[#1a7a3c]"
                          : "bg-[#f2f2f7] text-[#8e8e93]"
                      }`}>
                        {job.status === "hiring" ? "Hiring" : "Hired"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPosterJob(job)}
                          className="bg-[#eef2ff] text-[#0b3d91] text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#dce6ff] transition-colors"
                        >
                          Poster
                        </button>
                        <button
                          onClick={() => setEditingJob(job)}
                          className="bg-[#f2f2f7] text-[#3a3a3c] text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#e5e5ea] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-[#ff3b30] text-[12px] font-semibold px-2 py-1.5 rounded-lg hover:bg-[#fff0ef] transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALS */}
      {editingJob && (
        <JobFormModal job={editingJob} onClose={() => setEditingJob(null)} refresh={fetchJobs} />
      )}
      {posterJob && (
        <PosterModal job={posterJob} onClose={() => setPosterJob(null)} />
      )}
    </div>
  );
}