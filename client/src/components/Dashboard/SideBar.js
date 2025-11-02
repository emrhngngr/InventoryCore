import React, { useEffect, useState } from "react";
import { FaBriefcase, FaShoppingBag } from "react-icons/fa";
import { IoMdBuild } from "react-icons/io";
import { IoCloud, IoNewspaperSharp } from "react-icons/io5";
import { LuArrowLeftFromLine, LuArrowRightFromLine } from "react-icons/lu";
import { MdDashboard, MdOutlinePendingActions, MdPerson } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation added
import api from "../../api/api";
import { FaChartSimple } from "react-icons/fa6";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation(); // to get current URL
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

  // Helper to check active page
  const isActivePage = (path) => {
    return location.pathname === path;
  };

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
            {isSidebarOpen ? <IoCloud className="w-10 h-8 text-blue-500" /> : ""}
            <span className="text-xl font-semibold text-gray-800">
              {isSidebarOpen && "InventoryCore"}
            </span>
          </div>
        </div>

        <ul>
          <li
            onClick={() => navigate("/user/dashboard")}
            className={`flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md ${
              isActivePage("/user/dashboard") ? "bg-gray-200" : ""
            }`}
          >
            <MdDashboard className="text-2xl min-w-[40px]" />
            {isSidebarOpen && <span className="ml-4">Home</span>}
          </li>
          {currentUser && currentUser.role === "admin" && (
            <>
              <li
                onClick={() => navigate("/user/products")}
                className={`flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md ${
                  isActivePage("/user/products") ? "bg-gray-200" : ""
                }`}
              >
                <FaShoppingBag className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Assets</span>}
              </li>
              <li
                onClick={() => navigate("/user/classes")}
                className={`flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md ${
                  isActivePage("/user/classes") ? "bg-gray-200" : ""
                }`}
              >
                <FaBriefcase className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Categories</span>}
              </li>
              <li
                onClick={() => navigate("/user/users")}
                className={`flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md ${
                  isActivePage("/user/users") ? "bg-gray-200" : ""
                }`}
              >
                <MdPerson className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Users</span>}
              </li>
              <li
                onClick={() => navigate("/user/process")}
                className={`flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md ${
                  isActivePage("/user/process") ? "bg-gray-200" : ""
                }`}
              >
                <IoMdBuild className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Processes</span>}
              </li>
              <li
                onClick={() => navigate("/user/announcements")}
                className={`flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md ${
                  isActivePage("/user/announcements") ? "bg-gray-200" : ""
                }`}
              >
                <IoNewspaperSharp className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Announcements</span>}
              </li>
              <li
                onClick={() => navigate("/user/logs")}
                className={`flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md ${
                  isActivePage("/user/logs") ? "bg-gray-200" : ""
                }`}
              >
                <MdOutlinePendingActions className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Activity</span>}
              </li>
              <li
                onClick={() => navigate("/user/statistics")}
                className={`flex items-center py-4 px-4 hover:bg-gray-200 cursor-pointer rounded-md ${
                  isActivePage("/user/statistics") ? "bg-gray-200" : ""
                }`}
              >
                <FaChartSimple className="text-2xl min-w-[40px]" />
                {isSidebarOpen && <span className="ml-4">Statistics</span>}
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;