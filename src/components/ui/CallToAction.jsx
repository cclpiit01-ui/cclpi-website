import React from 'react';
import { PhoneCall, Headset } from 'lucide-react';

const CallToAction = () => {
  const phone1 = "+63 998 953 4937";
  const phone2 = "+63 917 154 3459";

  return (
    <div className="w-full mt-12 mb-20">
      <div className="bg-brand-primary rounded-[2.5rem] p-8 lg:p-12 shadow-xl relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-brand-secondary opacity-10 rounded-full"></div>
        <div className="absolute bottom-[-40px] left-[10%] w-32 h-32 bg-brand-accent opacity-20 rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Text Content */}
          <div className="text-center lg:text-left lg:max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-accent/20 border border-brand-accent/30 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
              </span>
              <span className="text-brand-accent text-xs font-bold uppercase tracking-wider">Available 24/7</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
              Need Immediate Assistance?
            </h2>
            <p className="text-blue-100 text-lg opacity-90">
              Our compassionate coordinators are ready to help you at any time.
            </p>
          </div>

          {/* Action Area: Buttons with Phone Numbers */}
          <div className="flex flex-col gap-4 w-full lg:w-auto min-w-[320px]">
            <div className="grid grid-cols-1 gap-3">
              
              {/* Phone 1 Button */}
              <button className="flex items-center gap-4 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary p-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 group cursor-default">
                <div className="bg-brand-primary/10 p-2 rounded-xl">
                  <PhoneCall size={20} className="group-hover:rotate-12 transition-transform" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold uppercase opacity-70 leading-none mb-1">Smart / TNT</span>
                  <span className="text-lg font-bold leading-none">{phone1}</span>
                </div>
              </button>

              {/* Phone 2 Button */}
              <button className="flex items-center gap-4 bg-white hover:bg-blue-50 text-brand-primary p-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 group cursor-default">
                <div className="bg-brand-primary/10 p-2 rounded-xl">
                  <PhoneCall size={20} className="group-hover:rotate-12 transition-transform" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold uppercase opacity-70 leading-none mb-1">Globe / TM</span>
                  <span className="text-lg font-bold leading-none">{phone2}</span>
                </div>
              </button>

              {/* Claims Hotline Button */}
              <button className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 rounded-2xl backdrop-blur-sm transition-all text-sm uppercase tracking-wide">
                <Headset size={18} />
                <span>Contact Claims Hotline</span>
              </button>
            </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-center lg:justify-start gap-6 opacity-60 text-white text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
            Fast Response
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
            Professional Guidance
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
            24/7 Support
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;