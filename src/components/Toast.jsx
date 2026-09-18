import { useEffect } from "react";

export default function Toast({
  message,
  type = "success",
  duration = 4000,
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      accent: "#16a34a",
      icon: "✓",
      title: "Success",
    },
    error: {
      accent: "#dc2626",
      icon: "✕",
      title: "Error",
    },
    warning: {
      accent: "#f59e0b",
      icon: "!",
      title: "Warning",
    },
    info: {
      accent: "#013F99",
      icon: "i",
      title: "Information",
    },
  };

  const current = styles[type] || styles.success;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          width: 350,
          maxWidth: "calc(100vw - 48px)",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 10px 35px rgba(0,0,0,0.14)",
          zIndex: 99999,
          overflow: "hidden",
          animation: "toastSlideIn 0.3s ease",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "16px 18px",
          }}
        >
          {/* ICON */}
          <div
            style={{
              width: 28,
              height: 28,
              minWidth: 28,
              borderRadius: "50%",
              background: current.accent,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {current.icon}
          </div>

          {/* CONTENT */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "#0f172a",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 3,
              }}
            >
              {current.title}
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              {message}
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 18,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* PROGRESS LINE */}
        <div
          style={{
            height: 3,
            background: "#f1f5f9",
          }}
        >
          <div
            style={{
              height: "100%",
              background: current.accent,
              animation: `toastProgress ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes toastProgress {
          from {
            width: 100%;
          }

          to {
            width: 0%;
          }
        }
      `}</style>
    </>
  );
}