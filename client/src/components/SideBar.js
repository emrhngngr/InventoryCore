import React from "react";
import { FaBriefcase, FaShoppingBag } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"; // İkonlar için react-icons
import { MdDashboard, MdPerson } from "react-icons/md"; // Menü ikonları
import { useNavigate } from "react-router-dom";


const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

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
          <li onClick={() => navigate("/user/dashboard")} className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md">
            <MdDashboard className="text-2xl min-w-[40px]" />
            {isSidebarOpen && <span className="ml-4">Ana Sayfa</span>}
          </li>
          <li onClick={() => navigate("/user/products")} className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md">
            <FaShoppingBag className="text-2xl min-w-[40px]" />
            {isSidebarOpen && <span className="ml-4">Ürünler</span>}
          </li>
          <li onClick={() => navigate("/user/classes")} className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md">
            <FaBriefcase className="text-2xl min-w-[40px]" />
            {isSidebarOpen && <span className="ml-4">Sınıflar</span>}
          </li>
          <li onClick={() => navigate("/user/users")} className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md">
            <MdPerson className="text-2xl min-w-[40px]" />
            {isSidebarOpen && <span className="ml-4">Üyeler</span>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
