import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const LoginRoute = () => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  if (!token || !user?.role === "customer") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default LoginRoute;
