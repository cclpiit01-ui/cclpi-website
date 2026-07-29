import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import TwoButtons from "@/components/buttons/TwoButtons";
import patternBg from "@/assets/pattern-bg.png";
import { BANNER_BASE } from "@/utils/bannerStyles";

const BannerFour = () => {
  return (
    <div className={`${BANNER_BASE} bg-[#013F99] group`}>
      
      {/* --- BACKGROUND LAYER (The Pattern) --- */}
      <div className="absolute inset-0 z-0 opacity-15 grayscale-[30%]">
        <img 
          src={patternBg} 
          alt="" 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#013F99] via-[#013F99]/60 to-transparent" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        
        <div className="max-w-3xl">
          <Reveal direction="left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1.5 bg-brand-accent rounded-full" />
              <span className="text-white font-black uppercase tracking-[0.3em] text-sm md:text-base">
                Product Innovation
              </span>
            </div>
          </Reveal>

          <Reveal direction="up">
            <h1 className="text-white font-black leading-tight text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter mb-8">
              INTRODUCING <br /> 
              <span className="text-brand-accent italic">ANGELICA 7 & 10</span>
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="flex items-start gap-4 mb-10 border-l-8 border-brand-accent pl-6">
              <p className="text-white/90 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                Experience flexible protection tailored for your needs. Secure your family's future with our most innovative pre-need products yet.
              </p>
            </div>
          </Reveal>

          <TwoButtons />
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-transparent to-transparent opacity-30" />
    </div>
  );
};

export default BannerFour;