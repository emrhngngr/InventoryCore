import React from "react";
import { Navigate } from "react-router-dom";

const RedirectRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Eğer giriş yapılmışsa kullanıcıyı anasayfaya yönlendir
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Giriş yapılmamışsa verilen sayfayı render et
  return children;
};

export default RedirectRoute;
