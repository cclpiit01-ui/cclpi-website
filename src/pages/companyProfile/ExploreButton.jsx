
import { Reveal } from "@/components/animation/Reveal";

const ExploreButton = () => {
  return (
    <div className="bg-white">

     <section className="py-24 px-6 md:px-12 lg:px-24 text-center">
        <Reveal direction="bottom">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-primary">
            Secure Your Family’s Future Today
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Discover how Angelica Life Plan can provide dignity,
            protection, and peace of mind.
          </p>

          <div className="mt-10">
            <a
              href="/products"
              className="inline-flex items-center bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
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
