// src/pages/AdminDashboard.jsx
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/constants/roles";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure navigate is imported
import PosterTool from "./admin/PosterTool";
import HRDashboard from "./admin/HRDashboard"; // Assume you'll create this component
import UserManagement from "./admin/UserManagement";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("default");

  const userPermissions = PERMISSIONS[user?.role] || [];
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          {/* Automatically handles "HRAD ADMIN" display */}
          <h2 className="font-bold text-lg text-blue-400">
            CCLP {user?.role?.replace("_", " ")}
          </h2>
          <p className="text-xs text-slate-400">Welcome, {user?.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          
          {/* HR Dashboard */}
          {userPermissions.includes("hr_dashboard") && (
            <button 
              onClick={() => setActiveTab("hr_dashboard")}
              className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === "hr_dashboard" ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >
              📊 HR Dashboard
            </button>
          )}

          {/* Recruitment Poster Tool */}
          {userPermissions.includes("poster_tool") && (
            <button 
              onClick={() => setActiveTab("poster_tool")}
              className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === "poster_tool" ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >
              🎨 Recruitment Poster
            </button>
          )}

          {/* Claims Management */}
          {userPermissions.includes("claims") && (
            <button 
              onClick={() => setActiveTab("claims")}
              className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === "claims" ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >
              📋 Claims Management
            </button>
          )}

          {/* News & Social Media */}
          {userPermissions.includes("news") && (
            <button 
              onClick={() => setActiveTab("news")}
              className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === "news" ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >
              📰 News & Social Media
            </button>
          )}

          {/* User Management - SUPER_ADMIN only */}
          {userPermissions.includes("user_management") && (
            <button 
              onClick={() => setActiveTab("user_management")}
              className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === "user_management" ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >
              👥 User Management
            </button>
          )}
        </nav>

        <button onClick={handleLogout} className="p-4 bg-red-600 hover:bg-red-700 text-sm font-bold transition-colors">
          LOGOUT
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "default" && (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-200">
            <h1 className="text-3xl font-bold text-slate-800">Welcome to the Admin Portal</h1>
            <p className="text-slate-500 mt-2">Logged in as: <span className="font-mono text-blue-600">{user?.role}</span></p>
          </div>
        )}
{activeTab === "user_management" && <UserManagement />}
        {/* HR Dashboard Content Section */}
{activeTab === "hr_dashboard" && <HRDashboard />}

        {activeTab === "poster_tool" && <PosterTool />}
        
        {activeTab === "claims" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Claims & Mortuaries Management</h2>
            <p>Accessing core claims data as authorized.</p>
          </div>
        )}

        {activeTab === "news" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-green-900">News & Publications</h2>
            <p>Manage public-facing website content.</p>
          </div>
        )}
      </main>
    </div>
  );
}