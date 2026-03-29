import React from 'react';
import { Reveal } from "@/components/animation/Reveal";
import CareerCard from "@/components/ui/CareerCard";
import { BriefcaseIcon } from "lucide-react";

// FIX: Removed onApply prop — CareerCard now handles its own modal internally
export const OfficeJobs = ({ jobs }) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">

        <Reveal direction="bottom">
          <div className="text-center mb-16">
            <h2 className="text-brand-primary font-heading font-black text-3xl uppercase tracking-tight">
              Office Opportunities
            </h2>
            <div className="w-16 h-1 bg-brand-accent mt-4 rounded-full mx-auto" />
          </div>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="w-full max-w-sm transform transition-all duration-300 hover:-translate-y-2">
                <Reveal direction="bottom">
                  {/* FIX: No onApply needed — modal is inside CareerCard */}
                  <CareerCard
                    position={job.position}
                    area_assign={job.area_assign}
                    description={job.description}
                    job_brief={job.job_brief}
                    educational_requirements={job.educational_requirements}
                    competencies={job.competencies}
                  />
                </Reveal>
              </div>
            ))
          ) : (
            <Reveal direction="bottom">
              <div className="text-center py-16 px-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 max-w-2xl mx-auto w-full">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BriefcaseIcon className="text-slate-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  No current office openings
                </h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                  We don't have any vacancies at the moment, but we're always looking for great talent. Send your resume for future opportunities!
                </p>
                <a
                  href="mailto:hr@cclpi.com.ph"
                  className="inline-block bg-brand-primary text-white font-bold px-8 py-3 rounded-full hover:bg-brand-accent hover:text-brand-primary transition-all uppercase text-[10px] tracking-widest shadow-lg"
                >
                  Submit Resume
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};
