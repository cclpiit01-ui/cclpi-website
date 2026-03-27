import React from 'react';
import { ShieldCheck, FileText, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Reveal } from "@/components/animation/Reveal";

// Improved Row as a Mini-Card Template
const InsuranceRow = ({ title, desc, delay }) => (
  <Reveal direction="left" delay={delay}>
    <div className="group flex gap-5 items-start p-6 bg-white border-l-8 border-brand-primary shadow-sm rounded-r-3xl hover:shadow-md transition-all duration-300 mb-4 border border-slate-100">
      <div className="mt-1 p-2 bg-brand-surface rounded-lg text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
        <ShieldCheck size={22}/>
      </div>
      <div>
        <h4 className="font-heading font-black text-brand-primary uppercase text-lg mb-1 tracking-tight">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed font-sans">{desc}</p>
      </div>
    </div>
  </Reveal>
);

const AdditionalBenefits = () => {
  return (
    <section className="py-24 px-6 bg-brand-surface">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header based on your Template */}
        <Reveal direction="bottom">
          <div className="text-center mb-16">
            <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
              Additional Insurance Benefits
            </h2>
            <div className="w-24 h-2 bg-brand-accent mx-auto mt-6 rounded-full" />
            <p className="text-slate-500 mt-6 font-sans italic max-w-2xl mx-auto text-sm md:text-base">
              Coverage applicable for plan holders within the insurable age (up to 69) or within the 10-year period.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Insurance List */}
          <div className="space-y-2">
            <InsuranceRow 
              delay={0.1}
              title="Credit Life Insurance" 
              desc="Provides full coverage on the unpaid balance of the Gross Contract Price (GCP), ensuring your family is left with no debt." 
            />
            <InsuranceRow 
              delay={0.3}
              title="Total & Permanent Disability and Waiver of Installments caused by Accident" 
              desc="Balance fully paid if disability continues uninterrupted for 180 days before age 69." 
            />
            <InsuranceRow 
              delay={0.2}
              title="Group Yearly Renewable Term Insurance" 
              desc="An insurance benefit equal to 100% of the Gross Contract Price provided to beneficiaries." 
            />

            <InsuranceRow 
              delay={0.4}
              title="Accidental Death Benefit" 
              desc="Indemnifies 200% of the GCP in the unfortunate event of accidental loss of life." 
            />
          </div>

          {/* Right: Terms & Eligibility Card - Using the "Master Card" Template */}
          <Reveal direction="right">
            <div className="bg-white p-10 rounded-3xl shadow-xl border-b-8 border-brand-accent h-full relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16" />

              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-primary">
                  <FileText size={28} />
                </div>
                <h3 className="text-2xl font-heading font-black text-brand-primary uppercase">Terms & Eligibility</h3>
              </div>

              <div className="space-y-8">
                {/* Contestability */}
                <div>
                  <p className="text-xl font-black text-brand-secondary uppercase tracking-[0.2em] mb-3">Contestability Period</p>
                  <p className="text-slate-700 font-sans font-medium text-lg flex items-center gap-2">
                    <ArrowRight size={18} className="text-brand-primary" />
                    One (1) year from effective date
                  </p>
                </div>

                {/* Pre-existing illnesses box */}
                <div className="p-6 bg-red-50 rounded-2xl border-l-4 border-red-400">
                  <div className="flex items-center gap-2 text-red-700 font-black mb-3 text-sm uppercase">
                    <AlertCircle size={18} /> Pre-existing Illnesses
                  </div>
                  <p className="text-xs text-red-600 leading-relaxed font-sans">
                    Heart ailment, hypertension, cancer, diabetes, lung/kidney disorders, and TB. 
                    <span className="block mt-3 font-bold italic opacity-80 border-t border-red-200 pt-2">
                      *Note: Contestability applies if death occurs within one year due to these ailments.
                    </span>
                  </p>
                </div>

                {/* Age Highlight Box */}
                <div className="p-8 bg-brand-primary rounded-2xl text-white shadow-lg shadow-brand-primary/20 relative">
                   <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-brand-secondary">
                      <UserCheck size={20} />
                      <span className="text-xs font-black uppercase tracking-widest text-white/70">Insurable Age Range</span>
                    </div>
                    <p className="text-5xl font-heading font-black mb-2">18 - 69</p>
                    <p className="text-[11px] font-sans opacity-80 leading-snug">
                      Note: Entry age for insurance extension is 18 to 64 years old.
                            Ages 66 to 69 have additional premium for the insurance coverage up to 200,000.00.
                    </p>
                   </div>
                   {/* Background icon for texture */}
                   <UserCheck size={100} className="absolute right-[-10px] bottom-[-10px] text-white opacity-5" />
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default AdditionalBenefits;