import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Çıkış işlemi: Token'ı silip kullanıcıyı login sayfasına yönlendir
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">Uygulama</h1>
      <div>
        {/* Eğer token varsa, çıkış butonunu göster */}
        {localStorage.getItem("adminToken") ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          >
            Çıkış Yap
          </button>
        ) : (
          // Eğer token yoksa, giriş ve kayıt butonlarını göster
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 mr-2"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Kayıt Ol
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
