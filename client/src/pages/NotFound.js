import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404</h1>
      <p>Üzgünüz, aradığınız sayfa bulunamadı.</p>
      <Link to="/">Ana Sayfaya Dön</Link>
    </div>
  );
};

export default NotFound;
