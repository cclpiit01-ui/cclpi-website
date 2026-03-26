import { useState, useEffect, useRef } from "react";
import { ShieldCheck, HeartHandshake, TrendingUp, ArrowRight, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Angelica 5",
    script: "Angelica",
    num: "5",
    years: "5 Years to Pay",
    tag: "Classic",
    tagColor: "#4CB1E9",
    popular: false,
    description:
      "The original plan trusted by Filipino families. Faster completion with full memorial protection from day one.",
    extras: ["Nationwide 435+ mortuaries", "Transferable & Assignable", "24/7 Claims Hotline"],
    accent: "#4CB1E9",
    glow: "rgba(76,177,233,0.18)",
  },
  {
    name: "Angelica 7",
    script: "Angelica",
    num: "7",
    years: "7 Years to Pay",
    tag: "Most Popular",
    tagColor: "#F3CF47",
    popular: true,
    description:
      "The most balanced option — lower monthly installments with the same full protection and growing benefits.",
    extras: ["Nationwide 435+ mortuaries", "Transferable & Assignable", "24/7 Claims Hotline"],
    accent: "#F3CF47",
    glow: "rgba(243,207,71,0.22)",
  },
  {
    name: "Angelica 10",
    script: "Angelica",
    num: "10",
    years: "10 Years to Pay",
    tag: "Most Affordable",
    tagColor: "#a78bfa",
    popular: false,
    description:
      "Maximum affordability. Spread payments over 10 years and enjoy growing benefits even before you're fully paid.",
    extras: ["Nationwide 435+ mortuaries", "Transferable & Assignable", "24/7 Claims Hotline"],
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.18)",
  },
];

const benefits = [
  { icon: ShieldCheck, text: "Complete Memorial Service" },
  { icon: TrendingUp, text: "Growing Benefits up to 150%" },
  { icon: HeartHandshake, text: "Peace of Mind for Family" },
];

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

export default function AngelicaPlansPremium() {
  const [hovered, setHovered] = useState(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .alp-section { font-family: 'Outfit', sans-serif; }

        .alp-card {
          transition: transform 0.45s cubic-bezier(.22,1,.36,1), box-shadow 0.45s cubic-bezier(.22,1,.36,1);
        }
        .alp-card:hover { transform: translateY(-14px) scale(1.025) !important; }

        .alp-badge-anim {
          animation: alp-badge-pulse 2.4s ease-in-out infinite;
        }
        @keyframes alp-badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(243,207,71,0.45); }
          50%       { box-shadow: 0 0 0 8px rgba(243,207,71,0); }
        }

        .alp-btn {
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .alp-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.13);
          transform: translateX(-100%);
          transition: transform 0.35s ease;
        }
        .alp-btn:hover::after { transform: translateX(0); }
        .alp-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(1,63,153,0.25); }

        .alp-fade-up {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .alp-fade-up.visible { opacity: 1; transform: translateY(0); }

        .alp-orb {
          position: absolute; border-radius: 50%;
          filter: blur(70px); pointer-events: none;
        }
        .alp-number-bg {
          position: absolute;
          font-family: 'Cormorant Garamond', serif;
          font-size: 160px;
          font-weight: 700;
          line-height: 1;
          right: -10px; top: -10px;
          opacity: 0.055;
          color: #013F99;
          pointer-events: none;
          user-select: none;
        }
        .alp-divider {
          width: 36px; height: 2px;
          background: linear-gradient(90deg, #013F99, #4CB1E9);
          border-radius: 2px;
          margin: 12px 0 18px;
        }
        .alp-years-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(1,63,153,0.07);
          color: #013F99;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 999px;
          margin-bottom: 12px;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="alp-section relative py-28 overflow-hidden"
        style={{ background: "linear-gradient(170deg, #011f5b 0%, #013F99 38%, #0a6ab5 70%, #f6fbfe 100%)" }}
      >
        {/* Decorative orbs */}
        <div className="alp-orb" style={{ width: 520, height: 520, top: -160, left: -160, background: "rgba(76,177,233,0.18)" }} />
        <div className="alp-orb" style={{ width: 380, height: 380, bottom: 80, right: -120, background: "rgba(243,207,71,0.12)" }} />
        <div className="alp-orb" style={{ width: 260, height: 260, top: "30%", right: "20%", background: "rgba(1,63,153,0.25)" }} />

        {/* Subtle grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.035,
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div className="relative max-w-7xl mx-auto px-6">

          {/* ── HEADER ── */}
          <div
            className={`alp-fade-up text-center mb-20 ${inView ? "visible" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            <span style={{
              display: "inline-block",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
              color: "#F3CF47", textTransform: "uppercase", marginBottom: 16,
              opacity: 0.9,
            }}>
              CCLPI Plans · Life Plan
            </span>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
              fontWeight: 600, lineHeight: 1.08, color: "#fff",
              marginBottom: 20,
            }}>
              <em style={{ fontStyle: "italic", color: "#F3CF47" }}>Angelica</em> Life Plan
            </h2>

            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.72)",
              maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7,
            }}>
              A promise of preparedness. Choose the payment term that fits your family — same protection, flexible options.
            </p>

            {/* Badges row */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {["Budget Friendly", "Same Protection", "Growing Benefits"].map((b) => (
                <span key={b} style={{
                  background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#fff", fontSize: 12, fontWeight: 500,
                  padding: "5px 14px", borderRadius: 999,
                }}>
                  <Check size={11} style={{ display: "inline", marginRight: 5, color: "#F3CF47" }} />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* ── CARDS ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: 24,
            alignItems: "end",
          }}>
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`alp-card alp-fade-up ${inView ? "visible" : ""}`}
                style={{
                  transitionDelay: `${120 + i * 110}ms`,
                  position: "relative",
                  borderRadius: 24,
                  background: "#fff",
                  padding: "36px 32px 32px",
                  overflow: "hidden",
                  transform: plan.popular ? "translateY(-10px) scale(1.03)" : "translateY(0)",
                  boxShadow: plan.popular
                    ? "0 24px 60px rgba(1,63,153,0.22), 0 0 0 2.5px #F3CF47"
                    : "0 8px 32px rgba(1,63,153,0.11)",
                  cursor: "default",
                }}
                onMouseEnter={() => setHovered(plan.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Ghost number */}
                <div className="alp-number-bg">{plan.num}</div>

                {/* Top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 4,
                  background: `linear-gradient(90deg, #013F99, ${plan.accent})`,
                  borderRadius: "24px 24px 0 0",
                }} />

                {/* Tag badge */}
                <div style={{ marginBottom: 18 }}>
                  <span
                    className={plan.popular ? "alp-badge-anim" : ""}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: plan.popular ? "#F3CF47" : "rgba(1,63,153,0.07)",
                      color: "#013F99",
                      fontSize: 11, fontWeight: 800, letterSpacing: "0.1em",
                      textTransform: "uppercase", padding: "4px 12px", borderRadius: 999,
                    }}
                  >
                    {plan.popular && <Star size={10} fill="#013F99" />}
                    {plan.tag}
                  </span>
                </div>

                {/* Plan name */}
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 34, fontWeight: 700, lineHeight: 1,
                  color: "#013F99", marginBottom: 2,
                }}>
                  <em style={{ fontStyle: "italic" }}>{plan.script}</em>{" "}
                  <span style={{ fontStyle: "normal" }}>{plan.num}</span>
                </h3>

                {/* Years pill */}
                <div className="alp-years-pill">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: plan.accent, display: "inline-block" }} />
                  {plan.years}
                </div>

                <div className="alp-divider" />

                {/* Description */}
                <p style={{ fontSize: 14, color: "#5a6a82", lineHeight: 1.7, marginBottom: 20 }}>
                  {plan.description}
                </p>

                {/* Core benefits */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                  {benefits.map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: "rgba(1,63,153,0.07)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Icon size={15} color="#013F99" />
                      </span>
                      <span style={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Extras */}
                <div style={{
                  background: "rgba(1,63,153,0.04)", borderRadius: 12,
                  padding: "12px 14px", marginBottom: 24,
                }}>
                  {plan.extras.map((e) => (
                    <div key={e} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <Check size={12} color="#4CB1E9" strokeWidth={2.5} />
                      <span style={{ fontSize: 12.5, color: "#64748b" }}>{e}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to="/products"
                  className="alp-btn"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", padding: "13px 0", borderRadius: 14,
                    fontWeight: 700, fontSize: 14, textDecoration: "none",
                    background: plan.popular
                      ? "linear-gradient(90deg, #013F99, #0a5cbf)"
                      : "linear-gradient(90deg, #4CB1E9, #2196c4)",
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  View Plan Details
                  <ArrowRight size={15} />
                </Link>

              </div>
            ))}
          </div>

          {/* ── FOOTER NOTE ── */}
          <div
            className={`alp-fade-up text-center mt-16 ${inView ? "visible" : ""}`}
            style={{ transitionDelay: "500ms" }}
          >
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.5)",
              maxWidth: 480, margin: "0 auto", lineHeight: 1.7,
            }}>
              Growing benefits start from the 6th year — increasing 5% annually up to 150%, even before your plan is fully paid.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
