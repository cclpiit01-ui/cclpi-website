import { ShieldCheck, X } from 'lucide-react';


const StickyPlanBar = ({ plan, onClose }) => {
  if (!plan) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#013F99] text-white shadow-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            className="group flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 transition-colors"
            type="button"
          >
            <X size={16} className="text-white" />
          </button>

          <div className="hidden sm:flex w-10 h-10 bg-white/10 rounded-full items-center justify-center">
            <ShieldCheck className="text-yellow-400" size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Active Quote</p>
            <p className="text-sm font-bold">₱{plan.price.toLocaleString()} Plan</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="text-right">
            <p className="text-[10px] uppercase font-black tracking-widest opacity-70">{plan.term} Year Term</p>
            <p className="text-xl font-black text-yellow-400 italic">
              ₱{plan.monthly.toLocaleString()}
              <span className="text-xs text-white not-italic opacity-80 ml-1">/mo</span>
            </p>
          </div>

          <a 
            href="https://sc.cclpi.com.ph:8080/#/referral/4f030d0843486b39/1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-brand-accent hover:bg-brand-accent text-blue-950 px-6 py-2 rounded-full font-black uppercase text-[11px] transition-all"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default StickyPlanBar;