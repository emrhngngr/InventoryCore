import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfileHeader from "./UserProfileHeader";
import api from "../../api/api";
const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Dropdown menüsünün referansı
  const userIconRef = useRef(null); // Kullanıcı simgesinin referansı
  const [currentUser, setCurrentUser] = useState(null);


  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/users/me");
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

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
        <div className="relative" ref={userIconRef}>
          <UserProfileHeader currentUser={currentUser}/>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
