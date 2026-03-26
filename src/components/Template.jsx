import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animation/Reveal";


// src/pages/Career.jsx
export default function Template() {
    return (
        <>
        {/* Page Header */}
        <PageHeader
          title="Career"
          subtitle=" Do meaningful work with a team that has your back. "
        />
        {/* Page Content */}
        <section className="py-24 px-6 bg-white"> {/* O bg-brand-surface kung alternating colors */}
          <div className="max-w-6xl mx-auto">
          <Reveal direction="bottom">
            <div className="text-center mb-16">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
                ANG IYONG TITLE
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
          </Reveal>
          </div>
        </section>
        
      </>
    )
  }
  