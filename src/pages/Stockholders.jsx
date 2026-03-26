import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import { ExternalLink } from 'lucide-react';

// Import all logos
import acdi from "@/assets/stockholders/acdi.png";
import aimcoop from "@/assets/stockholders/aimcoop.png";
import bdmpc from "@/assets/stockholders/bdmpc.png";
import cifc from "@/assets/stockholders/cifc.png";
import climbs from "@/assets/stockholders/climbs.png";
import cosmo from "@/assets/stockholders/cosmo.png";
import guadalupe from "@/assets/stockholders/guadalupe.png";
import incomeDavao from "@/assets/stockholders/income-davao.png";
import metroOrmoc from "@/assets/stockholders/metro-ormoc.png";
import oic from "@/assets/stockholders/oic.png";
import phcci from "@/assets/stockholders/phcci.png";
import sanfernando from "@/assets/stockholders/sanfernando.png";
import scc from "@/assets/stockholders/scc.png";
import stalucia from "@/assets/stockholders/stalucia.png";
import tagum from "@/assets/stockholders/tagum.png";
import tanHassani from "@/assets/stockholders/tan-hassani.png";
import toril from "@/assets/stockholders/toril.png";

const stockholdersList = [
  { name: "ACDI Multipurpose Cooperative", logo: acdi, website: "https://www.acdimpc.com.ph" },
  { name: "AIMCOOP", logo: aimcoop, website: "https://www.aimcoop.com" },
  { name: "BDMPC", logo: bdmpc, website: "#" },
  { name: "CIFC", logo: cifc, website: "#" },
  { name: "CLIMBS Life and General Insurance Cooperative", logo: climbs, website: "https://www.climbs.coop" },
  { name: "Cosmopolitan Memorial Chapels", logo: cosmo, website: "https://cosmopolitanmemorial.com/" },
  { name: "Guadalupe Cooperative", logo: guadalupe, website: "#" },
  { name: "Income Credit Cooperative", logo: incomeDavao, website: "#" },
  { name: "Metro Ormoc Community Cooperative", logo: metroOrmoc, website: "#" },
  { name: "Oro Integrated Cooperative", logo: oic, website: "#" },
  { name: "PHCCI Central Cooperative", logo: phcci, website: "https://www.phcci.coop" },
  { name: "San Fernando Funerals", logo: sanfernando, website: "#" },
  { name: "Sta. Catalina Multipurpose Cooperative (SCC)", logo: scc, website: "#" },
  { name: "Sta. Lucia Realty & Development, Inc.", logo: stalucia, website: "#" },
  { name: "Tagum Cooperative", logo: tagum, website: "https://www.tagumcooperative.coop" },
  { name: "Tan-Hassani & Counsels", logo: tanHassani, website: "#" },
  { name: "Toril Community Cooperative", logo: toril, website: "#" },
];

export default function Stockholders() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader
        title="Stockholders Profile"
        subtitle="Strength in unity through our prestigious cooperative and corporate partners."
      />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <Reveal direction="bottom">
            <div className="text-center mb-16">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase ">
                Our Esteemed Stockholders
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
          </Reveal>

          {/* Flex Container for centered alignment */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 mt-12">
            {stockholdersList.map((partner, index) => (
              <Reveal key={index} delay={index * 0.05} direction="bottom">
                <div className="flex flex-col items-center w-64">
                  {/* Logo Card */}
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-brand-surface border border-slate-100 rounded-[2.5rem] p-8 h-48 w-full flex items-center justify-center shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:border-brand-secondary/20 transition-all duration-500 overflow-hidden mb-4"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="relative z-10 max-h-full max-w-full object-contain mx-auto transition-all duration-500 transform group-hover:scale-110"
                    />
                    
                    {/* Floating External Icon on Hover */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                      <ExternalLink size={14} className="text-brand-accent" />
                    </div>
                  </a>

                  {/* Company Name Under the Logo */}
                  <div className="text-center px-2">
                    <h4 className="text-brand-primary font-bold text-xs uppercase tracking-wider leading-tight min-h-[32px] flex items-center justify-center">
                      {partner.name}
                    </h4>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal direction="bottom">
            <div className="bg-brand-primary rounded-[3.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden border-b-[15px] border-brand-secondary shadow-2xl">
              <div className="relative z-10">
                <h3 className="font-heading font-black text-3xl md:text-4xl uppercase italic mb-4">
                  Driven by Corporate Integrity
                </h3>
                <p className="text-blue-100 max-w-2xl mx-auto font-medium text-lg leading-relaxed pb-6">
                  Our diverse group of stockholders ensures stability, transparency, 
                  and a long-term commitment to serving our plan holders with excellence.
                </p>
                <a 
                  href="/about/bod" 
                  className="inline-block bg-brand-accent hover:bg-white hover:text-brand-primary text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 uppercase tracking-wider text-sm shadow-lg"
                >
                  Meet Our Board
                </a>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}