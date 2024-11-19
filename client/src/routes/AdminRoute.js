import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("adminToken");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  // Token yoksa veya user admin değilse
  if (!token || !user?.role === "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
