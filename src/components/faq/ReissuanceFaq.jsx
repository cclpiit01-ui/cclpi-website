import React from 'react';
import { Copy, FileX, RefreshCw, BadgeCheck, Landmark, Receipt } from 'lucide-react';

export const ReissuanceFaq = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Disclaimer / Info Header */}
      <div className="bg-brand-primary p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <RefreshCw className="text-brand-accent animate-spin-slow" size={28} />
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-brand-secondary">Policy Reissuance</h4>
            <p className="text-xs opacity-80 leading-relaxed font-medium">
              Replacement of the original policy document is required for transfers of ownership or in cases of loss.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CATEGORY 1: PLAN TRANSFER */}
        <div className="bg-white border-2 border-slate-50 rounded-[2rem] p-8 shadow-sm hover:border-brand-secondary transition-all flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-surface rounded-xl text-brand-secondary">
              <RefreshCw size={20} />
            </div>
            <h4 className="font-black text-brand-primary text-[10px] uppercase tracking-widest">Due to Plan Transfer</h4>
          </div>
          
          <ul className="space-y-4 flex-1">
            {[
              { t: "Surrender Original Policy", d: "From the original assignor.", i: <FileX size={14}/> },
              { t: "Deed of Assignment", d: "2 copies of Transfer of Rights.", i: <BadgeCheck size={14}/> },
              { t: "Valid ID", d: "Original or photocopy of any valid ID.", i: <Landmark size={14}/> },
              { t: "New Application Form", d: "Signed by the new assignee.", i: <Copy size={14}/> }
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 text-brand-secondary">{item.i}</span>
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.t}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CATEGORY 2: LOST POLICY */}
        <div className="bg-white border-2 border-slate-50 rounded-[2rem] p-8 shadow-sm hover:border-brand-secondary transition-all flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-surface rounded-xl text-brand-secondary">
              <FileX size={20} />
            </div>
            <h4 className="font-black text-brand-primary text-[10px] uppercase tracking-widest">Lost of Policy</h4>
          </div>
          
          <ul className="space-y-4 flex-1">
            <li className="flex gap-3">
              <span className="mt-1 text-brand-secondary"><BadgeCheck size={14}/></span>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Affidavit of Loss</p>
                <p className="text-[11px] text-slate-500 font-medium italic">Submit 3 original copies.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-brand-secondary"><Landmark size={14}/></span>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Residence Certificate</p>
                <p className="text-[11px] text-slate-500 font-medium">Latest copy of Planholder's Cedula.</p>
              </div>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 italic">
            <p className="text-[10px] text-amber-700 leading-tight">
              Please ensure all details in the affidavit match your original contract records.
            </p>
          </div>
        </div>
      </div>

      {/* FEES FOOTER */}
      <div className="bg-brand-surface rounded-2xl p-6 border border-brand-secondary/10 shadow-inner">
        <h4 className="text-brand-primary font-black text-[10px] uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
          <Receipt size={16} className="text-brand-secondary" /> Processing Fees
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-brand-secondary">
            <span className="text-xs font-bold text-slate-600 tracking-tight">Notarial Fee (If applicable)</span>
            <span className="font-black text-brand-primary">₱200.00</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border-l-4 border-brand-accent">
            <span className="text-xs font-bold text-slate-600 tracking-tight">Policy Reissue Fee</span>
            <span className="font-black text-brand-primary">₱400.00</span>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
          *Fees are payable at any CCLPI authorized office.
        </p>
      </div>

    </div>
  );
};