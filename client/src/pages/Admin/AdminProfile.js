import React, { useEffect, useState } from "react";
import api from "../../api/api";

const AdminProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const serverBaseUrl = "http://localhost:5000"; // Backend'in temel URL'si
  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: token },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);
  return (
    <>
      <img
        src={
          currentUser && currentUser.profilePicture
            ? `${serverBaseUrl}/${currentUser.profilePicture}`
            : null
        }
        alt="profile pic"
      />
      <div>{currentUser ? currentUser.email : null}</div>
      <div>{currentUser ? currentUser.name : null}</div>
      <div>{currentUser ? currentUser.role : null}</div>
      <div>{currentUser ? currentUser.password : null}</div>
    </>
  );
};

export default AdminProfile;
