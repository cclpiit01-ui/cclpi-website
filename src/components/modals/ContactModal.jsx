import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import { X, Phone, ShieldCheck, ReceiptText, Clock, MessageSquare } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  // FIX: Guard renders completely when not open — no DOM presence at all
  if (!isOpen) return null;

  const departments = [
    {
      name: "Claims Department",
      desc: "For memorial and insurance benefit claims.",
      icon: <ShieldCheck size={20} />,
      colors: "bg-blue-50 text-brand-primary border-blue-100",
      numbers: [
        { label: "Smart", val: "+63 998 953 4937" },
        { label: "Globe", val: "+63 917 154 3459" }
      ]
    },
    {
      name: "Billing Department",
      desc: "For payment concerns and plan status.",
      icon: <ReceiptText size={20} />,
      colors: "bg-sky-50 text-brand-secondary border-sky-100",
      numbers: [
        { label: "Smart", val: "+63 968 887 7716" },
        { label: "Globe", val: "+63 917 852 3750" },
      ]
    }
  ];

  return (
    // FIX: Added pointer-events-auto explicitly to ensure modal is always interactive when open
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <Reveal direction="bottom">
        <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">

          {/* Header Section */}
          <div className="bg-brand-primary p-8 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black italic uppercase tracking-wider">Direct Lines</h2>
            <p className="text-brand-secondary text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              CCLPI Official Contact Channels
            </p>
          </div>

          {/* Department Cards */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {departments.map((dept, i) => (
              <div key={i} className={`p-5 rounded-3xl border-2 ${dept.colors}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {dept.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-tight">{dept.name}</h4>
                    <p className="text-[10px] opacity-70 leading-none font-medium">{dept.desc}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {dept.numbers.map((num, idx) => (
                    <a
                      key={idx}
                      href={`tel:${num.val.replace(/\s+/g, '')}`}
                      className="flex items-center justify-between bg-white/60 hover:bg-white p-4 rounded-2xl transition-all group border border-transparent hover:border-brand-secondary/30 active:scale-[0.98]"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {num.label}
                        </span>
                        <span className="text-sm font-black text-brand-primary group-hover:text-brand-secondary transition-colors">
                          {num.val}
                        </span>
                      </div>
                      <div className="p-2 bg-brand-secondary/10 rounded-lg text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all shadow-sm">
                        <Phone size={14} className="fill-current" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* Availability Note */}
            <div className="flex items-center justify-center gap-2 py-2">
              <Clock size={14} className="text-slate-300" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Office Hours: Mon - Fri | 8:00 AM - 5:00 PM
              </p>
            </div>
          </div>

          {/* Messenger Button */}
          <div className="px-6 pb-8">
            <a
              href="https://m.me/1961799380780001"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-secondary text-brand-primary rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brand-primary hover:text-white transition-all shadow-lg shadow-brand-secondary/20 active:scale-[0.98]"
            >
              <MessageSquare size={16} /> Chat with us on Messenger
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default ContactModal;
