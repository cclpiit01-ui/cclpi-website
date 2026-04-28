// src/pages/AdminDashboard.jsx
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/constants/roles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PosterTool from "./admin/PosterTool";
import HRDashboard from "./admin/HRDashboard";
import UserManagement from "./admin/UserManagement";

const NAV_ITEMS = [
  { key: "hr_dashboard",    permission: "hr_dashboard",    icon: "chart",  label: "HR Dashboard" },
  { key: "poster_tool",     permission: "poster_tool",     icon: "poster", label: "Recruitment Poster" },
  { key: "claims",          permission: "claims",          icon: "claims", label: "Claims Management" },
  { key: "news",            permission: "news",            icon: "news",   label: "News & Social Media" },
  { key: "user_management", permission: "user_management", icon: "users",  label: "User Management" },
];

const NavIcon = ({ type }) => {
  const s = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "chart")  return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/></svg>;
  if (type === "poster") return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
  if (type === "claims") return <svg viewBox="0 0 24 24" style={s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>;
  if (type === "news")   return <svg viewBox="0 0 24 24" style={s}><path d="M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/><line x1="4" y1="9" x2="20" y2="9"/><line x1="8" y1="4" x2="8" y2="9"/></svg>;
  if (type === "users")  return <svg viewBox="0 0 24 24" style={s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
  return null;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("default");

  const userPermissions = PERMISSIONS[user?.role] || [];
  const initials = user?.username?.slice(0, 2).toUpperCase() || "AD";

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f2f2f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220,
        background: "#fff",
        borderRight: "0.5px solid rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* USER PROFILE */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "0.5px solid #f2f2f7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "#e8eeff", color: "#0b3d91",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1c1c1e", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.username}
              </p>
              <p style={{ fontSize: 11, color: "#8e8e93", margin: 0 }}>
                {user?.role?.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.filter(item => userPermissions.includes(item.permission)).map(item => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 10, border: "none",
                  background: active ? "#e8eeff" : "transparent",
                  color: active ? "#0b3d91" : "#3a3a3c",
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f2f2f7"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ color: active ? "#0b3d91" : "#8e8e93", flexShrink: 0 }}>
                  <NavIcon type={item.icon} />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div style={{ padding: "12px 10px", borderTop: "0.5px solid #f2f2f7" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "9px 12px", borderRadius: 10,
              border: "none", background: "transparent",
              color: "#ff3b30", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fff0ef"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "default" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 32 }}>
            <div style={{
              background: "#fff", borderRadius: 20,
              border: "0.5px solid rgba(0,0,0,0.07)",
              padding: "48px 56px", textAlign: "center", maxWidth: 480,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#e8eeff", color: "#0b3d91",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 700, margin: "0 auto 20px",
              }}>
                {initials}
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1c1c1e", margin: "0 0 6px", letterSpacing: -0.5 }}>
                Welcome back, {user?.username}
              </h1>
              <p style={{ fontSize: 13, color: "#8e8e93", margin: "0 0 24px" }}>
                Select a module from the sidebar to get started.
              </p>
              <span style={{
                display: "inline-block", background: "#f2f2f7",
                color: "#636366", fontSize: 12, fontWeight: 500,
                padding: "4px 12px", borderRadius: 20,
              }}>
                {user?.role?.replace("_", " ")}
              </span>
            </div>
          </div>
        )}

        {activeTab === "hr_dashboard"    && <HRDashboard />}
        {activeTab === "poster_tool"     && <PosterTool />}
        {activeTab === "user_management" && <UserManagement />}

        {activeTab === "claims" && (
          <div style={{ padding: 28 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "0.5px solid rgba(0,0,0,0.07)", padding: "32px 36px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1c1c1e", margin: "0 0 6px" }}>Claims Management</h2>
              <p style={{ color: "#8e8e93", fontSize: 14 }}>Accessing core claims data as authorized.</p>
            </div>
          </div>
        )}

        {activeTab === "news" && (
          <div style={{ padding: 28 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "0.5px solid rgba(0,0,0,0.07)", padding: "32px 36px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1c1c1e", margin: "0 0 6px" }}>News & Social Media</h2>
              <p style={{ color: "#8e8e93", fontSize: 14 }}>Manage public-facing website content.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}