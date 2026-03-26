import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import { CheckCircle2 } from 'lucide-react';

const stockholders = [
  { name: "Metro Ormoc Community Cooperative (OCCCI)", desc: "A multi-awarded cooperative with billions in assets." },
  { name: "Sta. Lucia Realty & Dev. Inc.", desc: "A leader in Philippine real estate development." },
  { name: "Cebu International Finance Corp.", desc: "A pioneer in investment and financing." },
  { name: "San Fernando Homes Inc.", desc: "Bringing quality residential communities to Filipinos." }
];

export const StockholderGrid = () => (
  <section className="py-20 bg-slate-50 px-6">
    <div className="max-w-6xl mx-auto">
      <Reveal direction="bottom">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-slate-200"></div>
          <h2 className="text-brand-primary font-heading font-black text-2xl uppercase tracking-tight">Major Stockholders</h2>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stockholders.map((s, i) => (
          <Reveal key={i} direction="bottom" delay={i * 0.1}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-brand-accent transition-colors h-full">
              <CheckCircle2 className="text-brand-accent mb-3" size={20} />
              <h4 className="text-brand-primary font-bold text-sm uppercase mb-2 leading-tight">{s.name}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);