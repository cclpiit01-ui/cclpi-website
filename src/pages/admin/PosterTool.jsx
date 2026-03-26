import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Type, ListChecks, GraduationCap, Image as ImageIcon } from 'lucide-react';
import JobPoster from '@/components/ui/JobPoster';


const PosterTool = () => {
  const posterRef = useRef(null);
  const [staffPhoto, setStaffPhoto] = useState(null);
  
  const [formData, setFormData] = useState({
    position: 'BILLING & COLLECTION ASSOCIATES',
    area: 'CAGAYAN DE ORO CITY',
    description: 'Responsible for billing processing, collection monitoring, and assisting clients with account concerns.',
    brief: 'Cosmopolitan CLIMBS Life Plan Inc (CCLPI Plans) is looking for someone to process and send Statements of Account (SOAs).',
    education: 'Graduate of a 4-year course.\nFinance or Business Administration.',
    competencies: 'Basic PC knowledge\nProficiency in MS Office\nAttention to detail',
  });

  const downloadPoster = async () => {
    if (!posterRef.current) return;
  
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High quality
        backgroundColor: '#0b3d91',
      });
  
      const link = document.createElement('a');
      link.download = `CCLPI-${formData.position}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert("Error sa pag-download. Siguraduhing lahat ng images ay nasa assets folder.");
    }
  };
  return (
    <div className="flex h-screen bg-[#0f172a] font-sans overflow-hidden text-slate-200">
      
      {/* LEFT SIDE: THE EDITOR PANEL */}
      <div className="w-[450px] flex flex-col border-r border-slate-800 bg-slate-900 shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-black text-yellow-400 tracking-tighter italic uppercase">Poster Dashboard</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">CCLPI Recruitment Tool</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-blue-900/50 pb-1">Header Details</h3>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">JOB POSITION</label>
              <input className="input-style uppercase" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value.toUpperCase()})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">AREA / LOCATION</label>
              <input className="input-style uppercase" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value.toUpperCase()})} />
            </div>
          </div>
          {/* Job Description - NEW FIELD */}
            <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Type size={12}/> Job Description (Paragraph)
            </label>
            <textarea 
                className="textarea-style h-24 whitespace-pre-wrap" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter job responsibilities here..."
            />
            </div>

          {/* Job Brief */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Type size={12}/> Job Brief / Intro (Wrap Text)
            </label>
            <textarea 
              className="textarea-style h-28 whitespace-pre-wrap" 
              value={formData.brief} 
              onChange={(e) => setFormData({...formData, brief: e.target.value})}
            />
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <ListChecks size={12}/> Competencies (1 per line)
              </label>
              <textarea className="textarea-style h-32 whitespace-pre-wrap" value={formData.competencies} onChange={(e) => setFormData({...formData, competencies: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap size={12}/> Educational Requirement
              </label>
              <textarea className="textarea-style h-20 whitespace-pre-wrap" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="pt-4">
            <input type="file" id="p-upload" className="hidden" onChange={(e) => setStaffPhoto(URL.createObjectURL(e.target.files[0]))} />
            <label htmlFor="p-upload" className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-yellow-500 hover:bg-yellow-500/5 transition-all text-sm font-bold">
              <ImageIcon size={18} className="text-slate-500" />
              UPLOAD STAFF PHOTO
            </label>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <button onClick={downloadPoster} className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95">
            <Download size={20} /> DOWNLOAD IMAGE
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: THE LIVE PREVIEW */}
      <div className="flex-1 bg-[#1e293b] flex items-center justify-center p-12 overflow-auto relative">
        <div className="scale-75 lg:scale-[0.85] xl:scale-100 transition-all duration-500 origin-center drop-shadow-[0_50px_50px_rgba(0,0,0,0.5)]">
          <JobPoster ref={posterRef} data={formData} staffPhoto={staffPhoto} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .input-style { width: 100%; background: #1e293b; border: 1px solid #334155; padding: 10px 14px; border-radius: 8px; font-size: 13px; outline: none; }
        .textarea-style { width: 100%; background: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 13px; outline: none; resize: none; line-height: 1.6; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default PosterTool;