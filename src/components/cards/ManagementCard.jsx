import React from 'react';
import { Reveal } from "@/components/animation/Reveal";

const ManagementCard = ({ name, role, company, image, delay }) => {
  return (
    <Reveal direction="bottom" delay={delay}>
      <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 border-b-[10px] border-b-brand-primary border-brand-primary hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row items-center md:items-stretch h-full">
        
        {/* Image Container */}
        <div className="w-full md:w-38 lg:w-46 bg-brand-surface overflow-hidden shrink-0 relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover  group-hover:grayscale-0 transition-all duration-700 transform scale-100 group-hover:scale-110"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Info Container */}
        <div className="p-8 flex flex-col justify-center flex-grow text-center md:text-left">
          <div className="mb-2">
            <span className="text-brand-secondary font-sans font-black italic text-[8px] uppercase tracking-[0.2em] bg-brand-secondary/10 px-3 py-1 rounded-full">
              {role}
            </span>
          </div>
          
          <h3 className="text-brand-primary text-xl font-black text-2xl uppercase leading-tight mb-3 tracking-tight">
            {name}
          </h3>
          
          <div className="w-12 h-1 bg-brand-accent mb-4 rounded-full mx-auto md:mx-0 " />
          
          <p className="text-slate-500 font-sans text-sm leading-relaxed font-bold uppercase tracking-tighter opacity-80">
            {company}
          </p>
        </div>

      </div>
    </Reveal>
  );
};

export default ManagementCard;