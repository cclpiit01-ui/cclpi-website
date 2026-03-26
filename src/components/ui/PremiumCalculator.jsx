import React, { useState, useMemo, useRef } from 'react';
import { Calculator, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animation/Reveal";

// Official Ratios from your provided Amortization Schedules
const TERM_CONFIGS = {
  5: { factor: 0.20, monthly: 0.09, semi: 0.52, quarterly: 0.265, mos: 60 },
  7: { factor: 0.142867, monthly: 0.09006, semi: 0.5198, quarterly: 0.26505, mos: 84 },
  10: { factor: 0.10, monthly: 0.09, semi: 0.52, quarterly: 0.265, mos: 120 }
};

const CONTRACT_PRICES = Array.from({ length: 48 }, (_, i) => 30000 + (i * 10000));

const PremiumCalculator = ({ onPlanChange }) => {
  const [price, setPrice] = useState(30000);
  const [term, setTerm] = useState(10); // Default to most affordable
  const hasInteracted = useRef(false); // ← silent flag, no re-render

  // Calculate Amortization based on Price + Term
  const selected = useMemo(() => {
    const annual = Math.ceil(price / term);
    const monthly = Math.ceil((annual * 1.08) / 12);
    const semi = Math.ceil((annual * 1.04) / 2);
    const quarterly = Math.ceil((annual * 1.06) / 4);

    return {
      price,
      annual,
      monthly,
      semi,
      quarterly,
      tax: price * 0.002,
      mos: term * 12
    };
  }, [price, term]);

  React.useEffect(() => {
    if (!hasInteracted.current) return; // ← don't fire on mount
    if (onPlanChange) {
      onPlanChange({
        price: price,
        term: term,
        monthly: Math.round(selected.monthly)
      });
    }
  }, [price, term, selected.monthly, onPlanChange]);

  // Benefit Growth Logic: Year 6 Increase (All Plans)
  const growthData = useMemo(() => {
    let data = [];
    const maxBenefit = price * 1.5;
    for (let year = 1; year <= 20; year++) {
      let currentBenefit = price;
      if (year > 5) {
        const growthYears = year - 5;
        currentBenefit = price + (price * 0.05 * growthYears);
      }
      data.push({
        year: `Yr ${year}`,
        benefit: Math.min(currentBenefit, maxBenefit),
        isPaying: year <= term
      });
    }
    return data;
  }, [price, term]);

  return (
    <section className="bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        <Reveal direction="bottom">
          <div className="text-center mb-16">
            <h2 className="text-brand-primary font-heading font-black text-4xl uppercase">
              Premium Calculator
            </h2>
            <div className="w-20 h-1.5 bg-brand-accent mx-auto mt-4 rounded-full" />
          </div>
        </Reveal>

        {/* SELECTORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Reveal direction="scale">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">1. Select Contract Price</label>
              <select
                className="p-3 border rounded-lg w-full text-lg font-semibold border-brand-secondary"
                value={price}
                onChange={(e) => {
                  hasInteracted.current = true; // ← mark interaction
                  setPrice(parseInt(e.target.value));
                }}
              >
                {CONTRACT_PRICES.map(p => <option key={p} value={p}>₱{p.toLocaleString()}</option>)}
              </select>
            </div>
          </Reveal>

          <Reveal direction="scale">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">2. Choose Payment Term</label>
              <div className="flex gap-2">
                {[5, 7, 10].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      hasInteracted.current = true; // ← mark interaction
                      setTerm(t);
                    }}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                      term === t ? "bg-[#013F99] text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {t} Years
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: AMORTIZATION CARDS */}
          <div className="bg-[#013F99] p-8 rounded-3xl text-white shadow-xl">
            <Reveal direction="left">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-brand-accent" />
                <h3 className="text-xl font-bold">Payment Options ({term} Years)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PriceBox label="Monthly" value={selected.monthly} sub={`${selected.mos} months`} />
                <PriceBox label="Quarterly" value={selected.quarterly} sub={`${term * 4} quarters`} />
                <PriceBox label="Semi-Annual" value={selected.semi} sub={`${term * 2} payments`} />
                <PriceBox label="Annual" value={selected.annual} sub={`${term} years`} />
                <PriceBox label="Spot Cash" value={selected.price * 0.9} sub="10% Discount" highlight />
                <PriceBox label="Doc Stamp" value={selected.tax} sub="One-time fee" />
              </div>
            </Reveal>
          </div>

          {/* RIGHT: GROWTH VISUALIZATION */}
          <Reveal direction="right">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">Growth Advantage (Starts Yr 6)</h3>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide domain={[price * 0.9, price * 1.6]} />
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgb(0 0 0 / 0.1)' }}
                      formatter={(val) => [`₱${Math.round(val).toLocaleString()}`, "Benefit Value"]}
                    />
                    <Line type="stepAfter" dataKey="benefit" stroke="#2563eb" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs text-blue-700 font-bold uppercase tracking-widest mb-1">Benefit Note:</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your protection value increases by **5% every year starting Year 6**, even if you are still paying for your 7 or 10-year plan.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const PriceBox = ({ label, value, sub, highlight }) => (
  <div className={cn(
    "p-4 rounded-2xl border transition-all",
    highlight ? "bg-brand-accent border-yellow-500 text-blue-950" : "bg-white/10 border-white/20 text-white"
  )}>
    <p className="text-[10px] uppercase font-black opacity-80">{label}</p>
    <p className="text-xl font-black">₱{Math.round(value).toLocaleString()}</p>
    <p className="text-[9px] font-bold opacity-60">{sub}</p>
  </div>
);

export default PremiumCalculator;
