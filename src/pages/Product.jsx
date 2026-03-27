import { useState, useRef, useEffect } from 'react';
import SEO from "@/components/seo/SEO";
import PageHeader from "@/components/ui/PageHeader";
import PremiumCalculator from "@/components/ui/PremiumCalculator";
import StickyPlanBar from "./product/StickyPlanBar";
import ProductHero from './product/ProductHero';
import ProductReality from './product/ProductReality';
import ProductFeatures from './product/ProductFeatures';
import MemorialBenefits from './product/MemorialBenefits';
import AdditionalBenefits from './product/AdditionalBenefits';
import ServiceStats from './product/ServiceStats';
import PaymentDirect from '/product/PaymentDirect';

const Product = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pastInlineBar, setPastInlineBar] = useState(false);
  const inlineBarRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setPastInlineBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (inlineBarRef.current) observer.observe(inlineBarRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="Angelica Life Plan"
        description="Angelica Life Plan by Cosmopolitan Climbs Life Plan Inc."
        keywords="Angelica Life Plan, CCLPI plans, memorial life plan Philippines"
        url="https://cclpi.com.ph/products"
        image="https://cclpi.com.ph/cover.jpg"
      />

      <main className="bg-white font-sans text-slate-900 min-h-screen">

        {/* PageHeader stays unchanged */}
        <PageHeader
          title="Product"
          subtitle="Death is inevitable, but financial burden isn't. Secure your family's peace of mind by preparing for life's eventualities today."
        />

        {/* Inline plan bar — sits below PageHeader, only on this page */}
        {/* We observe THIS element to know when to show the sticky bar */}
        <div ref={inlineBarRef}>
          {selectedPlan && (
            <div className="bg-brand-primary border-t border-white/10">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/60">Active Quote</p>
                    <p className="text-sm font-bold text-white">₱{selectedPlan.price.toLocaleString()} Plan</p>
                  </div>
                  <div className="w-px h-8 bg-white/20 hidden sm:block" />
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/60">{selectedPlan.term} Year Term</p>
                    <p className="text-2xl font-black text-yellow-400 italic">
                      ₱{selectedPlan.monthly.toLocaleString()}
                      <span className="text-xs text-white not-italic opacity-80 ml-1">/mo</span>
                    </p>
                  </div>
                </div>
                <a
                  href="https://sc.cclpi.com.ph:8080/#/referral/4f030d0843486b39/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-accent text-blue-950 px-5 py-2 rounded-full font-black uppercase text-[11px] hover:opacity-90 transition"
                >
                  Apply Now
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Fixed sticky bar — only shows after inline bar scrolls out of view */}
        {selectedPlan && pastInlineBar && (
          <StickyPlanBar
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
          />
        )}

        <section id="hero"><ProductHero /></section>
        <section id="reality"><ProductReality /></section>
        <section id="features"><ProductFeatures /></section>
        <section id="benefits">
          <MemorialBenefits />
          <AdditionalBenefits />
        </section>
        <section id="stats"><ServiceStats /></section>
        <section id="calculator" className="py-12 bg-slate-50">
          <PremiumCalculator onPlanChange={setSelectedPlan} />
        </section>
        <section id="payment"><PaymentDirect /></section>

      </main>
    </>
  );
};

export default Product;