import Banner from "@/components/ui/Banner";
import Statistics from "@/components/ui/Statistics";
import KeyBenefits from "@/components/ui/KeyBenefits";
import ViewProduct from "@/components/ui/ViewProduct";
import HomeAboutPreview from "@/pages/homepage/HomeAboutPreview";
import HomeNews from "@/components/ui/HomeNews";
import SEO from "@/components/seo/SEO";
import AngelicaPlansPremium from "@/pages/homepage/AngelicaPlansPremium";

const Home = () => {
  return (
    <>
      <SEO
        title="Affordable Memorial Life Plan in the Philippines"
        description="Cosmopolitan Climbs Life Plan Inc. offers affordable memorial life plans with nationwide service coverage. Secure your family's future today."
        keywords="life plan philippines, memorial life plan philippines, pre need plan philippines, funeral plan philippines, affordable memorial plan, cclpi life plan, cosmo climbs life plan"
        url="https://cclpi.com.ph/"
        image="https://cclpi.com.ph/cover.jpg"
      />

      <Banner />
      <Statistics />
      <HomeNews />
      <KeyBenefits />
      <AngelicaPlansPremium />
      <HomeAboutPreview />
      <ViewProduct />
      
    </>
  );
};

export default Home;