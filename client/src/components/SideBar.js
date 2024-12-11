import React, { useEffect, useState } from "react";
import { FaBriefcase, FaShoppingBag } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"; // İkonlar için react-icons
import { MdDashboard, MdPerson } from "react-icons/md"; // Menü ikonları
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/users/me");
        setCurrentUser(response.data);
        console.log("data:", response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);
  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-16"
      } h-screen fixed bg-white text-gray-600 transition-all duration-300 border-r`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-0 p-2 bg-gray-600 text-white rounded-l-xl"
      >
        {isSidebarOpen ? (
          <HiChevronLeft className="text-2xl" />
        ) : (
          <HiChevronRight className="text-2xl" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="mt-12">
        {/* Başlık */}
        <div
          className={`m-6 font-bold text-2xl text-center text-gray-600 transition-all duration-300 ${
            isSidebarOpen ? "h-auto" : "h-12"
          } flex items-center justify-center`}
        >
          {isSidebarOpen && "InventoryCore"}
        </div>

        {/* Menü */}
        <ul>
          <li
            onClick={() => navigate("/user/dashboard")}
            className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
          >
            <MdDashboard className="text-2xl min-w-[40px]" />
            {isSidebarOpen && <span className="ml-4">Ana Sayfa</span>}
          </li>
          {currentUser &&
            currentUser.permissions.includes("create_products") && (
              <>
                <li
                  onClick={() => navigate("/user/products")}
                  className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
                >
                  <FaShoppingBag className="text-2xl min-w-[40px]" />
                  {isSidebarOpen && <span className="ml-4">Ürünler</span>}
                </li>
              </>
            )}
          {currentUser &&
            currentUser.permissions.includes("read_categories") && (
              <>
                <li
                  onClick={() => navigate("/user/classes")}
                  className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
                >
                  <FaBriefcase className="text-2xl min-w-[40px]" />
                  {isSidebarOpen && <span className="ml-4">Kategoriler</span>}
                </li>
              </>
            )}
          {currentUser &&
            currentUser.permissions.includes("read_users") && (
              <>
                <li
                  onClick={() => navigate("/user/users")}
                  className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
                >
                  <MdPerson className="text-2xl min-w-[40px]" />
                  {isSidebarOpen && <span className="ml-4">Üyeler</span>}
                </li>
              </>
            )}
            {currentUser &&
            currentUser.permissions.includes("read_users") && (
              <>
                <li
                  onClick={() => navigate("/user/process")}
                  className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
                >
                  <MdPerson className="text-2xl min-w-[40px]" />
                  {isSidebarOpen && <span className="ml-4">İşlemler</span>}
                </li>
              </>
            )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
