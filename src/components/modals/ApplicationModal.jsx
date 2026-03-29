import React, { useState, useEffect } from 'react';
import { X, FileText, Paperclip, CheckCircle2, Send, PartyPopper } from 'lucide-react';
import { supabase } from "@/lib/supabase";

export const ApplicationModal = ({ isOpen, onClose, jobTitle, area }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state para sa success message
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  // Lock scroll kapag bukas ang modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Reset state kapag sinara ang modal
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedFiles([]);
        setFormData({ fullName: '', email: '', phone: '' });
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type === 'application/pdf');
    setSelectedFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please upload at least one PDF file (Resume/Credentials).");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedPaths = [];

      for (const file of selectedFiles) {
        const folderName = formData.fullName.replace(/\s+/g, '_').toLowerCase();
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${folderName}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('job-applications')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        uploadedPaths.push(filePath);
      }

      const { error: dbError } = await supabase
        .from('applicants')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            job_title: jobTitle,
            file_paths: uploadedPaths,
            status: 'pending'
          }
        ]);

      if (dbError) throw dbError;

      // Imbes na alert, i-set natin ang success state
      setIsSuccess(true);

    } catch (error) {
      console.error("Submission Error:", error.message);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-brand-primary p-8 text-white relative shrink-0">
          <div className="pr-10">
            <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
              {isSuccess ? 'Submission Success' : 'Submit Application'}
            </h2>
            <p className="text-brand-accent text-[10px] font-bold uppercase mt-2 tracking-[0.2em] opacity-90">
              {jobTitle} <span className="text-white/40 mx-2">|</span> {area}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-8 custom-scrollbar">
          {isSuccess ? (
            // SUCCESS VIEW
            <div className="flex flex-col items-center text-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 size={56} className="text-emerald-500" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Application Received!</h3>
              
              <div className="mt-4 space-y-2">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Thank you, <span className="font-bold text-brand-primary">{formData.fullName}</span>! 
                  Your application for the <span className="font-bold">{jobTitle}</span> position has been successfully submitted.
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
                  What's next?
                </p>
                <p className="text-xs text-slate-500 italic">
                  Our HR team will review your documents and reach out via email or phone for the next steps.
                </p>
              </div>

              <button 
                onClick={onClose}
                className="mt-10 w-full py-5 bg-emerald-100 text-emerald-500 font-black rounded-2xl uppercase text-[10px] tracking-[3px] shadow-xl hover:bg-brand-primary hover:text-white transition-all active:scale-95"
              >
                Close Window
              </button>
            </div>
          ) : (
            // FORM VIEW
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Full Name</label>
                  <input 
                    required
                    value={formData.fullName}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-primary focus:bg-white transition-all"
                    placeholder="Juan Dela Cruz"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-primary focus:bg-white transition-all"
                      placeholder="juan@email.com"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Contact Number</label>
                    <input 
                      required
                      type="tel"
                      value={formData.phone}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-primary focus:bg-white transition-all"
                      placeholder="0917 XXX XXXX"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest text-center block">Attachments (PDF Only)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center relative hover:border-brand-primary/50 transition-all bg-slate-50/50 group">
                  <input 
                    type="file" 
                    multiple 
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Paperclip size={32} className="mx-auto text-brand-primary mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Click to upload Resume & Credentials</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">You can select multiple files</p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10">
                      <FileText size={16} className="text-brand-primary" />
                      <span className="text-[10px] font-bold text-slate-700 truncate flex-1">{file.name}</span>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                  ))}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 bg-brand-primary text-white font-black py-5 rounded-2xl uppercase text-xs tracking-[3px] shadow-xl transition-all active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-accent hover:text-brand-primary'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <>
                    Submit Application <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};