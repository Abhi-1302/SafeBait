import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx"; 

export default function PrivateAdminRoute() {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
