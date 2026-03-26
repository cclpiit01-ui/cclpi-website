import React from 'react';
import { ShieldCheck, Heart, Calculator, PhoneCall } from 'lucide-react'; // Inalis ang ArrowUpRight
import { Reveal } from "@/components/animation/Reveal";

const KeyBenefits = () => {
  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Comprehensive Protection",
      description: "Memorial benefits increasing by 5% annually up to 150% of contract price.",
      tag: "Guaranteed"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Peace of Mind",
      description: "Full coordination and support, ensuring dignity for your loved ones.",
      tag: "Supportive"
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "The Most Affordable Plans",
      description: "Starts at only ₱270/month with flexible 10-year installment terms.",
      tag: "Budget-Friendly"
    },
    {
      icon: <PhoneCall className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Our dedicated care team is available anytime, day or night.",
      tag: "Reliable"
    }
  ];

  return (
    <section className="bg-brand-surface py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl opacity-50 -z-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl text-left">
            <Reveal direction="left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[2px] bg-brand-accent" />
                <span className="text-brand-primary font-black tracking-[0.3em] text-[20px] uppercase font-sans">
                  Why Angelica Life Plan
                </span>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <h2 className="text-brand-primary font-heading font-bold text-4xl md:text-6xl leading-tight ">
                Securing your future with <span className="text-brand-secondary not-italic">compassion</span> and care.
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Reveal key={index} direction="bottom" delay={index * 0.1}>
              <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-brand-secondary/30 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 relative overflow-hidden h-full">
                
                {/* Subtle Background Numbering */}
                <span className="absolute -right-4 -top-6 text-[10rem] font-heading font-black text-slate-50/50 group-hover:text-brand-surface transition-colors pointer-events-none italic select-none">
                  {index + 1}
                </span>

                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center mb-8 group-hover:bg-brand-secondary group-hover:-translate-y-1.5 transition-all duration-500 ease-out shadow-inner">
                    <div className="text-brand-accent group-hover:text-white transition-colors duration-300">
                      {benefit.icon}
                    </div>
                  </div>

                  {/* Tag */}
                  <span className="inline-block px-4 py-1.5 rounded-full bg-brand-surface text-brand-primary text-[9px] font-black uppercase tracking-widest mb-6 font-sans border border-slate-100">
                    {benefit.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-brand-primary font-heading font-black text-xl mb-4 uppercase leading-tight tracking-tight">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 font-sans text-sm leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>
                
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;