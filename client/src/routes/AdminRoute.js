import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("adminToken");

  // Token yoksa veya user admin değilse yönlendir
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Eğer admin ise, alt route'ları render et
  return <Outlet />;
};

export default AdminRoute;
