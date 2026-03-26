import { Reveal } from "@/components/animation/Reveal";
import { Activity, Users, UserPlus, Award, Clock, RefreshCcw } from 'lucide-react';

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const ProductFeatures = () => (
  <section className="py-20 bg-brand-surface px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
      <Reveal direction="bottom">
            <div className="text-center mb-16">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
                Plans Features
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
        </Reveal>
      </div>
      <Reveal direction="bottom">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard icon={<Activity className="text-blue-600" />} title="Increasing Benefits" desc="Memorial benefits increase by 5% annually starting on the 6th policy year, up to 150% maximum." />
        <FeatureCard icon={<Users className="text-blue-600" />} title="Transferability" desc="Transferable to any living third person. The contestability period will start anew upon transfer." />
        <FeatureCard icon={<UserPlus className="text-blue-600" />} title="Assignment" desc="Can be assigned to any deceased person, provided all remaining premiums are settled." />
        <FeatureCard icon={<Award className="text-blue-600" />} title="Affordable Installments" desc="Choose a payment term that fits your budget—5, 7, or even 10 years. Start securing your family's future for as low as ₱270 per month." />
        <FeatureCard icon={<Clock className="text-blue-600" />} title="60-Day Grace Period" desc="Enjoy a 60-day buffer from the premium due date for delayed payments." />
        <FeatureCard icon={<RefreshCcw className="text-blue-600" />} title="2-Year Reinstatement" desc="Lapsed plans can be reinstated within 2 years from the premium due date." />
      </div>
      </Reveal>
    </div>
  </section>
);

export default ProductFeatures;