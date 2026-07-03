import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import CCLPILogo from "@/assets/cclpi-logo.png";

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      label: "HR Management",
      path: "/admin/hr",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      label: "User Management",
      path: "/admin/users",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      width: 240,
      minHeight: "100vh",
      background: "#013F99",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      position: "fixed",
      top: 0, left: 0, bottom: 0,
    }}>
      {/* LOGO */}
      <div style={{
        padding: "24px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <img src={CCLPILogo} alt="CCLPI" style={{ width: 40, objectFit: "contain" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Montserrat', sans-serif" }}>CCLPI Plans</div>
          <div style={{ color: "#4CB1E9", fontSize: 10, fontWeight: 500 }}>Admin Portal</div>
        </div>
      </div>

      {/* MENU */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                marginBottom: 4,
                textAlign: "left",
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* USER + LOGOUT */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32,
            background: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700,
          }}>
            {user?.username?.[0]?.toUpperCase() || "A"}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{user?.username}</div>
            <div style={{ fontSize: 10, color: "#4CB1E9" }}>{user?.role}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f6fbfe", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#013F99", fontFamily: "'Poppins', sans-serif" }}>Loading...</div>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6fbfe", fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar user={user} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 240, flex: 1, padding: "32px 36px" }}>
        <Outlet />
      </div>
    </div>
  );
}