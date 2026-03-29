import React, { useState } from 'react';
import { ApplicationModal } from "@/components/modals/ApplicationModal"; // Siguraduhin ang tamang path

export default function CareerCard({ 
  position, 
  area_assign, 
  description, 
  job_brief, 
  educational_requirements, 
  competencies 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safety check para sa Array data
  const renderList = (data) => {
    if (!data) return null;
    // Kung string lang ang dumating (e.g. Postgres format), ginagawa nating array
    const list = Array.isArray(data) ? data : [data];
    
    return list.map((item, index) => (
      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
        <span className="text-brand-primary font-bold mt-1">•</span>
        <span>{item}</span>
      </li>
    ));
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-full overflow-hidden transition-transform hover:scale-[1.01]">
        
        {/* HEADER - Primary Background */}
        <div className="bg-brand-primary p-8 text-white">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight leading-tight flex-1">
              {position}
            </h2>
            {area_assign && (
              <span className="bg-brand-accent text-brand-primary text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest leading-tight max-w-[150px] text-center break-words shrink-0">
                {area_assign}
              </span>
            )}
          </div>
          <p className="text-blue-100/80 text-xs leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-8 flex-grow">
          
          {/* Job Brief */}
          {job_brief && (
            <div className="relative">
              <p className="text-slate-500 text-sm italic leading-relaxed border-l-4 border-brand-accent pl-4 py-1">
                "{job_brief}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            {/* Educational Requirements */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-4 bg-brand-accent/10 px-3 py-1 inline-block rounded">
                Educational Requirements
              </h4>
              <ul className="space-y-3">
                {renderList(educational_requirements)}
              </ul>
            </div>

            {/* Competencies */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-4 bg-brand-primary/10 px-3 py-1 inline-block rounded">
                Competencies
              </h4>
              <ul className="space-y-3">
                {renderList(competencies)}
              </ul>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="p-8 pt-0 mt-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-brand-primary hover:bg-brand-accent hover:text-brand-primary text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-[3px] shadow-lg shadow-brand-primary/20 active:scale-95"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* MODAL COMPONENT */}
      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        jobTitle={position} 
        area={area_assign}
      />
    </>
  );
}