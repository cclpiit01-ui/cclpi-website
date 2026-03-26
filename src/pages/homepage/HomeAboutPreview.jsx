import TeamPhoto from "@/assets/Cclpipic.png";
import { Reveal } from "@/components/animation/Reveal";

const HomeAboutPreview = () => {
  return (
    <section className="bg-gradient-to-br from-brand-surface via-white to-brand-surface py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Image Side */}
        <Reveal direction="left">
        <div className="relative">
  
            {/* Glow */}
            <div className="absolute -inset-4 bg-brand-accent/20 rounded-3xl blur-2xl opacity-40"></div>

            {/* 4:6 Ratio Container */}
            <div className="relative aspect-[2/2] w-full overflow-hidden rounded-3xl shadow-2xl">
                <img
                src={TeamPhoto}
                alt="CCLPI Team"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
                </div>

            {/* Trust Badge */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-gray-100">
              <p className="text-sm font-semibold text-brand-primary">
                Trusted Pre-need Company
              </p>
              <p className="text-xs text-gray-500">
                2Billion+ Gross Contract Price Sold
              </p>
            </div>

          </div>
        </Reveal>

        {/* Text Side */}
        <Reveal direction="right">
          <div>
            
            {/* Section Label */}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[2px] bg-brand-accent" />
                <span className="text-brand-primary font-black tracking-[0.3em] text-[20px] uppercase font-sans">
                  About CCLPI PLANS
                </span>
              </div>


            {/* Heading */}
            <h2 className="mt-6 font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-brand-primary leading-[1.15]">
              A Legacy of Protection. <br />
              <span className="text-brand-secondary">
                A Commitment to Service.
              </span>
            </h2>

            {/* Accent Line */}
            <div className="w-20 h-1.5 bg-brand-accent mt-8 rounded-full"></div>

            {/* Description */}
            <p className="mt-8 text-gray-600 text-lg leading-relaxed">
              Cosmopolitan Climbs Life Plan, Inc. (CCLPI Plans) was formed
              through the union of CLIMBS Life and General Insurance Cooperative
              and Cosmopolitan Funeral Homes, Inc. — combining financial strength
              and memorial care excellence to serve Filipino families nationwide.
            </p>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              We provide dignified, affordable, and reliable life plan solutions
              designed to give peace of mind and protect families during life’s
              most important moments.
            </p>

            {/* Mini Trust Stats */}
            <div className="mt-10 grid grid-cols-2 gap-8 max-w-md">
              <div>
                <h4 className="text-3xl font-bold text-brand-primary">435+</h4>
                <p className="text-sm text-gray-500">
                  Accredited Providers
                </p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-brand-primary">2B+</h4>
                <p className="text-sm text-gray-500">
                2B+ Gross Contract Price Sold
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <a
                href="/about/company-profile"
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Explore Our Company Profile
              </a>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HomeAboutPreview;