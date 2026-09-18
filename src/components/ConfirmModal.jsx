export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
          overflow: "hidden",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "22px 24px 18px",
            borderBottom: "1px solid #eef2f7",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(1, 63, 153, 0.08)",
                color: "#013F99",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0b1a3b",
                }}
              >
                {title}
              </h3>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginTop: 2,
                }}
              >
                Please review before continuing
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        <div
          style={{
            padding: "20px 24px",
            fontSize: 13,
            lineHeight: 1.7,
            color: "#475569",
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </div>

        {/* BUTTONS */}
        <div
          style={{
            padding: "16px 24px 22px",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              border: "1px solid #dbe4ef",
              background: "#fff",
              color: "#64748b",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "9px 20px",
              borderRadius: 9,
              border: "none",
              background: loading
                ? "#94a3b8"
                : "linear-gradient(90deg, #013F99, #4CB1E9)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {loading && (
              <span
                style={{
                  width: 13,
                  height: 13,
                  border: "2px solid rgba(255,255,255,.4)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}

            {loading ? "Syncing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}