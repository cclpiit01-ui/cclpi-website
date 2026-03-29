import { Reveal } from "@/components/animation/Reveal";
import { Milestone, Trophy, Rocket, TrendingUp, Handshake, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

const MilestoneCard = ({ year, title, desc, icon, isLeft }) => (
  <div className={`flex flex-col md:flex-row items-center w-full mb-28 py-10 
  ${isLeft ? 'md:flex-row bg-white/40' : 'md:flex-row-reverse bg-slate-50/60'} rounded-3xl`}>

    {/* LEFT/RIGHT SIDE: LARGE YEAR DISPLAY (Replacing Image) */}
    <div className="w-full md:w-5/12 mb-6 md:mb-0 px-6 flex justify-center items-center">
      <Reveal direction={isLeft ? "right" : "left"}>
        <div className="group relative flex items-center justify-center">
          {/* Decorative Circle behind the year */}
          <div className="absolute w-40 h-40 bg-brand-primary/5 rounded-full scale-150 group-hover:bg-brand-accent/10 transition-colors duration-500" />
          
          {/* Big Bold Year */}
          <span className="text-8xl md:text-9xl font-black text-brand-primary/10 tracking-tighter group-hover:text-brand-primary/20 transition-colors duration-500 select-none">
            {year}
          </span>
          
          {/* Small Floating Badge */}
          <div className="absolute bg-brand-primary text-white text-xs font-black px-4 py-1.5 rounded-full shadow-xl z-10 uppercase tracking-widest">
            Year {year}
          </div>
        </div>
      </Reveal>
    </div>

    {/* TIMELINE DOT + CONNECTOR */}
    <div className="hidden md:flex w-2/12 justify-center relative">
      <div className={`absolute top-1/2 h-[2px] w-16 bg-slate-300 
      ${isLeft ? '-left-16' : '-right-16'}`} />
      <div className="relative flex items-center justify-center z-10">
        <div className="absolute w-10 h-10 bg-brand-accent/30 rounded-full blur-md animate-pulse"></div>
        <div className="w-6 h-6 bg-brand-accent rounded-full border-4 border-white shadow-lg"></div>
      </div>
    </div>

    {/* CARD CONTENT */}
    <div className="w-full md:w-5/12 px-6">
      <Reveal direction={isLeft ? "left" : "right"}>
        <div className="group bg-white p-8 rounded-3xl shadow-md border-b-8 border-brand-primary hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-brand-surface text-brand-primary rounded-2xl 
            group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 rotate-3 group-hover:rotate-0 shadow-sm">
              {icon}
            </div>
            {/* Year is removed here as requested */}
            <div className="h-1 w-12 bg-brand-accent rounded-full" />
          </div>

          <h3 className="text-brand-primary font-heading font-black text-2xl uppercase mb-3 tracking-tight leading-tight">
            {title}
          </h3>

          <p className="text-slate-600 font-sans leading-relaxed text-sm">
            {desc}
          </p>
        </div>
      </Reveal>
    </div>
  </div>
);

export default function CompanyMilestone() {
  const milestones = [
    {
      year: "2016",
      title: "Foundation of a Mission",
      desc: "CCLPI Plans was officially founded and registered. A vision born to bring security to every Filipino household.",
      icon: <Rocket size={24} />,
    },
    {
      year: "2017",
      title: "The Beginning of Service",
      desc: "Received our Pre-Need License from the Insurance Commission, granting us the authority to serve families nationwide.",
      icon: <Milestone size={24} />,
    },
    {
      year: "2018",
      title: "Angelica Life Plan Launch",
      desc: "Officially launched our flagship product, allowing families to prepare for the future with confidence and dignity.",
      icon: <Building2 size={24} />,
    },
    {
      year: "2019",
      title: "Building Partnership",
      desc: "Strengthened our foundation by forming partnerships with the cooperative sector, expanding our reach and service.",
      icon: <Handshake size={24} />,
    },
    {
      year: "2020",
      title: "Unwavering Resilience",
      desc: "Despite the global pandemic, CCLPI stood strong, reaching ₱456 Million in total sales through resilience.",
      icon: <TrendingUp size={24} />,
    },
    {
      year: "2021",
      title: "The Billion Milestone",
      desc: "Total GCP surpassed ₱1 Billion, achieving a total of ₱672.11 Million in sales premium. A major leap in reach.",
      icon: <Trophy size={24} />,
    },
    {
      year: "2022",
      title: "A Time of Challenge",
      desc: "Though this year tested us, it also made us stronger. We learned, reflected, and prepared for a better future.",
      icon: <ShieldAlert size={24} />,
    },
    {
      year: "2023",
      title: "Moving Into Growth",
      desc: "Focused on stability and sustainability — reinforcing our place as a cornerstone in the pre-need industry.",
      icon: <TrendingUp size={24} />,
    },
    {
      year: "2024",
      title: "Becoming the Better Choice",
      desc: "Continuing to grow through innovation and trust. Committed to being the better choice for families.",
      icon: <Sparkles size={24} />,
    }
  ];

  return (
    <div className="bg-brand-surface min-h-screen">
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <Reveal direction="bottom">
            <div className="text-center mb-20">
              <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
                Our Path to Excellence
              </h2>
              <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
            </div>
          </Reveal>

          {/* TIMELINE */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-[3px] bg-slate-200 -translate-x-1/2 hidden md:block" />
            {milestones.map((ms, index) => (
              <MilestoneCard
                key={ms.year}
                {...ms}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>

          {/* FOOTER MESSAGE */}
          <Reveal direction="bottom">
            <div className="mt-24 text-center p-12 bg-brand-primary rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <h3 className="text-3xl font-heading font-black uppercase mb-4">
                The Future is Secure
              </h3>
              <p className="max-w-2xl mx-auto text-white/70 font-sans leading-relaxed pb-8">
                As we move forward, our commitment remains the same: to protect your family's future with integrity.
              </p>
              <a
                href="/products"
                className="inline-flex items-center bg-brand-accent hover:bg-brand-secondary text-white font-semibold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started Today
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}