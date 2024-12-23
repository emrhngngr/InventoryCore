import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // lucide-react'ten ikonlar

const Navbar = ({ backgroundColor, hoverBackgroundColor, textColor, hoverTextColor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger menü durumu

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrollPosition > 50
          ? `bg-${hoverBackgroundColor} shadow-lg text-${hoverTextColor}`
          : `bg-${backgroundColor} text-${textColor}`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span
              className="text-xl font-bold hover:text-[#3e7bca] cursor-pointer"
              onClick={() => navigate("/")}
            >
              InventoryCore
            </span>
          </div>

          {/* Hamburger Menu Icon */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden lg:flex items-center space-x-4`}>
            <button
              className={`px-4 py-2 font-bold hover:text-[#3e7bca] transition-colors ${
                location.pathname === "/services" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => navigate("/services")}
            >
              Servisler
            </button>
            <button
              className={`px-4 py-2 font-bold hover:text-[#3e7bca] transition-colors ${
                location.pathname === "/contact" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => navigate("/contact")}
            >
              İletişim
            </button>
            <button
              className="px-4 py-2 font-bold bg-[#6c63ff] rounded-md text-white transition-colors"
              onClick={() => navigate("/login")}
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white py-4">
          <div className="flex flex-col items-center space-y-4">
            <button
              className="px-4 py-2 font-bold hover:text-[#3e7bca] transition-colors"
              onClick={() => navigate("/services")}
            >
              Servisler
            </button>
            <button
              className="px-4 py-2 font-bold hover:text-[#3e7bca] transition-colors"
              onClick={() => navigate("/contact")}
            >
              İletişim
            </button>
            <button
              className="px-4 py-2 font-bold bg-[#6c63ff] rounded-md text-white transition-colors"
              onClick={() => navigate("/login")}
            >
              Giriş Yap
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
