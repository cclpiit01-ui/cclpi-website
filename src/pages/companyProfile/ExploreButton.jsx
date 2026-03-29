import { Reveal } from "@/components/animation/Reveal";

const ExploreButton = () => {
  return (
    /* Pinalitan ang bg-white ng bg-brand-primary */
    <div className="bg-brand-primary relative overflow-hidden">
      
      {/* Subtle background decoration para hindi masyadong flat */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-accent rounded-full blur-3xl" />
      </div>

      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-24 text-center">
        <Reveal direction="bottom">
          {/* Ginawang text-white ang main heading */}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
            Secure Your Family’s Future Today
          </h2>

          {/* Ginawang text-white/80 para sa magandang visual hierarchy */}
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Discover how Angelica Life Plan can provide dignity,
            protection, and peace of mind.
          </p>

          <div className="mt-12">
            <a
              href="/products"
              /* In-invert ang button color: White bg na may primary text */
              className="inline-flex items-center bg-white hover:bg-brand-accent text-brand-primary font-black py-5 px-12 rounded-full shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              Explore Angelica Life Plan
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default ExploreButton;