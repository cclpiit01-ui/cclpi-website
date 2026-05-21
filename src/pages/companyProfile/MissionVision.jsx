import { Reveal } from "@/components/animation/Reveal";
import { Target, Eye } from 'lucide-react';

const MissionVision = () => (
  <section className="py-24 px-6 bg-brand-primary text-white">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      <Reveal direction="bottom">
        <div className="relative p-10 rounded-3xl bg-white/5 border border-white/10 overflow-hidden h-full">
          <Target size={80} className="absolute -right-4 -top-4 opacity-10" />
          <h3 className="text-brand-accent font-heading font-black text-3xl mb-6 uppercase ">Our Mission</h3>
          <p className="text-slate-200 leading-relaxed text-lg font-light">
         Mission here
          </p>
        </div>
      </Reveal>
      <Reveal direction="bottom" delay={0.2}>
        <div className="relative p-10 rounded-3xl bg-white/5 border border-white/10 overflow-hidden h-full">
          <Eye size={80} className="absolute -right-4 -top-4 opacity-10" />
          <h3 className="text-brand-accent font-heading font-black text-3xl mb-6 uppercase ">Our Vision</h3>
          <p className="text-slate-200 leading-relaxed text-lg font-light">
          Vision here
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

export default MissionVision;