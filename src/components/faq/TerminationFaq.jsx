import React from 'react';
import { FileText, UserCheck, MailOpen, Receipt } from 'lucide-react';

export const TerminationFaq = () => {
  const requirements = [
    { 
      text: "Original policy and/or Certificate of Full Payment", 
      icon: <FileText size={18} className="text-brand-secondary" /> 
    },
    { 
      text: "Valid ID of planholder", 
      icon: <UserCheck size={18} className="text-brand-secondary" /> 
    },
    { 
      text: "Letter from the Planholder requesting for termination", 
      icon: <MailOpen size={18} className="text-brand-secondary" /> 
    },
    { 
      text: "Notarial fee of ₱200.00", 
      icon: <Receipt size={18} className="text-brand-secondary" /> 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-brand-surface p-6 rounded-2xl border border-brand-secondary/20">
        <h4 className="text-brand-primary font-black text-xs uppercase mb-4 tracking-widest">
          Required Documents for Termination
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          {requirements.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-brand-secondary transition-all">
              <div className="p-2 bg-brand-surface rounded-lg shrink-0">
                {item.icon}
              </div>
              <p className="text-sm font-bold text-slate-700">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
          <div className="bg-amber-500 text-white p-1 rounded-full shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
            <strong>Note:</strong> Termination of the plan means you will forfeit the future memorial benefits of the policy. Please visit any CCLPI office to process your request.
          </p>
        </div>
      </div>
    </div>
  );
};