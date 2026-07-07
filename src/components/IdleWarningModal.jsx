import { useEffect, useState } from "react";

export default function IdleWarningModal({ visible, onStay, onLogout }) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!visible) {
      setSeconds(60);
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999,
      fontFamily: "'Poppins', sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "36px 32px",
        width: 360,
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64,
          background: "#FEF3C7",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 28,
        }}>
          ⏱️
        </div>

        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
          Session Expiring Soon
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
          You've been inactive for a while. You will be automatically logged out in:
        </p>

        {/* Countdown */}
        <div style={{
          fontSize: 48, fontWeight: 800,
          color: seconds <= 10 ? "#ef4444" : "#013F99",
          marginBottom: 28,
          transition: "color 0.3s",
        }}>
          {seconds}s
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onLogout}
            style={{
              flex: 1, padding: "11px 0",
              borderRadius: 10, border: "1px solid #e2e8f0",
              background: "#fff", color: "#64748b",
              fontSize: 13, fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
          <button
            onClick={onStay}
            style={{
              flex: 1, padding: "11px 0",
              borderRadius: 10, border: "none",
              background: "#013F99", color: "#fff",
              fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}