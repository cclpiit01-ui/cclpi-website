import React from 'react';
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";
import DirectorCard from "@/components/cards/ManagementCard";

// 1. Import your final images here when ready
import sampleImg from "@/assets/management/sample-photo.jpg"; 
import ceo from "@/assets/management/ceo.jpg";
import cfo from "@/assets/management/cfo.jpg";
import coo from "@/assets/management/coo.jpg";
import sales from "@/assets/management/sales.jpg";
import marketing from "@/assets/management/marketing.jpg";
import hrad from "@/assets/management/hrad.jpg";
import accounting from "@/assets/management/accounting.jpg";
import finance from "@/assets/management/finance.jpg";
import it from "@/assets/management/it.jpg";
import compliance from "@/assets/management/compliance.jpg"; 

const TopManagement = () => {
  const executives = [
    { name: "Mansueto V. Dela Peña", role: "President and CEO", image: ceo},
    { name: "Severino B. Pedroza", role: "Chief Financial Officer (CFO)", image: cfo },
    { name: "Revecita P. Salarda", role: "Deputy Chief Operational Officer", image: coo }
  ];

  const managers = [
    { name: "Junmar N. Verdejo, CPA", role: "Compliance Manager", image: compliance },
    { name: "Katrina Amor D. Corpus", role: "National Sales & Distribution Manager", image: sales },
    { name: "Christine O. Mercado", role: "Marketing Manager", image: marketing },
    { name: "Hervie Ivy O. Saquilayan", role: "HRAD Manager", image: hrad },
    { name: "Loida F. Salvaña", role: "Accounting Manager", image: accounting },
    { name: "Genevieve R. Tagaylo", role: "Finance Manager", image: finance },
    { name: "Romeo U. Odarve Jr.", role: "IT Manager", image: it },
   
  ];

  return (
    <div className="bg-brand-surface min-h-screen pb-24">
      <PageHeader 
        title="Top Management" 
        subtitle="Our leadership team is dedicated to providing peace of mind and security to every Filipino household."
      />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Executive Leadership Section */}
          <Reveal direction="bottom">
            <div className="text-center mb-16">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase tracking-wider">
                Executive Leadership
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
          </Reveal>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 mb-28">
  {executives.map((exec, index) => (
    <div
      key={index}
      className={index === 0 ? "md:col-span-2 flex justify-center" : "px-10"}
    >
      <DirectorCard {...exec} delay={index * 0.1} />
    </div>
  ))}
</div>

          {/* Departmental Managers Section */}
          <Reveal direction="bottom">
            <div className="text-center mb-16">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase tracking-wider">
                Departmental Managers
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {managers.map((mgr, index) => (
              <DirectorCard key={index} {...mgr} delay={index * 0.05} />
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default TopManagement;