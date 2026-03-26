import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import CareerCard from "@/components/ui/CareerCard";

export default function Career() {
  const jobs = [
    {
      id: 1,
      type: "Full-Time",
      position: "Office & Operations Staff",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",
      description: "Responsible for day-to-day administrative tasks, document processing, and ensuring smooth office operations.",
      qualifications: [
        "Graduate of any 4-year business course",
        "Proficient in MS Office (Excel/Word)",
        "Strong attention to detail",
        "Excellent communication skills"
      ]
    },
    {
      id: 2,
      type: "Commission-Based",
      position: "Sales Counselor Agent",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop",
      description: "Drive company growth by counseling families on our memorial services. Enjoy unlimited income through high commissions.",
      qualifications: [
        "Dynamic personality and goal-oriented",
        "Experience in sales is an advantage",
        "Willing to work on flexible hours",
        "Strong networking skills"
      ]
    }
  ];

  return (
    <>
      <PageHeader 
        title="Careers" 
        subtitle="Build your future with us. We value talent, dedication, and heart." 
      />

      <section className="py-24 px-6 bg-brand-surface">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <Reveal direction="bottom">
            <div className="text-center mb-20">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
                Current Openings
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
          </Reveal>

          {/* Centered Grid for 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {jobs.map((job) => (
              <Reveal key={job.id} direction="bottom">
                <CareerCard {...job} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process / CTA */}
      <section className="py-20 bg-white text-center px-6">
        <Reveal direction="bottom">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-brand-primary mb-4">Not finding what you're looking for?</h3>
            <p className="text-slate-500 mb-8">Send your resume to <span className="text-brand-accent font-bold">hr@cclpi.com.ph</span> and we'll keep you in our talent pool for future openings.</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}