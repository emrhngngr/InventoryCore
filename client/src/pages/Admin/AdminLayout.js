import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Dashboard/SideBar.js";
import TopBar from "../../components/Dashboard/TopBar.js";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1028);
      if (window.innerWidth < 1028) {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out z-30 h-full`}
      >
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 
            ${isSidebarOpen ? "lg:ml-64" : "lg:ml-16"}
            pt-16`}
        >
          <div className="w-full ml-10 px-4 pr-20 md:px-6 md:pr-20 lg:px-8 lg:pr-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
