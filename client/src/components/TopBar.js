import React, { useEffect, useRef, useState } from "react";
import { FaUser, FaCloudSun} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const TopBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Dropdown menüsünün referansı
  const userIconRef = useRef(null); // Kullanıcı simgesinin referansı

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Event listener'ı ekle
    document.addEventListener("mousedown", handleClickOutside);

    // Component unmount olduğunda event listener'ı temizle
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Menü açma/kapama
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full bg-white  top-0 left-0 right-0 p-4 shadow-md border-l border-b">
      <div className="flex justify-end items-center space-x-6">
        {/* User Icon */}
        <div className="hover:bg-slate-200 p-4 hover:text-gray-700 rounded-full cursor-pointer text-gray-900">
            <FaCloudSun className="text-2xl"/>
        </div>
        <div className="hover:bg-slate-200 p-4 hover:text-gray-700 rounded-full cursor-pointer text-gray-900">
            <IoMdSettings className="text-2xl"/>
        </div>
        <div className="relative" ref={userIconRef}>
          <div
            onClick={toggleDropdown}
            className="hover:bg-slate-200 border-solid border-blue-200 p-4 hover:text-gray-700 rounded-full cursor-pointer text-gray-900 bg-gray-300"
          >
            <FaUser className="text-2xl" />
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200"
            >
              <div className="p-2">
                <button
                  onClick={() => navigate("/user/profile")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                >
                  Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                >
                  Çıkış
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
