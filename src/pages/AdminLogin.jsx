import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import CCLPILogo from "@/assets/logo.png";

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
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #011f4d 0%, #013F99 60%, #4CB1E9 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Poppins', sans-serif",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            padding: "24px",
            display: "inline-block",
            marginBottom: 20,
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <img
              src={CCLPILogo}
              alt="CCLPI Logo"
              style={{ width: 160, objectFit: "contain", display: "block" }}
            />
          </div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: 0.5,
          }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "6px 0 0" }}>
            Cosmopolitan CLIMBS Life Plan Inc.
          </p>
        </div>

        {/* CARD */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "36px 32px",
        }}>

          {/* ACCENT LINE */}
          <div style={{
            height: 3,
            background: "linear-gradient(90deg, #013F99, #4CB1E9, #F3CF47)",
            borderRadius: 2,
            marginBottom: 28,
          }} />

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, padding: "12px 16px",
                color: "#fca5a5", fontSize: 13,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{
                fontSize: 11, fontWeight: 600,
                color: "#4CB1E9",
                textTransform: "uppercase", letterSpacing: 1.2,
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@cclpi.com.ph"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "13px 16px",
                  fontSize: 14, color: "#fff",
                  outline: "none", width: "100%", boxSizing: "border-box",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border 0.2s",
                }}
                onFocus={e => e.target.style.border = "1px solid #4CB1E9"}
                onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{
                fontSize: 11, fontWeight: 600,
                color: "#4CB1E9",
                textTransform: "uppercase", letterSpacing: 1.2,
              }}>
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
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "13px 48px 13px 16px",
                    fontSize: 14, color: "#fff",
                    outline: "none", width: "100%", boxSizing: "border-box",
                    fontFamily: "'Poppins', sans-serif",
                    transition: "border 0.2s",
                  }}
                  onFocus={e => e.target.style.border = "1px solid #4CB1E9"}
                  onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer",
                    color: "#000",
                    display: "flex", alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", padding: "14px",
                background: isLoading
                  ? "rgba(255,255,255,0.1)"
                  : "linear-gradient(90deg, #013F99, #4CB1E9)",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                marginTop: 4,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: 0.5,
                transition: "opacity 0.2s",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
              }}
            >
              {isLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                    style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in…
                </>
              ) : "Sign In"}
            </button>

          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "20px 0 0" }}>
          © 2026 Cosmopolitan CLIMBS Life Plan Inc. All rights reserved.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}