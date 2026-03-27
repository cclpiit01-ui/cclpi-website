import { useState } from "react";

// ── Brand tokens ────────────────────────────────────────────────
const C = {
  primary:    "#013F99",   // deep brand blue
  blueGrad:   "#1a5bbc",   // lighter blue for gradients
  secondary:  "#4CB1E9",   // sky blue
  accent:     "#F3CF47",   // brand yellow
  yellowGrad: "#fde99e",   // soft yellow for gradients
  surface:    "#f6fbfe",   // page background
  white:      "#ffffff",
  textDark:   "#012d6e",
  textMid:    "#4a5a7a",
  textLight:  "#8a96b0",
};

const plans = [
  {
    id: 5,
    years: "5",
    label: "5 YEARS TO PAY",
    features: ["Faster completion", "Same protection"],
    badge: "Original",
    badgeStyle: "outline", // outlined style for Original
  },
  {
    id: 7,
    years: "7",
    label: "7 YEARS TO PAY",
    features: ["Balanced payment", "Lower monthly"],
    badge: "New",
    badgeStyle: "filled",
  },
  {
    id: 10,
    years: "10",
    label: "10 YEARS TO PAY",
    features: ["Most affordable", "Lowest monthly installment"],
    badge: "New",
    badgeStyle: "filled",
  },
];

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill={C.accent} />
    <path
      d="M5 9.2l2.8 2.8 5.2-5.6"
      stroke={C.primary}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AngelicaLifePlan() {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: C.surface,
        padding: "64px 24px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: "48px", maxWidth: "560px" }}>
        <div
          style={{
            display: "inline-block",
            background: `linear-gradient(135deg, ${C.primary}, ${C.blueGrad})`,
            color: C.accent,
            fontSize: "11px",
            fontFamily: "'Arial Narrow', Arial, sans-serif",
            fontWeight: "700",
            letterSpacing: "3px",
            textTransform: "uppercase",
            padding: "6px 18px",
            marginBottom: "20px",
            borderRadius: "2px",
          }}
        >
          Payment Plans
        </div>

        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: "800",
            color: C.primary,
            margin: "0 0 16px 0",
            lineHeight: "1.15",
            letterSpacing: "-0.5px",
          }}
        >
          Angelica Life Plan
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: C.textMid,
            lineHeight: "1.7",
            margin: 0,
            fontFamily: "'Arial', sans-serif",
            fontWeight: "400",
          }}
        >
          A promise of preparedness. Flexible payment options designed to
          protect your family and bring peace of mind for the future.
        </p>
      </div>

      {/* ── Cards ── */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {plans.map((plan) => {
          const isHovered = hovered === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setHovered(plan.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                width: "210px",
                borderRadius: "8px",
                overflow: "visible",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                transform: isHovered
                  ? "translateY(-10px) scale(1.03)"
                  : isPopular
                  ? "translateY(-4px)"
                  : "translateY(0)",
                transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease",
                boxShadow: isHovered
                  ? "0 24px 48px rgba(1,63,153,0.28)"
                  : isPopular
                  ? "0 12px 32px rgba(1,63,153,0.22)"
                  : "0 4px 16px rgba(1,63,153,0.12)",
              }}
            >
              {/* Popular badge */}
              {isPopular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-14px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: `linear-gradient(90deg, ${C.accent}, ${C.yellowGrad})`,
                    color: C.primary,
                    fontSize: "10px",
                    fontFamily: "'Arial Narrow', Arial, sans-serif",
                    fontWeight: "800",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "4px 14px",
                    borderRadius: "20px",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    boxShadow: "0 2px 8px rgba(243,207,71,0.45)",
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* ── Card top — blue gradient ── */}
              <div
                style={{
                  background: `linear-gradient(160deg, ${C.blueGrad} 0%, ${C.primary} 100%)`,
                  borderRadius: "8px 8px 0 0",
                  padding: "28px 24px 0",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontFamily: "'Arial Narrow', Arial, sans-serif",
                      fontWeight: "800",
                      letterSpacing: "3px",
                      color: C.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    ANGELICA
                  </div>
                  {/* Original / New badge */}
                  <span
                    style={{
                      fontSize: "9px",
                      fontFamily: "'Arial Narrow', Arial, sans-serif",
                      fontWeight: "800",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      padding: "2px 7px",
                      borderRadius: "20px",
                      ...(plan.badgeStyle === "filled"
                        ? {
                            background: C.accent,
                            color: C.primary,
                            border: "none",
                          }
                        : {
                            background: "transparent",
                            color: C.secondary,
                            border: `1.5px solid ${C.secondary}`,
                          }),
                    }}
                  >
                    {plan.badge}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "84px",
                    fontWeight: "900",
                    color: C.white,
                    lineHeight: "1",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {plan.years}
                </div>

                {/* Yellow gradient strip */}
                <div
                  style={{
                    background: `linear-gradient(90deg, ${C.accent} 0%, ${C.yellowGrad} 100%)`,
                    margin: "16px -24px 0",
                    padding: "8px 24px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "'Arial Narrow', Arial, sans-serif",
                      fontWeight: "800",
                      letterSpacing: "1.5px",
                      color: C.primary,
                      textTransform: "uppercase",
                    }}
                  >
                    {plan.label}
                  </span>
                </div>
              </div>

              {/* ── Card bottom — white features ── */}
              <div
                style={{
                  background: C.white,
                  borderRadius: "0 0 8px 8px",
                  padding: "20px 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: "12px",
                }}
              >
                {plan.features.map((feat, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ flexShrink: 0, marginTop: "1px" }}>
                      <CheckIcon />
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        color: C.textDark,
                        fontFamily: "'Arial', sans-serif",
                        fontWeight: "600",
                        lineHeight: "1.4",
                      }}
                    >
                      {feat}
                    </span>
                  </div>
                ))}

                <button
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    padding: "11px",
                    background: isHovered
                      ? `linear-gradient(90deg, ${C.accent}, ${C.yellowGrad})`
                      : `linear-gradient(135deg, ${C.primary}, ${C.blueGrad})`,
                    color: isHovered ? C.primary : C.white,
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "'Arial Narrow', Arial, sans-serif",
                    fontWeight: "800",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.22s ease, color 0.22s ease",
                  }}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p
        style={{
          marginTop: "40px",
          fontSize: "13px",
          color: C.textLight,
          fontFamily: "'Arial', sans-serif",
          textAlign: "center",
        }}
      >
        All plans include the same full protection coverage.&nbsp;·&nbsp;Terms and conditions apply.
      </p>
    </section>
  );
}
