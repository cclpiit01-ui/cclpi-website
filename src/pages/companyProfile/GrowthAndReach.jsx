import React from "react";
import { Reveal } from "@/components/animation/Reveal";
const GrowthAndReach = () => {

    return (
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">

          <Reveal direction="bottom">
          <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
              
              Our Reach and Impact
            </h2>
            <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-6 rounded-full"></div>

            <div className="mt-14 grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-6xl font-bold text-brand-primary">435+</h3>
                <p className="mt-2 text-gray-500">Accredited Service Providers</p>
              </div>
              <div>
                <h3 className="text-6xl font-bold text-brand-primary">2 BILLION +</h3>
                <p className="mt-2 text-gray-500">Gross Contract Price Sold</p>
              </div>

            </div>

          </Reveal>

        </div>
      </section>
    );
};

export default GrowthAndReach;