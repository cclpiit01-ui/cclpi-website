import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import agentImg from "@/assets/banner-2.png";

const BannerTwo = () => {
  return (
    <div className="relative w-full h-full bg-[#013F99] flex items-center overflow-hidden">
      
      {/* --- BACKGROUND LAYER (The Transparent Model) --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={agentImg} 
          alt="CCLPI Agent" 
          /* In-adjust natin: 
             - object-right: Para laging dikit sa kanan ang model.
             - opacity-90: Dahil transparent PNG ito, pwede nating taasan ang opacity 
               para mas malinaw ang face kumpara sa dati.
          */
          className="w-full h-full object-contain lg:object-cover object-right grayscale-[10%] opacity-90 transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Subtle Overlay: Para lang masiguradong readable ang text sa kaliwa */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#013F99] via-[#013F99]/30 to-transparent" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        
        <div className="max-w-3xl">
          <Reveal direction="left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1.5 bg-brand-accent rounded-full" />
              <span className="text-white font-black uppercase tracking-[0.3em] text-sm md:text-base">
                Join the Team
              </span>
            </div>
          </Reveal>

          <Reveal direction="up">
            <h1 className="text-white font-black leading-tight
                          text-4xl
                          md:text-6xl
                          lg:text-7xl
                          uppercase tracking-tighter mb-8">
              BE A <span className="text-brand-accent italic text-shadow-sm">DEDICATED</span> <br /> 
              SALES COUSELOR
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="flex items-start gap-4 mb-10 border-l-4 border-brand-accent pl-6">
              <p className="text-white/90 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                Start a rewarding career with one of  the most trusted pre-need life plans. 
                Help families secure their future while you build yours.
              </p>
            </div>
          </Reveal>

          <Reveal direction="bottom" delay={0.4}>
            <div className="flex flex-wrap gap-4 mt-10">
              <a 
                href="/career" 
                className="bg-brand-accent hover:bg-white text-brand-primary font-black py-4 px-10 rounded-full shadow-2xl transition-all duration-300 uppercase tracking-widest text-sm"
              >
                Join the Mission
              </a>
              <a 
                href="/products" 
                className="border-2 border-white/30 hover:border-white text-white font-black py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-widest text-sm backdrop-blur-sm"
              >
                Learn More
              </a>
            </div>
          </Reveal>
        </div>

      </div>

      {/* Aesthetic Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-transparent to-transparent opacity-30" />
    </div>
  );
};

export default BannerTwo;