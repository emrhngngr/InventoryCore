import axios from "axios";
import React, { useEffect, useState } from "react";

const ActiveAnnouncement = () => {
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);

  useEffect(() => {
    const fetchActiveAnnouncement = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/announcements/active"
        );
        setActiveAnnouncement(response.data);
      } catch (error) {
        console.error("Error loading announcement:", error);
      }
    };

    fetchActiveAnnouncement();
  }, []);

  return (
    <div className="col-span-12 lg:col-span-4 p-5 md:p-10 border bg-white shadow-lg rounded-xl transform transition-all hover:scale-105 duration-300">
      <h2 className="font-bold text-xl mb-4">Current Announcement</h2>
      <div className="p-4 bg-slate-50 border rounded border-gray-300 my-4">
        {activeAnnouncement
          ? activeAnnouncement.content
          : "No active announcement found."}
      </div>
    </div>
  );
};

export default ActiveAnnouncement;
