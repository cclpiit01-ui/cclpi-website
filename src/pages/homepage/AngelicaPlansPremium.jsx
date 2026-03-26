import React from "react";
import { ShieldCheck, HeartHandshake, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Angelica 5",
    years: "5 Years to Pay",
    description: "The classic Angelica Life Plan with faster completion and full memorial protection.",
    badge: "Original",
    badgeStyle: "outline",
  },
  {
    name: "Angelica 7",
    years: "7 Years to Pay",
    description: "Lower monthly installments with the same protection — a balanced payment option.",
    badge: "New",
    badgeStyle: "filled",
  },
  {
    name: "Angelica 10",
    years: "10 Years to Pay",
    description: "Our most affordable option with extended payment terms for easier financial preparation.",
    badge: "New",
    badgeStyle: "filled",
  },
];

const AngelicaPlansPremium = () => {
  return (
    <section className="relative py-24 bg-[#f6fbfe] overflow-hidden font-sans">
      {/* Solid Brand Primary Header Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[#013F99]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center text-white mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight font-heading">
            Angelica Life Plan
          </h1>
          <p className="text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            A promise of preparedness. Flexible payment options designed to
            protect your family and bring peace of mind for the future.
          </p>
        </div>

        {/* PLAN CARDS */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col h-full border border-gray-100"
            >
              {/* Status Badge (Solid Accent for New / Outline for Original) */}
              <div 
                className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold px-6 py-1.5 rounded-full shadow-md uppercase tracking-widest z-20
                ${plan.badgeStyle === 'filled' 
                  ? "bg-[#F3CF47] text-[#013F99]" 
                  : "bg-white border-2 border-[#4CB1E9] text-[#4CB1E9]"}`}
              >
                {plan.badge}
              </div>

              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-bold text-[#013F99] mb-3 uppercase tracking-tight font-heading">
                  {plan.name}
                </h3>
                {/* Solid Accent Box for Years */}
                <div className="inline-block bg-[#F3CF47] px-4 py-1 rounded-md">
                   <p className="text-[#013F99] font-black text-sm uppercase tracking-wider">
                    {plan.years}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-8 flex-grow leading-relaxed italic">
                "{plan.description}"
              </p>

              {/* Benefits List */}
              <div className="space-y-5 mb-10">
                <BenefitItem icon={<ShieldCheck size={22} />} text="Complete Memorial Service" />
                <BenefitItem icon={<TrendingUp size={22} />} text="Growing Benefits up to 150%" />
                <BenefitItem icon={<HeartHandshake size={22} />} text="Peace of Mind for the Family" />
              </div>

              <Link
                to="/products"
                className="block text-center w-full py-4 rounded-2xl font-bold transition-all shadow-md bg-[#013F99] text-white hover:bg-[#4CB1E9] active:scale-95"
              >
                View Plan Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BenefitItem = ({ icon, text }) => (
  <div className="flex items-start gap-4 group">
    <div className="text-[#013F99] mt-0.5 transition-transform group-hover:scale-110">
      {icon}
    </div>
    <span className="text-gray-700 font-bold leading-snug tracking-tight">
      {text}
    </span>
  </div>
);

export default AngelicaPlansPremium;