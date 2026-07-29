import { Reveal } from "@/components/animation/Reveal";
import {
  Target,
  Eye,
  Users,
  HeartHandshake,
  BadgeCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

const coreValues = [
  {
    icon: HeartHandshake,
    title: "Commitment to Service",
    letter: "C",
  },
  {
    icon: HeartHandshake,
    title: "Compassion with Dignity",
    letter: "C",
  },
  {
    icon: BadgeCheck,
    title: "Leadership through Integrity",
    letter: "L",
  },
  {
    icon: Trophy,
    title: "Pursuit of Excellence",
    letter: "P",
  },
  {
    icon: Sparkles,
    title: "Innovation for the Future",
    letter: "I",
  },
];

const MissionVision = () => (
  <section className="py-24 px-6 bg-brand-primary text-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Vision */}
      <Reveal direction="bottom">
        <div className="relative p-10 rounded-3xl bg-white/5 border border-white/10 overflow-hidden h-full">
          <Eye
            size={80}
            className="absolute -right-4 -top-4 opacity-10"
          />

          <h3 className="text-brand-accent font-heading font-black text-3xl mb-6 uppercase">
            Our Vision
          </h3>

          <p className="text-slate-200 leading-relaxed text-lg font-light">
            To be the Philippines’ most trusted and leading pre-need life plan
            provider, empowering every Filipino family—regardless of
            status—with accessible, innovative, and dignified life planning
            solutions that ensure preparedness, peace of mind, and lasting
            financial protection.
          </p>
        </div>
      </Reveal>

      {/* Mission */}
      <Reveal direction="bottom" delay={0.2}>
        <div className="relative p-10 rounded-3xl bg-white/5 border border-white/10 overflow-hidden h-full">
          <Target
            size={80}
            className="absolute -right-4 -top-4 opacity-10"
          />

          <h3 className="text-brand-accent font-heading font-black text-3xl mb-6 uppercase">
            Our Mission
          </h3>

          <p className="text-slate-200 leading-relaxed text-lg font-light">
            CCLPI Plans is committed to delivering affordable, reliable, and
            accessible pre-need life plans that provide Filipino families with
            financial security, dignity, and peace of mind, through efficient,
            innovative, and compassionate service grounded in integrity and
            excellence.
          </p>
        </div>
      </Reveal>

      {/* Core Values */}
      <Reveal direction="bottom" delay={0.4}>
        <div className="relative p-10 rounded-3xl bg-white/5 border border-white/10 overflow-hidden h-full">
          <Users
            size={80}
            className="absolute -right-4 -top-4 opacity-10"
          />

          <h3 className="text-brand-accent font-heading font-black text-3xl mb-8 uppercase">
            Core Values
          </h3>

          <div className="space-y-5">

            {coreValues.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 border-b border-white/10 pb-4"
              >
                <div className="w-12 h-12 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center font-black text-xl">
                  {item.letter}
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}

            <div className="mt-8 inline-flex items-center gap-3 bg-brand-accent text-brand-primary px-5 py-3 rounded-full font-black text-xl">
              <span>Plans</span>
              <span className="text-white text-base font-semibold">
                WITH PURPOSE
              </span>
            </div>

          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default MissionVision;