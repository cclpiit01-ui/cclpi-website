import React from 'react';
import { FileText, ShieldCheck, Activity, MapPin } from 'lucide-react';

const RequirementCard = ({ title, children }) => (
  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-brand-secondary transition-all">
    <h4 className="font-black text-brand-primary text-[10px] uppercase tracking-widest mb-3">{title}</h4>
    {children}
  </div>
);

export const InsuranceClaimsFaq = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center gap-3 p-4 bg-brand-surface rounded-xl border border-brand-secondary/20">
      <MapPin className="text-brand-secondary" size={20} />
      <p className="text-sm font-bold text-brand-primary">Visit any CCLPI office with these documents:</p>
    </div>

    <RequirementCard title="Yearly Renewable Term Life Insurance">
      <ul className="text-xs space-y-2 text-slate-600 list-disc pl-4">
        <li>Original Policy / Certificate of Full Payment</li>
        <li>Death Certificate (Original/Certified True Copy)</li>
        <li>Marriage Contract (if Spouse) / Birth Certificate (if Children/Parents)</li>
      </ul>
    </RequirementCard>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RequirementCard title="Accidental / Unprovoked Assault">
        <ul className="text-[10px] space-y-1 text-slate-500">
          <li>• Police Report (Original)</li>
          <li>• Medico Legal / Autopsy Report</li>
          <li>• Eye-witness Affidavit</li>
        </ul>
      </RequirementCard>
      <RequirementCard title="Permanent Disability">
        <ul className="text-[10px] space-y-1 text-slate-500">
          <li>• 180-day Medical Certification</li>
          <li>• Hospital Bill & Abstract</li>
        </ul>
      </RequirementCard>
    </div>

    <div className="bg-brand-primary/5 p-4 rounded-xl border-2 border-dashed border-brand-primary/20">
      <p className="text-[10px] font-bold text-brand-primary uppercase mb-2">Standard Forms Required:</p>
      <p className="text-[10px] text-slate-500">Claimant's Statement, Identification (3rd Party), Attending Physician's Statement.</p>
    </div>
  </div>
);