import CosmoLogo from "@/assets/stockholders/cosmo.png";
import ClimbsLogo from "@/assets/stockholders/climbs.png";
import { Reveal } from "@/components/animation/Reveal";

const FoundingPartners = () => {
  return (
    <div className="bg-white">


<section className="bg-brand-surface py-28 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="text-center">
            <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
              Our Founding Institutions
            </h2>
            <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-6 rounded-full"></div>
          </div>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-12">

            {/* CLIMBS */}
            <Reveal direction="left">
            <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">

            {/* Logo */}
            <div className="h-24 flex items-center justify-center">
              <img
                src={ClimbsLogo}
                alt="CLIMBS Logo"
                className="max-h-20 object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="mt-8 font-heading text-xl font-bold text-brand-primary text-center min-h-[56px]">
              CLIMBS Life and General Insurance Cooperative
            </h3>

            {/* Description */}
            <p className="mt-6 text-gray-600 leading-relaxed text-center flex-grow">
              A champion of micro and grassroots insurance founded by the
              late Atty. Mordino Cua and Atty. Aquilino Pimentel Sr.,
              CLIMBS has grown into a cooperative managing billions in assets
              and serving millions of insured members nationwide.
            </p>

        </div>
        </Reveal>

        {/* COSMOPOLITAN */}

        <Reveal direction="left">
        <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">

        {/* Logo */}
        <div className="h-24 flex items-center justify-center">
          <img
            src={CosmoLogo}
            alt="COSMOPOLITAN Logo"
            className="max-h-20 object-contain"
          />
        </div>
        {/* Title */}
        <h3 className="mt-8 font-heading text-xl font-bold text-brand-primary text-center min-h-[56px]">
        Cosmopolitan Funeral Homes, Inc.
        </h3>

          {/* Description */}
          <p className="mt-6 text-gray-600 leading-relaxed text-center flex-grow">
          Established in 1950, Cosmopolitan Funeral Homes operates in over 22 key cities
          in the Philippines, delivering world-class memorial care, compassion, and dignified 
          service to families in their time of need.
          </p>

          </div>
          </Reveal>

      </div>

    {/* ===== CTA BUTTON ===== */}
    <Reveal direction="bottom">
    <div className="mt-20 text-center">
    <div className="flex flex-col sm:flex-row justify-center gap-6">

      {/* Primary Button */}
      <a
        href="/about/stockholders"
        className="inline-flex items-center justify-center 
        bg-brand-primary hover:bg-brand-secondary 
        text-white font-semibold 
        py-4 px-10 rounded-full 
        shadow-xl hover:shadow-2xl 
        transition-all duration-300"
      >
        See All Stockholders
      </a>

      {/* Secondary Button */}
      <a
        href="/about/bod"
        className="inline-flex items-center justify-center 
        border-2 border-brand-primary 
        text-brand-primary 
        hover:bg-brand-primary hover:text-white 
        font-semibold 
        py-4 px-10 rounded-full 
        transition-all duration-300"
      >
        View Board of Directors
      </a>

    </div>
  </div>
    </Reveal>

  </div>
</section>

 </div>
  );
};

export default FoundingPartners;