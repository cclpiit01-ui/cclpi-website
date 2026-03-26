
import angelicaFlower from "@/assets/angelica-flower.png";
import Angelica from "@/assets/angelica.png";
import { Reveal } from "@/components/animation/Reveal";


export default function ProductHero() {
  return (
    <div
      className="relative w-full bg-cover bg-center
                h-35
                sm:h-64
                md:h-60 md:px-5
                lg:h-[500px]
               "
      style={{ backgroundImage: `url(${angelicaFlower})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#013F99] via-[#2c5faa]/80to-transparent"></div>

      {/* CONTENT */}
     
      <div className="relative max-w-6xl mx-auto
                      pt-2 px-2
                      md:py-6
                      lg:py-15
                      ">
      <Reveal direction="left">
      <img
            src={Angelica}
            alt="Angelica Life Plan"
            className="h-18 mb-3
                       sm:h-22
                       md:h-32
                       lg:h-60
                        w-auto
                        lg:mb-5"
          />
      <div className="border-l-4 border-white pl-4 mb-4">
        <p className="text-white font-medium leading-tight
                      text-sm       {/* Mobile: text-lg */}
                      md:text-xl   {/* Tablet: text-2xl */}
                      lg:text-3xl
                      "> {/* Desktop: text-4xl */}
          
          A fixed value life plan with increasing memorial <br  />
          service benefits.
        </p>
      </div>
      </Reveal>
    
      </div>
    </div>
  );
}
