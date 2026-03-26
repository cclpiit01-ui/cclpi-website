import React from 'react';
import { PhoneCall } from 'lucide-react';

export const MemorialClaimsFaq = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-brand-primary p-8 rounded-2xl text-white shadow-xl border-b-8 border-brand-accent">
      <p className="text-[10px] opacity-70 uppercase font-black tracking-[0.2em] mb-2">24/7 Hotline Support</p>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-brand-accent tracking-tighter">0998-953-9437 / 0917-154-3459</h2>
        <div className="p-3 bg-brand-secondary rounded-full"><PhoneCall size={24} /></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { h: "First Call", d: "Body release, death certificate assistance, & transport." },
        { h: "Preservation", d: "Embalming, cosmetics, and casket placement." },
        { h: "Final Arrangement", d: "Viewing facilities for dignified service." },
        { h: "Interment", d: "Funeral cortege and hearse coach." }
      ].map((item, i) => (
        <div key={i} className="p-5 bg-brand-surface rounded-xl border-l-4 border-brand-secondary shadow-sm">
          <h4 className="font-black text-brand-primary text-[10px] uppercase mb-1">{item.h}</h4>
          <p className="text-xs text-slate-600 font-medium">{item.d}</p>
        </div>
      ))}
    </div>
  </div>
);