import bannerBg from "@/assets/banner-bg.png";
import Angelica from "@/assets/angelica.png";
import TwoButtons from "@/components/buttons/TwoButtons";
import { Reveal } from "@/components/animation/Reveal";

export default function Banner() {
  return (
    <div
      className="relative w-full bg-cover
                 [background-position:70%_center]
                 sm:bg-center
                 lg:bg-center
                 min-h-[280px]
                 md:min-h-[384px]
                 lg:h-[700px]"
      style={{ backgroundImage: `url(${bannerBg})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#013F99] via-[#2c5faa]/80 to-transparent pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto
                      py-6 px-6
                      md:py-8
                      lg:py-30">

        <Reveal direction="left">
          <img
            src={Angelica}
            alt="Angelica Life Plan"
            className="h-[80px]
                       sm:h-[100px]
                       md:h-32
                       lg:h-60
                       w-auto
                       mb-3 lg:mb-5"
          />
        </Reveal>

        <Reveal direction="right">
          <div className="border-l-4 border-white pl-4 mb-5">
<p className="text-white font-medium leading-snug
              text-base
              md:text-xl
              lg:text-3xl">
  Your partner in protecting your family's future
  <br className="hidden md:block" />
  and lasting peace of mind.
</p>
          </div>
        </Reveal>

        <TwoButtons />

      </div>
    </div>
  );
}
