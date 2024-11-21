import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  // localStorage'dan admin token kontrolü
  const adminToken = localStorage.getItem("adminToken");

  // Eğer token yoksa giriş sayfasına yönlendir
  if (!adminToken) {
    return <Navigate to="/admin" />;
  }

  // Eğer token varsa istenen bileşeni render et
  return <Outlet />;
};

export default AdminRoute;
