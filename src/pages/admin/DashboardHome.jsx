import { useEffect, useState } from "react";
import { supabaseEmployees } from "@/lib/supabaseEmployees";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#013F99", "#4CB1E9", "#F3CF47", "#22c55e", "#ef4444", "#a855f7", "#f97316", "#06b6d4", "#ec4899", "#84cc16"];

export default function DashboardHome() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabaseEmployees.from("employees").select("id, status, department, date_hired");
      if (!error) setEmployees(data);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const total = employees.length;
  const active = employees.filter((e) => e.status === "Active").length;
  const inactive = employees.filter((e) => e.status === "In-active").length;

  // Department breakdown
  const deptMap = {};
  employees.forEach((emp) => {
    const dept = emp.department || "Unassigned";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const deptData = Object.entries(deptMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Recent hires (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentHires = employees.filter((e) => e.date_hired && new Date(e.date_hired) >= thirtyDaysAgo).length;

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1a3b", margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
          Overview of your organization
        </p>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { label: "Total Employees", value: loading ? "..." : total, color: "#013F99", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          )},
          { label: "Active", value: loading ? "..." : active, color: "#22c55e", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          )},
          { label: "Inactive", value: loading ? "..." : inactive, color: "#ef4444", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          )},
          { label: "New Hires (30 days)", value: loading ? "..." : recentHires, color: "#4CB1E9", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          )},
        ].map((card) => (
          <div key={card.label} style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px",
            border: "1px solid rgba(1,63,153,0.08)",
            borderLeft: `4px solid ${card.color}`,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: card.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                {card.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: card.color, marginTop: 2 }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* DEPARTMENT BREAKDOWN */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid rgba(1,63,153,0.08)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0b1a3b", margin: "0 0 20px", fontFamily: "'Montserrat', sans-serif" }}>
            Department Breakdown
          </h2>
          {loading ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} employees`, name]}
                  contentStyle={{ borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", fontSize: 12, fontFamily: "'Poppins', sans-serif" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Poppins', sans-serif" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* STATUS BREAKDOWN */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid rgba(1,63,153,0.08)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0b1a3b", margin: "0 0 20px", fontFamily: "'Montserrat', sans-serif" }}>
            Employment Status
          </h2>
          {loading ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>Loading...</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={[{ name: "Active", value: active }, { name: "Inactive", value: inactive }]}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} employees`, name]}
                    contentStyle={{ borderRadius: 10, border: "1px solid rgba(1,63,153,0.12)", fontSize: 12, fontFamily: "'Poppins', sans-serif" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* LEGEND */}
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12 }}>
                {[{ label: "Active", value: active, color: "#22c55e" }, { label: "Inactive", value: inactive, color: "#ef4444" }].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                    <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'Poppins', sans-serif" }}>
                      {item.label}: <strong style={{ color: "#0b1a3b" }}>{item.value}</strong>
                    </span>
                  </div>
                ))}
              </div>

              {/* PERCENTAGE BAR */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 6 }}>
                  <span>Active Rate</span>
                  <span style={{ fontWeight: 700, color: "#22c55e" }}>{total > 0 ? Math.round((active / total) * 100) : 0}%</span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${total > 0 ? (active / total) * 100 : 0}%`, background: "linear-gradient(90deg, #22c55e, #4ade80)", borderRadius: 4, transition: "width 0.5s" }} />
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* DEPARTMENT LIST */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid rgba(1,63,153,0.08)", marginTop: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0b1a3b", margin: "0 0 16px", fontFamily: "'Montserrat', sans-serif" }}>
          Employees per Department
        </h2>
        {loading ? (
          <div style={{ color: "#94a3b8", fontSize: 13 }}>Loading...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {deptData.map((dept, index) => (
              <div key={dept.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[index % COLORS.length], flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: "#0b1a3b", fontWeight: 500, width: 180, flexShrink: 0 }}>{dept.name}</div>
                <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(dept.value / total) * 100}%`, background: COLORS[index % COLORS.length], borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS[index % COLORS.length], width: 30, textAlign: "right", flexShrink: 0 }}>{dept.value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", width: 36, flexShrink: 0 }}>{Math.round((dept.value / total) * 100)}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}