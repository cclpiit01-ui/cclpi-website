import bannerBg from "@/assets/banner-bg.png";
import Angelica from "@/assets/angelica.png";
import TwoButtons from "@/components/buttons/TwoButtons";
import { Reveal } from "@/components/animation/Reveal";
import { BANNER_BASE } from "@/utils/bannerStyles";

export default function BannerOne() {
  return (
    <div
      className={`${BANNER_BASE} bg-cover bg-top sm:bg-center group`}
      style={{ backgroundImage: `url(${bannerBg})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#013F99] via-[#013F99]/60 to-transparent pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        <Reveal direction="left">
          <img
            src={Angelica}
            alt="Angelica Life Plan"
            className="h-[80px] sm:h-[100px] md:h-32 lg:h-60 w-auto mb-6 lg:mb-8 transition-transform duration-700 group-hover:scale-105"
          />
        </Reveal>

        <Reveal direction="right">
          <div className="border-l-8 border-brand-accent pl-6 mb-10 max-w-4xl">
            <p className="text-white font-black leading-tight text-xl md:text-3xl lg:text-4xl uppercase tracking-tight">
              Your partner in protecting your <br className="hidden md:block" />
              family's future and lasting <br className="hidden md:block" />
              <span className="text-brand-accent italic">peace of mind.</span>
            </p>
          </div>
        </Reveal>

        <TwoButtons />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-transparent to-transparent opacity-30" />
    </div>
  );
}