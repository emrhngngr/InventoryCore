import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, children }) => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  // Admin kontrolü
  if (isAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Eğer kullanıcı erişime uygun değilse
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Tüm kontrolleri geçtiyse
  return children;
};

export default ProtectedRoute;
