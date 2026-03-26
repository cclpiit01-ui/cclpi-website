import React from 'react';
import CountingNumber from "@/components/animation/CountingNumber";
import { Reveal } from "@/components/animation/Reveal";

const Statistics = () => {
  const stats = [
    { number: 435, suffix: "+", label: "Funeral Service Provider" },
    { number: 2, suffix: "B+", label: "Sold Contract Price Nationwide" },
    { number: 24, suffix: "/7", label: "Customer Support" },
    { number: 150, suffix: "%", label: "Max Memorial Service Benefits" },
  ];

  return (
    <section className="bg-brand-surface py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={index} direction="bottom" delay={index * 0.1}>
              <div className="flex flex-col items-center text-center">
                
                {/* Stat Number with Counting Animation */}
                <h2 className="text-brand-primary font-heading font-black 
                               text-4xl md:text-5xl lg:text-6xl flex items-baseline">
                  <CountingNumber end={stat.number} duration={2000} />
                  <span className="text-brand-primary">{stat.suffix}</span>
                </h2>
                
                {/* Stat Label - Poppins/Sans */}
                <p className="text-brand-secondary mt-2 font-sans font-bold uppercase tracking-widest
                              text-[10px] md:text-xs">
                  {stat.label}
                </p>

                {/* Decorative underline */}
                <div className="w-8 h-1 bg-brand-accent mt-4 rounded-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;