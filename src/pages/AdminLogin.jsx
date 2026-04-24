import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">CCLP Portal</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Admin Access Only</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl text-center font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@cclpi.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            {isLoading ? "Authenticating..." : "Authorize Access"}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-6">
          Cosmopolitan CLIMBS Life Plan Inc. © 2026
        </p>
      </div>
    </div>
  );
}
