import React from "react";

const plans = [
  {
    name: "Angelica 5",
    years: "5 Years to Pay",
    description:
      "The classic Angelica Life Plan option with affordable monthly payments and complete memorial service benefits.",
    highlight: false,
  },
  {
    name: "Angelica 7",
    years: "7 Years to Pay",
    description:
      "More flexible payment option that lowers monthly installments while keeping the same protection.",
    highlight: true,
  },
  {
    name: "Angelica 10",
    years: "10 Years to Pay",
    description:
      "Maximum affordability with extended payment years for easier financial preparation.",
    highlight: false,
  },
];

const AngelicaPlans = () => {
  return (
    <section className="py-16 bg-[#f6fbfe]">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center text-[#013F99] mb-4">
          Choose Your Angelica Life Plan
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Prepare today with flexible payment options that protect your family’s future.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 shadow-lg transition hover:scale-105
              ${
                plan.highlight
                  ? "bg-[#013F99] text-white"
                  : "bg-white text-gray-800"
              }`}
            >

              <h3
                className={`text-2xl font-bold mb-2 ${
                  plan.highlight ? "text-[#F3CF47]" : "text-[#013F99]"
                }`}
              >
                {plan.name}
              </h3>

              <p className="text-lg font-semibold mb-4">
                {plan.years}
              </p>

              <p className="text-sm mb-6">
                {plan.description}
              </p>

              <ul className="text-sm space-y-2 mb-6">
                <li>✔ Lower Monthly Installments</li>
                <li>✔ Growing Benefits</li>
                <li>✔ Full Memorial Service</li>
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition
                ${
                  plan.highlight
                    ? "bg-[#F3CF47] text-[#013F99] hover:opacity-90"
                    : "bg-[#4CB1E9] text-white hover:bg-[#013F99]"
                }`}
              >
                Learn More
              </button>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AngelicaPlans;