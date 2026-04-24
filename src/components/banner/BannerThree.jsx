import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import TwoButtons from "@/components/buttons/TwoButtons";
/* Pwede kang gumamit ng generic abstract background o icon-based pattern */
import patternBg from "@/assets/pattern-bg.png"; 

const BannerThree = () => {
  return (
    <div className="relative w-full h-full bg-[#013F99] flex items-center overflow-hidden group">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* Isang subtle abstract pattern para hindi boring ang solid blue */}
        <div className="absolute inset-0 opacity-20 grayscale transition-transform duration-[2000ms] group-hover:scale-110"
             style={{ backgroundImage: `url(${patternBg})`, backgroundSize: 'cover' }} />
        
        {/* Glowing Orbs for modern feel */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[10%] w-[400px] h-[400px] bg-[#2c5faa]/30 rounded-full blur-[100px]" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#013F99] via-[#013F99]/60 to-transparent" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        
        <div className="max-w-3xl">
          <Reveal direction="left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1.5 bg-brand-accent rounded-full" />
              <span className="text-white font-black uppercase tracking-[0.3em] text-sm md:text-base">
                Commitment to Service
              </span>
            </div>
          </Reveal>

          <Reveal direction="up">
            <h1 className="text-white font-black leading-tight
                          text-4xl
                          md:text-6xl
                          lg:text-7xl
                          uppercase tracking-tighter mb-8">
              FAST & <span className="text-brand-accent italic">RELIABLE</span> <br /> 
              CLAIMS PROCESS
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="flex items-start gap-4 mb-10 border-l-8 border-brand-accent pl-6">
              <p className="text-white/90 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                We understand the importance of time. Our streamlined system 
                ensures that your benefits are delivered when you need them most.
              </p>
            </div>
          </Reveal>

          {/* Consistent buttons across all 3 banners */}
          <TwoButtons />
        </div>

      </div>

      {/* Aesthetic Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-transparent to-transparent opacity-30" />
    </div>
  );
};

export default BannerThree;