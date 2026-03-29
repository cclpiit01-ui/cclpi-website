import React from 'react';
import { Reveal } from "@/components/animation/Reveal";

export const SalesCounselor = ({ data }) => {
  return (
    <section className="py-24 px-6 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        <Reveal direction="bottom">
          <div className="text-center mb-16">
            <h2 className="text-brand-primary font-heading font-black text-3xl uppercase tracking-tight">
              Be a Sales Partner
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Earn unlimited income while helping families secure their future.</p>
          </div>
        </Reveal>

        <div className="max-w-4xl mx-auto">
          <Reveal direction="bottom">
            <div className="bg-brand-surface rounded-3xl overflow-hidden shadow-2xl border border-brand-primary/5 group">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto overflow-hidden">
                  <img 
                    src={data.image} 
                    alt="Sales Team" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 md:p-12">
                  <span className="bg-brand-accent text-brand-primary font-bold text-xs uppercase px-4 py-1.5 rounded-full">
                    {data.type}
                  </span>
                  <h3 className="text-2xl font-bold text-brand-primary mt-6 mb-4">{data.position}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed italic">
                    "{data.description}"
                  </p>
                  <div className="space-y-4 mb-10">
                    {data.qualifications.map((q, index) => (
                      <div key={index} className="flex items-start text-sm text-slate-700">
                        <div className="w-2 h-2 bg-brand-accent rounded-full mt-1.5 mr-3 shrink-0" />
                        {q}
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-accent hover:text-brand-primary shadow-lg transition-all duration-300 uppercase tracking-widest text-xs">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};