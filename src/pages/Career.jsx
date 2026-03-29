import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase"; // Palitan ang path base sa setup mo
import { Reveal } from "@/components/animation/Reveal";
import PageHeader from "@/components/ui/PageHeader";
import CareerCard from "@/components/ui/CareerCard";
import { FeaturedHiringAds } from "@/components/ui/FeaturedHiringAds";

export default function Career() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHiringJobs();
  }, []);

  async function fetchHiringJobs() {
    try {
      setLoading(true);
      
      // Kukuha lang ng data kung saan ang status ay 'hiring'
      const { data, error } = await supabase
        .from('jobs') // Pangalan ng table mo sa Supabase
        .select('*')
        .eq('status', 'hiring') 
        .order('created_at', { ascending: false }); // Pinakabago ang mauuna

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader 
        title="Careers" 
        subtitle="Build your future with us. We value talent, dedication, and heart." 
      />

      <section className="py-24 px-6 bg-brand-surface">
        <div className="max-w-7xl mx-auto">
          <Reveal direction="bottom">
            <div className="text-center mb-20">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase tracking-tight">
                Current Openings
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
          </Reveal>

          {loading ? (
            <div className="text-center py-20 text-slate-400 font-bold animate-pulse uppercase tracking-widest">
              Loading Opportunities...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <Reveal key={job.id} direction="bottom">
                    <CareerCard 
                      position={job.position}
                      area_assign={job.area_assign}
                      description={job.description}
                      job_brief={job.job_brief}
                      educational_requirements={job.educational_requirements}
                      competencies={job.competencies}
                    />
                  </Reveal>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 italic">No active job postings at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <FeaturedHiringAds />

      {/* Hiring Process / CTA */}
      <section className="py-20 bg-white text-center px-6 border-t border-slate-100">
        <Reveal direction="bottom">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-brand-primary mb-4 uppercase tracking-tight">
              Not finding what you're looking for?
            </h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Send your resume to <span className="text-brand-accent font-bold">cclpi.career@gmail.com</span>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}