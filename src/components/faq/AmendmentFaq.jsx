import React from 'react';
import { Edit3, CheckCircle2, AlertCircle, UserCog } from 'lucide-react';

export const AmendmentFaq = () => {
  const chargeableAmendments = [
    "Address", "Marital Status", "Beneficiary", 
    "Relationship", "Birthdays", "Place of Birth"
  ];

  const feeTiers = [
    { label: "1st Amendment", price: "₱50.00" },
    { label: "2nd Amendment", price: "₱100.00" },
    { label: "3rd Amendment", price: "₱150.00" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-700">
      {/* List of Amendable Fields */}
      <div>
        <h4 className="font-black text-brand-primary text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
          <UserCog size={18} className="text-brand-secondary" /> Changeable Information
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {chargeableAmendments.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-brand-surface border border-slate-100 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
              <span className="text-xs font-bold">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {feeTiers.map((tier, i) => (
          <div key={i} className="relative p-5 bg-white border-2 border-slate-50 rounded-2xl shadow-sm flex flex-col items-center text-center group hover:border-brand-secondary transition-all">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{tier.label}</span>
            <span className="text-xl font-black text-brand-primary">{tier.price}</span>
            <div className="absolute -top-2 -right-2 bg-brand-surface p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 size={12} className="text-brand-secondary" />
            </div>
          </div>
        ))}
      </div>

      {/* Free Corrections Box */}
      <div className="bg-green-50 border border-green-100 p-6 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-green-700 font-black text-xs uppercase mb-3 tracking-widest flex items-center gap-2">
            <CheckCircle2 size={16} /> Free of Charge
          </h4>
          <p className="text-xs text-green-800 leading-relaxed font-medium">
            Request for changes of the following will <strong className="underline">not</strong> be charged:
          </p>
          <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-green-700 font-bold">
            <li className="flex items-center gap-2 italic">• Correction of Names (Spelling, Middle Initials)</li>
            <li className="flex items-center gap-2 italic">• Correction of Address (Street #, Spelling)</li>
          </ul>
        </div>
        <CheckCircle2 size={80} className="absolute -right-4 -bottom-4 text-green-200/30 rotate-12" />
      </div>

      {/* Reminder */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <AlertCircle className="text-amber-500" size={18} />
        <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight">
          Please bring your Original Policy when requesting for amendments.
        </p>
      </div>
    </div>
  );
};