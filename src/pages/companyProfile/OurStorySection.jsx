import TeamPhoto from "@/assets/Cclpipic.png";
import { Reveal } from "@/components/animation/Reveal";

const OurStorySection = () => {
  return (
    <div className="bg-white">

 <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">

          <Reveal direction="bottom">
            
            <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
              Our Story of Growth
            </h2>
            <div className="w-20 h-1.5 bg-brand-accent mt-6 rounded-full"></div>

            <p className="mt-10 text-lg text-gray-600 leading-relaxed">
              Founded on December 7, 2016, in Cagayan de Oro City, 
              Cosmopolitan Climbs Life Plan, Inc. (CCLPI Plans) was established 
              through the strategic partnership of two respected institutions —
              CLIMBS Life and General Insurance Cooperative and 
              Cosmopolitan Funeral Homes, Inc.
            </p>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              The company was built with a vision to provide meaningful,
              accessible, and affordable memorial service coverage to Filipino
              families, ensuring dignity, preparedness, and peace of mind
              during life’s most difficult moments.
            </p>
          </Reveal>
          <Reveal direction="bottom">
        <div className="relative pt-[50px]">
          <img
            src={TeamPhoto}
            alt="Company Preview"
            className="w-full h-[500px] object-cover  shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      </Reveal>

        </div>
      </section>
 </div>
  );
};

export default OurStorySection;