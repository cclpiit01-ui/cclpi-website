import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import { Phone, User, FileText, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Claims() {
  const availmentSteps = [
    {
      step: "01",
      icon: <Phone className="w-8 h-8" />,
      title: "Immediate Notification",
      subtitle: "Call the Claims Department",
      desc: (
        <div className="space-y-3">
          <p className="text-slate-500 font-medium">Contact our 24/7 dedicated support team immediately upon need:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-brand-surface p-4 rounded-2xl border border-blue-50">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Smart</span>
              <p className="font-black text-brand-primary text-lg">0998-953-4937</p>
            </div>
            <div className="bg-brand-surface p-4 rounded-2xl border border-blue-50">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Globe</span>
              <p className="font-black text-brand-primary text-lg">0917-154-3459</p>
            </div>
          </div>
        </div>
      )
    },
    {
      step: "02",
      icon: <User className="w-8 h-8" />,
      title: "Verification Process",
      subtitle: "Send Deceased Details",
      desc: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Full name of the plan holder",
            "Policy number",
            "Address for pick-up",
            "Contact person & number"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <CheckCircle2 size={18} className="text-brand-accent shrink-0" />
              <span className="text-sm font-bold text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      step: "03",
      icon: <FileText className="w-8 h-8" />,
      title: "Documentation",
      subtitle: "Documents to Surrender",
      desc: (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 p-4 bg-brand-primary/5 rounded-2xl border-l-4 border-brand-primary">
                <p className="text-sm font-bold text-brand-primary mb-1">Standard Policy</p>
                <p className="text-xs text-slate-600">Acceptance and Life Plan Application</p>
             </div>
             <div className="flex-1 p-4 bg-brand-primary/5 rounded-2xl border-l-4 border-brand-primary">
                <p className="text-sm font-bold text-brand-primary mb-1">Proof of Payment</p>
                <p className="text-xs text-slate-600">Certificate of Full Payment (if applicable)</p>
             </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <p className="text-[11px] font-bold text-amber-800 italic uppercase">Affidavit of Loss is required if documents are lost.</p>
          </div>
        </div>
      )
    },
    {
      step: "04",
      icon: <Truck className="w-8 h-8" />,
      title: "Professional Coordination",
      subtitle: "Mortuary Mobilization",
      desc: (
        <div className="space-y-4">
<p className="text-slate-600 font-medium leading-relaxed">
  Our Claims Staff will immediately coordinate with our <strong className="text-brand-primary font-bold">Accredited Mortuary</strong> for the professional retrieval and care of the deceased. 
  The administration of such services shall be performed exclusively by the accredited mortuary of the company. 
  <span className=" block mt-2 text-sm text-slate-500">
    Please note: Any services performed by a non-accredited mortuary shall be deemed unrendered and are not eligible for claim coverage.
  </span>
</p>
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-primary/5 rounded-full border border-brand-primary/10 text-brand-primary text-[11px] font-black uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-brand-accent" /> 24/7 Service Nationwide
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-brand-surface pb-32">
      <PageHeader 
        title="Claims Services" 
        subtitle="Providing professional and compassionate assistance during your time of need." 
      />

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <Reveal direction="bottom">
            <div className="mb-20">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase leading-tight mb-4">
                How to Avail <br/><span className="text-brand-secondary">Your Plan Procedures</span>
              </h2>
              <div className="w-24 h-2 bg-brand-accent rounded-full" />
            </div>
          </Reveal>

          {/* Vertical Path Design */}
          <div className="space-y-12">
            {availmentSteps.map((item, index) => (
              <Reveal key={index} delay={index * 0.1} direction="left">
                <div className="relative group">
                  {/* Visual Connector Line */}
                  {index !== availmentSteps.length - 1 && (
                    <div className="absolute left-10 top-24 bottom-[-3rem] w-1 bg-slate-200 hidden md:block" />
                  )}

                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Step Bubble */}
                    <div className="relative z-10 shrink-0">
                      <div className="w-20 h-20 rounded-[2rem] bg-brand-primary text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-brand-secondary transition-all duration-500">
                        {item.icon}
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-brand-accent rounded-full border-4 border-white flex items-center justify-center font-black text-white text-sm">
                        {item.step}
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-grow bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group-hover:shadow-2xl group-hover:shadow-brand-primary/5 transition-all duration-500">
                      <div className="mb-6">
                        <p className="text-brand-accent font-black text-xs uppercase tracking-[0.2em] mb-1">{item.title}</p>
                        <h4 className="text-brand-primary font-heading font-black text-2xl uppercase tracking-tighter">{item.subtitle}</h4>
                      </div>
                      <div className="relative">
                         {item.desc}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
                                  {/* FOOTER MESSAGE */}
          <Reveal direction="bottom">
<div className="mt-24 text-center p-12 bg-brand-primary rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
  {/* Decorative Background Elements */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
  <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-accent/10 rounded-full -ml-20 -mb-20 blur-2xl" />

  <div className="relative z-10">
    <h3 className="text-3xl font-heading font-black uppercase mb-4 tracking-tight">
      Service Network <span className="text-brand-accent italic">Nationwide</span>
    </h3>

    <p className="max-w-2xl mx-auto text-blue-100/80 font-medium leading-relaxed pb-10">
      We are partnered with professional funeral homes across the Philippines to ensure 
      that our commitment to compassionate service reaches you, wherever you are.
    </p>

    <a
      href="/products/mortuaries"
      className="group inline-flex items-center gap-3 bg-brand-accent hover:bg-white text-brand-primary font-black uppercase tracking-widest py-5 px-12 rounded-2xl shadow-xl hover:shadow-brand-accent/20 transition-all duration-300 active:scale-95"
    >
      See Our Accredited Mortuaries
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 group-hover:translate-x-1 transition-transform" 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  </div>
</div>

          </Reveal>
        </div>


      </section>

    </div>
  );
}