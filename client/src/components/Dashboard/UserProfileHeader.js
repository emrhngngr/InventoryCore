import { User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const UserProfileHeader = ({ currentUser, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // reference for the dropdown menu
  const userIconRef = useRef(null); // reference for the user icon
  const navigate = useNavigate();

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

    // add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle menu open/close
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
  onClick={toggleDropdown} // toggle the dropdown
      >
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {currentUser?.name || "User"}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {currentUser?.role === "admin"
              ? "Admin"
              : currentUser?.role === "a_group"
              ? "Group A"
              : currentUser?.role === "system_group"
              ? "System Group"
              : currentUser?.role === "software_group"
              ? "Software Group"
              : currentUser?.role === "technical_service"
              ? "Technical Service"
              : "User"}
          </span>
        </div>
        <div className="relative" ref={userIconRef}>
          {currentUser?.profilePicture ? (
            <img
              src={`${process.env.REACT_APP_URL}/${currentUser.profilePicture}`}
                alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-gray-200">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
      </div>

  {/* Dropdown menu */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200"
        >
          <button
            className="flex items-center gap-x-4 w-full px-4 py-2 text-md justify-center text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
            onClick={handleLogout}
          >
            <CiLogout className="w-5 h-5 text-gray-500" />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
