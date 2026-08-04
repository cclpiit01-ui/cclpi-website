import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";
import CCLPILogo from "@/assets/logo-box.png";

// ─── IDLE TIMER HOOK ───────────────────────────────────────────────
const IDLE_TIMEOUT = 30 * 60 * 1000;  // 30 minutes
const WARNING_DURATION = 60 * 1000;   // 60 seconds

function useIdleTimer({ onWarning, onLogout }) {
  const idleTimer = useRef(null);
  const warningTimer = useRef(null);

  const resetTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    clearTimeout(warningTimer.current);

    idleTimer.current = setTimeout(() => {
      onWarning();
      warningTimer.current = setTimeout(() => {
        onLogout();
      }, WARNING_DURATION);
    }, IDLE_TIMEOUT);
  }, [onWarning, onLogout]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll", "click"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(idleTimer.current);
      clearTimeout(warningTimer.current);
    };
  }, [resetTimer]);

  return { resetTimer };
}

// ─── IDLE WARNING MODAL ────────────────────────────────────────────
function IdleWarningModal({ visible, onStay, onLogout }) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!visible) {
      setSeconds(60);
      return;
    }
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
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
          You've been inactive for 30 minutes. You will be automatically logged out in:
        </p>

        {/* Countdown */}
        <div style={{
          fontSize: 52, fontWeight: 800,
          color: seconds <= 10 ? "#ef4444" : "#013F99",
          marginBottom: 28,
          transition: "color 0.3s",
          letterSpacing: -1,
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
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            Sign Out
          </button>
          <button
            onClick={onStay}
            style={{
              flex: 1, padding: "11px 0",
              borderRadius: 10, border: "none",
              background: "#013F99", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#0250c5"}
            onMouseLeave={e => e.currentTarget.style.background = "#013F99"}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ───────────────────────────────────────────────────────
const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const ICON_MAP = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    hr: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    jobs: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    mortuary: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
    compliance: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    news: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    roles: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    boardOfDirectors: (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    <circle cx="18" cy="6" r="2"/><path d="M22 21v-1a3 3 0 0 0-2.5-2.96"/>
  </svg>
),
  };

  // Admin-only items — always visible sa Admin role
  const adminOnlyItems = user?.role === "Admin" ? [
    { label: "Role Management", path: "/admin/roles", icon: ICON_MAP.roles },
    { label: "User Management", path: "/admin/users", icon: ICON_MAP.users },
  ] : [];

  // Dynamic items from allowed pages
  const dynamicItems = (user?.allowedPages || [])
    .filter(p => p.path !== "/admin/users" && p.path !== "/admin/roles")
    .map(page => ({
      label: page.name,
      path: page.path,
      icon: ICON_MAP[page.icon] || ICON_MAP.dashboard,
    }));

  const menuItems = [...dynamicItems, ...adminOnlyItems];

  return (
    <div style={{
      width: 240, minHeight: "100vh",
      background: "#013F99",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      position: "fixed", top: 0, left: 0, bottom: 0,
    }}>
      {/* LOGO */}
      <div style={{
        padding: "24px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <img src={CCLPILogo} alt="CCLPI" style={{ height: 38, objectFit: "contain", flexShrink: 0 }} />
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
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, border: "none",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                cursor: "pointer", marginBottom: 4, textAlign: "left",
                fontFamily: "'Poppins', sans-serif", transition: "all 0.2s",
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
            width: 32, height: 32, background: "rgba(255,255,255,0.2)",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
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
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 10, border: "none",
            background: "transparent", color: "rgba(255,255,255,0.4)",
            fontSize: 13, cursor: "pointer",
            fontFamily: "'Poppins', sans-serif", transition: "all 0.2s",
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

// ─── MAIN LAYOUT ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showIdleModal, setShowIdleModal] = useState(false);

  const handleLogout = useCallback(async () => {
    setShowIdleModal(false);
    await logout();
    navigate("/admin/login");
  }, [logout, navigate]);

  const handleWarning = useCallback(() => {
    setShowIdleModal(true);
  }, []);

  const { resetTimer } = useIdleTimer({
    onWarning: handleWarning,
    onLogout: handleLogout,
  });

  const handleStay = () => {
    setShowIdleModal(false);
    resetTimer();
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f6fbfe", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#013F99", fontFamily: "'Poppins', sans-serif" }}>Loading...</div>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6fbfe", fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar user={user} onLogout={handleLogout} />

      <div style={{ marginLeft: 240, flex: 1, padding: "32px 36px" }}>
        <Outlet />
      </div>

      <IdleWarningModal
        visible={showIdleModal}
        onStay={handleStay}
        onLogout={handleLogout}
      />
    </div>
  );
}