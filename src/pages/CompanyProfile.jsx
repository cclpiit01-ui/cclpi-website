import React from "react";

// Components - UI/Global
import PageHeader from "@/components/ui/PageHeader";
// import { Reveal } from "@/components/animation/Reveal";

// Components - Section Specific
import HeroSection from "./companyProfile/HeroSection";
import OurStorySection from "./companyProfile/OurStorySection";
import FoundingPartners from "./companyProfile/FoundingPartners";
import GrowthAndReach from "./companyProfile/GrowthAndReach";
// import MissionVision from "./companyProfile/MissionVision";
import ExploreButton from "./companyProfile/ExploreButton";

const CompanyProfile = () => {
  return (
    <main className="bg-white min-h-screen">
      <PageHeader
        title="Company Profile"
        subtitle="Built on strong foundations of insurance expertise and memorial service excellence, CCLPI Plans is committed to protecting Filipino families nationwide."
      />

      <section id="hero">
        <HeroSection />
      </section>

      <section id="our-story">
        <OurStorySection />
      </section>

      <section id="partners">
        <FoundingPartners />
      </section>

      <section id="growth">
        <GrowthAndReach />
      </section>

      {/* <section id="mission-vision" className="py-16">
        <Reveal direction="bottom">
          <MissionVision />
        </Reveal>
      </section> */}

      <section id="cta">
        <ExploreButton />
      </section>
    </main>
  );
};

export default CompanyProfile;