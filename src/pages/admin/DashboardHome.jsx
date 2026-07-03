export default function DashboardHome() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
          Overview of your organization
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {[
          { label: "Total Employees", value: "151", color: "#013F99" },
          { label: "Active", value: "96", color: "#22c55e" },
          { label: "Inactive", value: "55", color: "#ef4444" },
        ].map((card) => (
          <div key={card.label} style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px",
            border: "1px solid rgba(1,63,153,0.08)",
            borderLeft: `4px solid ${card.color}`,
          }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: card.color, marginTop: 8 }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}