import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import CCLPILogo from "@/assets/cclpi-logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/admin-dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f2f2f7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>

        {/* LOGO AREA */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img
            src={CCLPILogo}
            alt="CCLPI Logo"
            style={{
              width: 200,
              height: 80,
              objectFit: "contain",
              margin: "0 auto 14px",
              display: "block",
            }}
          />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c1c1e", margin: 0, letterSpacing: -0.5 }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: 13, color: "#8e8e93", margin: "4px 0 0" }}>
            Sign in to your account
          </p>
        </div>

        {/* CARD */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          border: "0.5px solid rgba(0,0,0,0.08)",
          padding: "28px 28px 24px",
        }}>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ERROR */}
            {error && (
              <div style={{
                background: "#fff0ef",
                border: "0.5px solid rgba(255,59,48,0.2)",
                borderRadius: 12, padding: "11px 14px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontSize: 13, color: "#ff3b30", margin: 0, fontWeight: 500 }}>
                  {error}
                </p>
              </div>
            )}

            {/* EMAIL */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#3a3a3c" }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="admin@cclpi.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "#f2f2f7", border: "0.5px solid transparent",
                  borderRadius: 11, padding: "12px 14px",
                  fontSize: 14, color: "#1c1c1e",
                  outline: "none", transition: "border 0.15s",
                }}
                onFocus={e => e.target.style.border = "0.5px solid #0b3d91"}
                onBlur={e => e.target.style.border = "0.5px solid transparent"}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#3a3a3c" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#f2f2f7", border: "0.5px solid transparent",
                    borderRadius: 11, padding: "12px 44px 12px 14px",
                    fontSize: 14, color: "#1c1c1e",
                    outline: "none", transition: "border 0.15s",
                  }}
                  onFocus={e => e.target.style.border = "0.5px solid #0b3d91"}
                  onBlur={e => e.target.style.border = "0.5px solid transparent"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 13, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", color: "#8e8e93", padding: 2,
                    display: "flex", alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", padding: "13px",
                background: isLoading ? "#8e8e93" : "#0b3d91",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.15s",
                marginTop: 4,
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#0a3480"; }}
              onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = "#0b3d91"; }}
            >
              {isLoading ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>

          </form>
        </div>

        {/* FOOTER */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#8e8e93", margin: "20px 0 0" }}>
          Cosmopolitan CLIMBS Life Plan Inc. © 2026
        </p>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}