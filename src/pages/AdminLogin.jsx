// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/constants/roles";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // --- MANUALLY DEFINED PASSWORDS ---
    if (password === "admin2026") {
      login({ username: "Master", role: ROLES.SUPER_ADMIN });
      navigate("/admin-dashboard");
    } 
    else if (password === "hr2026") {
      login({ username: "HR_User", role: ROLES.HRAD_ADMIN });
      navigate("/admin-dashboard");
    } 
    else if (password === "cia2026") {
      login({ username: "CIA_User", role: ROLES.CIA_ADMIN });
      navigate("/admin-dashboard");
    }
    else if (password === "claims2026") {
      login({ username: "Claims_User", role: ROLES.CLAIMS_ADMIN });
      navigate("/admin-dashboard");
    }
    else {
      alert("Invalid Password! Try 'admin2026' or 'hr2026'");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <form onSubmit={handleLogin} className="p-10 bg-white rounded-xl shadow-2xl w-96">
        <h1 className="text-2xl font-black mb-6 text-slate-800 text-center">CCLP PORTAL</h1>
        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="Enter Admin Access Key" 
            className="w-full border-2 border-slate-200 p-3 rounded-lg outline-none focus:border-blue-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
            Authorize Access
          </button>
        </div>
      </form>
    </div>
  );
}