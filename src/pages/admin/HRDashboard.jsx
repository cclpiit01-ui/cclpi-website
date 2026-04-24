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

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase();
    return (
      job.position?.toLowerCase().includes(search) ||
      job.area_assign?.toLowerCase().includes(search)
    );
  });

  const totalPersonnel = jobs.length;
  const pendingHirings = jobs.filter((j) => j.status === "hiring").length;

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job post?")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (!error) fetchJobs();
  };

  return (
    <div className="p-8 space-y-8 bg-brand-surface min-h-screen text-brand-primary">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-brand-primary">
            HRAD <span className="text-brand-secondary">Overview</span>
          </h1>
          <p className="text-brand-primary/60 text-sm font-medium">Manage and monitor recruitment pipeline</p>
        </div>
        <button
          onClick={() => setEditingJob({
            position: "",
            area_assign: "",
            status: "hiring",
            educational_requirements: [],
            competencies: [],
          })}
          className="bg-brand-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-primary/90 shadow-xl shadow-brand-primary/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Post New Job
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-brand-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <div className="w-16 h-16 bg-brand-primary rounded-full" />
          </div>
          <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-widest">Total Vacancies</p>
          <h2 className="text-5xl font-black text-brand-primary mt-1">{totalPersonnel}</h2>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-brand-secondary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <div className="w-16 h-16 bg-brand-secondary rounded-full" />
          </div>
          <p className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Active Hiring</p>
          <h2 className="text-5xl font-black text-brand-secondary mt-1">{pendingHirings}</h2>
        </div>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-brand-primary/5 overflow-hidden">
        {/* TABLE SEARCH BAR */}
        <div className="p-6 border-b border-brand-primary/5 bg-white/50 backdrop-blur-sm">
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-4 flex items-center text-brand-primary/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by position or area..."
              className="w-full pl-12 pr-4 py-3.5 bg-brand-surface border border-brand-primary/5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-secondary transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE BODY */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-brand-secondary border-t-transparent rounded-full mb-4"></div>
            <p className="text-brand-primary/40 font-bold uppercase tracking-widest text-xs">Syncing Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-black text-brand-primary/40 uppercase tracking-[0.15em] bg-brand-surface/50">
                  <th className="py-5 px-8">Position Title</th>
                  <th className="py-5 px-8">Assigned Area</th>
                  <th className="py-5 px-8 text-center">Status</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-brand-surface transition-colors">
                    <td className="py-5 px-8 font-bold text-brand-primary group-hover:text-brand-secondary transition-colors italic">
                      {job.position}
                    </td>
                    <td className="py-5 px-8 text-brand-primary/60 text-sm font-medium">
                      {job.area_assign}
                    </td>
                    <td className="py-5 px-8 text-center">
                      <span className={`inline-block text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tight shadow-sm ${
                        job.status === "hiring"
                          ? "bg-brand-accent text-brand-primary"
                          : "bg-brand-primary/10 text-brand-primary/40"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setPosterJob(job)}
                          className="p-2 hover:bg-brand-accent/20 rounded-xl transition-colors text-brand-accent"
                          title="Generate Poster"
                        >
                          🎨
                        </button>
                        <button
                          onClick={() => setEditingJob(job)}
                          className="px-4 py-1.5 text-xs font-black bg-brand-secondary/10 text-brand-secondary rounded-lg hover:bg-brand-secondary hover:text-white transition-all"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="px-4 py-1.5 text-xs font-black text-red-300 hover:text-red-500 transition-colors"
                        >
                          DEL
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