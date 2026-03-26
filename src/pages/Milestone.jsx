import PageHeader from "@/components/ui/PageHeader";
import CompanyMilestone from "./milestone/CompanyMilestone";
import SEO from "@/components/seo/SEO";

const Milestone = () => {
  return (
    <>
      <SEO
        title="Company Milestone"
        description="Explore the milestones of Cosmopolitan Climbs Life Plan Inc. and discover our journey of growth, stability, and commitment to serving families across the Philippines."
        keywords="CCLPI milestone, Cosmopolitan Climbs history, life plan company Philippines, memorial plan company history"
        url="https://cclpi.com.ph/about/milestone"
        image="https://cclpi.com.ph/cover.jpg"
      />

      <div className="bg-brand-surface min-h-screen">
        <PageHeader
          title="Company Milestone"
          subtitle="Our journey of compassion, stability, and growth through the years."
        />

        <section className="py-24 px-6 relative">
          <CompanyMilestone />
        </section>
      </div>
    </>
  );
};

export default Milestone;