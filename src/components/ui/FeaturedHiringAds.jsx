import React from 'react';
import { Target, Star, CheckSquare, Phone, Mail, PartyPopper, ChevronRight, Award, Zap } from 'lucide-react';

export const FeaturedHiringAds = () => {
  const steps = [
    "Attend the training",
    "Take Licensure Exam",
    "Fill out the P.I.F",
    "Submit TIN #, 1x1 picture, and Valid I.D (photocopied)",
    "Pay the Licensing Fee Php680",
    "Sign the SC Agreement",
    "Get your Sales Kit and SC I.D"
  ];

  const benefits = [
    { title: "Competitive Income", desc: "Performance-based earnings" },
    { title: "Travel Incentives", desc: "Local & International trips" },
    { title: "Growth & Trainings", desc: "Professional development" }
  ];

  const contactDept = {
    name: "Sales and Marketing Department",
    phone: "0917-853-5144",
    email: "cclpisales@cclpi.com.ph"
  };

  return (
    <section className="bg-brand-primary py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- RECRUITMENT HEADER --- */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-brand-accent text-[11px] font-black uppercase tracking-[0.3em] mb-6">
            <Zap size={14} className="animate-pulse" /> Immediate Hiring
          </div>
          <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Looking for <span className="text-brand-accent italic underline decoration-white/20">Dedicated</span> <br className="hidden md:block" />
            Sales Counselors
          </h3>
          <p className="max-w-2xl mx-auto text-white/80 font-medium text-lg leading-relaxed">
            Start a rewarding career with CCLPI. We are looking for goal-oriented individuals 
            ready to help Filipino families secure their future while achieving financial freedom.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row items-stretch gap-10">
          
          {/* LEFT SIDE: Hero Poster Card */}
          <div className="xl:w-1/3 flex flex-col bg-white/10 backdrop-blur-md rounded-[3rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent rotate-3 flex items-center justify-center mb-8 shadow-lg shadow-brand-accent/20">
                <Target size={32} className="text-brand-primary -rotate-3" />
              </div>
              
              <h1 className="text-3xl font-black text-white leading-[1.1] mb-2 uppercase">
                Join our <br /> <span className="text-brand-accent">Team</span>
              </h1>
              <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-8">
                Official Recruitment 2026
              </p>
            </div>

            <div className="relative rounded-[2rem] overflow-hidden">
              <img 
                src="/src/assets/candy.jpg" 
                alt="Hiring Sales Counselors"
                className="w-full h-120 object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary to-transparent opacity-60"></div>
            </div>
          </div>

          {/* RIGHT SIDE: Roadmap & Details */}
          <div className="xl:w-2/3 space-y-8 flex flex-col">
            
            {/* Steps section */}
            <div className="bg-white rounded-[3rem] p-8 lg:p-10 shadow-2xl flex-grow">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-primary/10 rounded-2xl">
                  <Star className="text-brand-primary" size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Application Roadmap</h3>
                  <p className="text-sm text-slate-500 font-medium">Clear steps to your new career</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map((step, index) => (
                  <div key={index} className="group flex items-center gap-4 bg-slate-50 hover:bg-brand-primary hover:text-white p-4 rounded-2xl border border-slate-100 transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-brand-primary group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors">
                      {index + 1}
                    </div>
                    <p className="text-sm font-semibold transition-colors flex-1 leading-snug">{step}</p>
                    <CheckSquare size={18} className="text-slate-300 group-hover:text-white transition-colors shrink-0"/>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Grid: Benefits & Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Why Join Us */}
              <div className="bg-brand-secondary rounded-[2.5rem] p-8 text-brand-primary relative overflow-hidden shadow-xl">
                <PartyPopper className="absolute -right-4 -top-4 w-32 h-32 text-brand-primary/5 -rotate-12" />
                <h3 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tighter text-white">
                  <Award size={22} /> Perks & Benefits
                </h3>
                <div className="space-y-3">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white backdrop-blur-sm p-4 rounded-2xl border border-brand-primary/10">
                      <ChevronRight size={16} className="shrink-0" />
                      <p className="font-bold text-sm uppercase tracking-tight">{b.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 flex flex-col justify-center items-center text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-4">Get In Touch</p>
                <p className="text-md font-bold text-white mb-6 leading-tight uppercase">{contactDept.name}</p>
                
                <div className="flex flex-col gap-3 w-full">
                  <a href={`tel:${contactDept.phone}`} className="flex items-center justify-center gap-3 bg-white text-brand-primary hover:bg-brand-accent py-3 px-6 rounded-2xl text-sm font-black transition-all shadow-lg">
                    <Phone size={18} /> {contactDept.phone}
                  </a>
                  <a href={`mailto:${contactDept.email}`} className="text-lg font-bold text-white/80 hover:text-white transition-colors underline-offset-4 hover:underline">
                    {contactDept.email}
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};