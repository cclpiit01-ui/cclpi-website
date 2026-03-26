// src/pages/AdminDashboard.jsx
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS, ROLES } from "@/constants/roles";
import { useState } from "react";
import PosterTool from "./admin/PosterTool"; // Your existing hiring tool

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("default");

  // Filter the menu items based on what this specific user is allowed to see
  const userPermissions = PERMISSIONS[user?.role] || [];
  
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirects immediately
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-bold text-lg">CCLP {user?.role?.replace("_", " ")}</h2>
          <p className="text-xs text-slate-400">Welcome, {user?.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* Only show Poster Tool to HR and Super Admin */}
          {userPermissions.includes("poster_tool") && (
            <button 
              onClick={() => setActiveTab("poster_tool")}
              className={`w-full text-left p-2 rounded ${activeTab === "poster_tool" ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >
              🎨 Recruitment Poster
            </button>
          )}

          {/* Only show Claims to Claims and Super Admin */}
          {userPermissions.includes("claims") && (
            <button 
              onClick={() => setActiveTab("claims")}
              className={`w-full text-left p-2 rounded ${activeTab === "claims" ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >
              📋 Claims Management
            </button>
          )}

          {/* Only show News to CIA and Super Admin */}
          {userPermissions.includes("news") && (
            <button 
              onClick={() => setActiveTab("news")}
              className={`w-full text-left p-2 rounded ${activeTab === "news" ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >
              📰 News & Social Media
            </button>
          )}
        </nav>

        <button onClick={handleLogout} className="p-4 bg-brand-primary hover:bg-red-800 text-sm font-bold">
          LOGOUT
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "default" && (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center">
            <h1 className="text-3xl font-bold text-slate-800">Welcome to the Admin Portal</h1>
            <p className="text-slate-500 mt-2">Please select a tool from the sidebar to begin.</p>
          </div>
        )}

        {activeTab === "poster_tool" && <PosterTool />}
        
        {activeTab === "claims" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Claims & Mortuaries Management</h2>
            <p>This section is restricted to CLAIMS_ADMIN and SUPER_ADMIN.</p>
            {/* Add your Claims table or forms here */}
          </div>
        )}

        {activeTab === "news" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-green-900">News & Publications</h2>
            <p>This section is restricted to CIA_ADMIN and SUPER_ADMIN.</p>
          </div>
        )}
      </main>
    </div>
  );
}