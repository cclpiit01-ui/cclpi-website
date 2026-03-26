import { Reveal } from "@/components/animation/Reveal"; 


const HeroSection= () => {
  return (
    <div className="bg-white">

      <section className="bg-gradient-to-br from-brand-surface via-white to-brand-surface py-28 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          
          <Reveal direction="bottom">
            <h2 className="mt-6 font-heading text-4xl md:text-5xl lg:text-6xl font-black text-brand-primary leading-tight uppercase">
            
              Cosmopolitan CLIMBS Life Plan, Inc.
            </h2>

            <div className="w-24 h-1.5 bg-brand-accent mx-auto mt-8 rounded-full"></div>

            <p className="mt-10 text-lg text-gray-600 leading-relaxed">
              A trusted life plan provider built from the strong foundation of
              insurance expertise and memorial service excellence — committed
              to serving Filipino families nationwide.
            </p>
          </Reveal>

        </div>
      </section>

       </div>
  );
};

export default HeroSection;