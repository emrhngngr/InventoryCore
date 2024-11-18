import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Token'ı temizle
    localStorage.removeItem("token");
    // Kullanıcıyı giriş sayfasına yönlendir
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">Uygulama</h1>
      <div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
        >
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
