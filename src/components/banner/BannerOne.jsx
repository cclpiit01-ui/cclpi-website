import bannerBg from "@/assets/banner-bg.png";
import Angelica from "@/assets/angelica.png";
import TwoButtons from "@/components/buttons/TwoButtons";
import { Reveal } from "@/components/animation/Reveal";

export default function BannerOne() {
  return (
    <div
      className="relative w-full h-full bg-cover bg-center flex items-center overflow-hidden group"
      style={{ backgroundImage: `url(${bannerBg})` }}
    >
      {/* Gradient overlay - Pinantay natin ang opacity sa BannerTwo */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#013F99] via-[#013F99]/60 to-transparent pointer-events-none" />

      {/* CONTENT - Standardized with BannerTwo layout */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-12">

        <Reveal direction="left">
          {/* Angelica Logo */}
          <img
            src={Angelica}
            alt="Angelica Life Plan"
            className="h-[80px]
                       sm:h-[100px]
                       md:h-32
                       lg:h-60
                       w-auto
                       mb-6 lg:mb-8 transition-transform duration-700 group-hover:scale-105"
          />
        </Reveal>

        <Reveal direction="right">
          {/* Binago natin:
              1. border-white -> border-brand-accent (Yellow)
              2. border-l-4 -> border-l-8 (para mas premium tignan)
          */}
          <div className="border-l-8 border-brand-accent pl-6 mb-10 max-w-4xl">
            <p className="text-white font-black leading-tight
                          text-xl
                          md:text-3xl
                          lg:text-4xl
                          uppercase tracking-tight">
              Your partner in protecting your <br className="hidden md:block" />
              family's future and lasting <br className="hidden md:block" />
              <span className="text-brand-accent italic">peace of mind.</span>
            </p>
          </div>
        </Reveal>

        {/* Gagamitin nito ang bagong TwoButtons component 
            na may rounded-full design.
        */}
        <TwoButtons />

      </div>

      {/* Aesthetic Accent - Para consistent sa BannerTwo bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-transparent to-transparent opacity-30" />
    </div>
  );
}