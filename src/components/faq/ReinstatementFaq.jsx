import React from 'react';
import { RefreshCw, Calculator, ArrowRight, AlertCircle } from 'lucide-react';

export const ReinstatementFaq = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex items-start gap-4 p-5 bg-brand-surface rounded-2xl border border-brand-secondary/20">
        <AlertCircle className="text-brand-secondary shrink-0" size={20} />
        <p className="text-sm text-brand-primary leading-relaxed">
          If your plan has lapsed, you can restore its benefits through either <strong>Updating</strong> (paying all missed months) or <strong>Redating</strong> (starting a new payment schedule). Both require a <strong>Reinstatement Application</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OPTION A: UPDATING */}
        <div className="flex flex-col h-full border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-brand-secondary transition-all group">
          <div className="bg-slate-50 p-5 border-b border-slate-100">
            <h4 className="font-black text-brand-primary text-xs uppercase tracking-widest flex items-center gap-2">
              <RefreshCw size={16} className="text-brand-secondary" /> Option A: Updating
            </h4>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-brand-secondary shrink-0" />
                Pay all overdue premiums.
              </li>
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-brand-secondary shrink-0" />
                <strong>2% penalty</strong> per overdue month.
              </li>
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-brand-secondary shrink-0" />
                Reinstatement fee: <strong>₱200.00</strong>.
              </li>
            </ul>

            {/* Computation Box */}
            <div className="bg-brand-primary rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                <Calculator size={14} className="text-brand-accent" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Sample Computation (5 Months)</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] opacity-90">
                <div className="flex justify-between"><span>Premiums (900 x 5):</span> <span>₱4,500.00</span></div>
                <div className="flex justify-between"><span>Penalty (2%):</span> <span>₱90.00</span></div>
                <div className="flex justify-between border-b border-white/10 pb-1"><span>Fee:</span> <span>₱200.00</span></div>
                <div className="flex justify-between text-brand-accent font-bold pt-1 text-sm">
                  <span>TOTAL:</span> <span>₱4,790.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OPTION B: REDATING */}
        <div className="flex flex-col h-full border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-brand-secondary transition-all group">
          <div className="bg-slate-50 p-5 border-b border-slate-100">
            <h4 className="font-black text-brand-primary text-xs uppercase tracking-widest flex items-center gap-2">
              <RefreshCw size={16} className="rotate-180 text-brand-secondary" /> Option B: Redating
            </h4>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-brand-secondary shrink-0" />
                Pay 1 installment only.
              </li>
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-brand-secondary shrink-0" />
                <strong>10% penalty</strong> (2% x 5 months).
              </li>
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-brand-secondary shrink-0" />
                Reinstatement fee: <strong>₱200.00</strong>.
              </li>
              <li className="flex gap-2">
                <ArrowRight size={14} className="text-brand-secondary shrink-0" />
                Finance charge: <strong>8% per month</strong>.
              </li>
            </ul>

            {/* Computation Box */}
            <div className="bg-brand-secondary rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                <Calculator size={14} className="text-brand-primary" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Sample Computation (5 Months)</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] opacity-90">
                <div className="flex justify-between"><span>1 Installment:</span> <span>₱900.00</span></div>
                <div className="flex justify-between"><span>Penalty:</span> <span>₱90.00</span></div>
                <div className="flex justify-between"><span>Finance (8%):</span> <span>₱360.00</span></div>
                <div className="flex justify-between border-b border-white/10 pb-1"><span>Fee:</span> <span>₱200.00</span></div>
                <div className="flex justify-between text-brand-primary font-bold pt-1 text-sm">
                  <span>TOTAL:</span> <span>₱1,550.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};