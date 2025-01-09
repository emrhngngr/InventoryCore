import { User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfileHeader = ({ currentUser, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Dropdown menüsünün referansı
  const userIconRef = useRef(null); // Kullanıcı simgesinin referansı
  const navigate = useNavigate();
  const serverBaseUrl = "http://localhost:5000";

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
        setIsDropdownOpen(false);
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
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={toggleDropdown} // Dropdown'ı toggle et
      >
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {currentUser?.name || "Kullanıcı"}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {currentUser?.role === "admin" ? "Yönetici" : "Kullanıcı"}
          </span>
        </div>
        <div className="relative" ref={userIconRef}>
          {currentUser?.profilePicture ? (
            <img
              src={`${serverBaseUrl}/${currentUser.profilePicture}`}
              alt="Profil"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-gray-200">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menü */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200"
        >
          <div className="p-2">
            <button
              onClick={() => navigate("/user/profile")}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer text-center"
            >
              Profil
            </button>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer text-center"
            >
              Çıkış
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
