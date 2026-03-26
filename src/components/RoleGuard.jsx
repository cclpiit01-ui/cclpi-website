// src/components/RoleGuard.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/constants/roles";

export const RoleGuard = ({ requiredPermission }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if the user's role has the specific permission needed
  const hasAccess = PERMISSIONS[user?.role]?.includes(requiredPermission);
  
  // If they don't have access, they get sent to /unauthorized
  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};