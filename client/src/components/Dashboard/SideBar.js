import React, { useEffect, useState } from "react";
import { FaBriefcase, FaShoppingBag } from "react-icons/fa";
import { IoMdBuild } from "react-icons/io";
import { IoCloud, IoNewspaperSharp } from "react-icons/io5";
import { LuArrowLeftFromLine, LuArrowRightFromLine } from "react-icons/lu";
import { MdDashboard, MdOutlinePendingActions, MdPerson } from "react-icons/md"; // Menü ikonları
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { FaChartSimple } from "react-icons/fa6";
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
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
  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-16"
      } h-screen fixed bg-white text-gray-600 transition-all duration-300 border-r`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-0 p-2 hover:bg-slate-100 text-white rounded-l-xl"
      >
        {isSidebarOpen ? (
          <LuArrowLeftFromLine className="text-xl text-gray-600" />
        ) : (
          <LuArrowRightFromLine className="text-xl text-gray-600" />
        )}
      </button>

      <div className="mt-12">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-3">
            {isSidebarOpen ? <IoCloud className="w-8 h-8 text-blue-500" /> : ""}
            <span className="text-xl font-semibold text-gray-800">
              {isSidebarOpen && "InventoryCore"}
            </span>
          </div>
        </div>

        <ul>
          <li
            onClick={() => navigate("/user/dashboard")}
            className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
          >
            <MdDashboard className="text-2xl min-w-[40px]" />
            {isSidebarOpen && <span className="ml-4">Ana Sayfa</span>}
          </li>
          {currentUser && currentUser.role.includes("admin") && (
            <>
              <li
                onClick={() => navigate("/user/products")}
                className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
              >
                <FaShoppingBag className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Varlıklar</span>}
              </li>
            </>
          )}
          {currentUser && currentUser.role.includes("admin") && (
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
            (currentUser.role.includes("human resources") ||
              currentUser.role.includes("admin")) && (
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
          {currentUser && currentUser.role.includes("admin") && (
            <>
              <li
                onClick={() => navigate("/user/process")}
                className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
              >
                <IoMdBuild className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">İşlemler</span>}
              </li>
            </>
          )}
          {currentUser && currentUser.role.includes("admin") && (
            <>
              <li
                onClick={() => navigate("/user/announcements")}
                className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
              >
                <IoNewspaperSharp className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Duyurular</span>}
              </li>
            </>
          )}
          {currentUser && currentUser.role.includes("admin") && (
            <>
              <li
                onClick={() => navigate("/user/logs")}
                className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
              >
                <MdOutlinePendingActions className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Aktivite</span>}
              </li>
            </>
          )}
          {currentUser && currentUser.role.includes("admin") && (
            <>
              <li
                onClick={() => navigate("/user/statistics")}
                className="flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md"
              >
                <FaChartSimple className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">İstatiklikler</span>}
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
