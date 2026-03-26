import React from 'react';
import { PhoneCall, Truck, FileText, HeartPulse, Award, ShieldCheck, Users } from 'lucide-react';
import { Reveal } from "@/components/animation/Reveal";

const BenefitItem = ({ icon, text }) => (
  <div className="flex items-start gap-4 group">
    <div className="bg-white/10 p-3 rounded-xl text-yellow-400 group-hover:bg-yellow-400 group-hover:text-blue-900 transition-all duration-300">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <p className="text-lg font-light leading-snug opacity-90 group-hover:opacity-100 transition-opacity">
      {text}
    </p>
  </div>
);

const MemorialBenefits = () => {
  return (
    <section className="py-24 bg-brand-primary text-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <Reveal direction="left"><h2 className="text-3xl md:text-4xl font-bold mb-4">Memorial Service Benefits</h2></Reveal>
          <Reveal direction="scale"><div className="h-1.5 w-24 bg-yellow-400 rounded-full"></div></Reveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
          <Reveal direction="left"><BenefitItem icon={<PhoneCall />} text="24-hour service availability with just ONE PHONE CALL." /></Reveal >
          <Reveal direction="right"><BenefitItem icon={<Truck />} text="Retrieval of body from place of death via mortuary vehicle." /></Reveal >
          <Reveal direction="left"><BenefitItem icon={<FileText />} text="Provides claims requirements checklist." /></Reveal >
          <Reveal direction="right"><BenefitItem icon={<HeartPulse />} text="Professional embalming, sanitation, and preservation." /></Reveal >
          <Reveal direction="left"><BenefitItem icon={<Award />} text="Professional cosmetological care for a dignified appearance." /></Reveal >
          <Reveal direction="right"><BenefitItem icon={<ShieldCheck />} text="Casket based on your chosen Life Plan option." /></Reveal >
          <Reveal direction="left"><BenefitItem icon={<Users />} text="Standard viewing equipment: lights, stand, board, and carpet." /></Reveal >
          <Reveal direction="right"><BenefitItem icon={<Truck />} text="Interment hearse within 25km radius of servicing mortuary." /></Reveal >
        </div>
      </div>
    </section>
  );
};

export default MemorialBenefits;