
import { Reveal } from "@/components/animation/Reveal";
import CountingNumber from "@/components/animation/CountingNumber"; 

const ServiceStats = () => {
  const mapUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiFsp8VogPzH_fW2Vn7xBLC61YFNwQd_avow&s";

  return (
    <section className="relative py-24 bg-[#f8f9fa] overflow-hidden border-y border-slate-200">
      {/* BACKGROUND LAYERS */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{ 
          backgroundImage: `url(${mapUrl})`,
          backgroundRepeat: 'repeat'
        }}
      ></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#f8f9fa_90%)]"></div>

      {/* CONTENT */}
      <Reveal direction="bottom">
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-6xl font-black text-slate-800 mb-4 tracking-tight">
            <span className="text-brand-primary">
              <CountingNumber end={435} />
            </span>+ Service Providers
          </h2>
          
          <div className="flex justify-center mb-8">
            <div className="h-1.5 w-16 bg-brand-accent rounded-full"></div>
          </div>
          
          <p className="text-lg md:text-2xl text-slate-600 font-semibold tracking-wide">
            Trusted by over <span className="text-slate-900 font-bold">
              <CountingNumber end={400} />+
            </span> accredited mortuaries nationwide.
          </p>
        </div>
      </Reveal>
    </section>
  );
};

export default ServiceStats;