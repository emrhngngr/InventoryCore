import React, { useState } from "react";
import Sidebar from "../../components/SideBar.js";
import TopBar from "../../components/TopBar.js";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* TopBar */}
        <TopBar />

        {/* Content Area */}
        <div className="flex-1 p-8 pt-20 bg-gray-100">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
