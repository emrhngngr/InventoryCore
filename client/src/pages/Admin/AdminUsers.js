import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../api/api";
import UserModal from "../../components/UserManagement/UserModal";
import UserTable from "../../components/UserManagement/UserTable";
import Button from "../../components/common/Button";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const serverBaseUrl = "http://localhost:5000"; // Backend'in temel URL'si

  // Add array of users per page options
  const [usersPerPageOptions] = useState([5, 10, 20, 50, 100]);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "system_group",
    permissions: [],
    profilePictureFile: null,
    preview: null,
    profilePicture: null, // Existing profile picture URL
  });

  const handleProfilePictureChange = (e) => {
    const { name, value, preview } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
      preview: preview || prev.preview,
    }));
  };
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("http://localhost:5000/api/users", {});
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtering users
  const getFilteredUsers = () => {
    if (!searchTerm) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Sorting users
  const getSortedUsers = (filteredUsers) => {
    let sortableUsers = [...filteredUsers];

    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  };

  // Pagination calculations
  const filteredUsers = getFilteredUsers();
  const sortedUsers = getSortedUsers(filteredUsers);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Get current users for pagination
  const getCurrentUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  };

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle users per page change
  const handleUsersPerPageChange = (e) => {
    const newUsersPerPage = parseInt(e.target.value);
    setUsersPerPage(newUsersPerPage);

    // Reset to first page when changing users per page
    setCurrentPage(1);
  };

  // Sort request handler
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    // Reset to first page when sorting
    setCurrentPage(1);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-50" />;
    }
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  // Handle input changes for new user
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle file upload separately
    if (name === "profilePictureFile") {
      setNewUser((prev) => ({
        ...prev,
        profilePictureFile: value,
        preview: e.preview, // Add preview URL
      }));
      return;
    }

    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle role change
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setNewUser((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  // Handle edit user click
  const handleEditClick = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      profilePicture: user.profilePicture
        ? `${serverBaseUrl}/${user.profilePicture}`
  : null, // null if no profile picture
    });
    setIsModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      // permissions: [],
    });
    setEditingUser(null);
  };

  // Submit user (create/update)
  const handleSubmitUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
  toast.error("Please enter a valid email address!");
      return;
    }
    if(newUser.name.length <= 2){
  toast.error("Username must be at least 2 characters");
      return;
    }
    if(newUser.password.length < 6){
  toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append all user data
      formData.append("name", newUser.name);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("role", newUser.role);

      // Append profile picture if selected
      if (newUser.profilePictureFile) {
        formData.append("profilePicture", newUser.profilePictureFile);
      }

      const headers = {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      };

      let response;
      if (editingUser) {
        // Update existing user
        response = await api.put(
          `http://localhost:5000/api/users/${editingUser._id}`,
          formData,
          { headers }
        );

        // Update users list
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser._id ? response.data : user
          )
        );
        Swal.fire({
          icon: "success",
          title: "User updated!",
          confirmButtonText: "Tamam",
          timer: 3000,
        });
      } else {
        // Create new user
        response = await api.post("http://localhost:5000/api/users", formData, {
          headers,
        });

        // Add new user to list
        setUsers((prev) => [...prev, response.data]);
        Swal.fire({
          icon: "success",
          title: "New user added!",
          confirmButtonText: "Tamam",
          timer: 3000,
        });
      }

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
  toast.error("An error occurred while saving the user");
      console.error("Error saving user:", error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
  text: "Are you sure you want to delete this user? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
  cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`http://localhost:5000/api/users/${userId}`, {});

        // Remove user from state
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        Swal.fire({
          icon: "success",
          title: "User deleted!",
          confirmButtonText: "Tamam",
          timer: 3000,
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while deleting the user.",
          confirmButtonText: "Tamam",
          timer: 3000,
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            User Management
          </h2>
          <div className="flex flex-col mt-4 md:mt-0 space-y-4 md:space-y-0 md:flex-row md:space-x-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="px-4 py-1.5 border border-gray-300 rounded-md"
            />
            <Button 
            className=""
             onClick={() => setIsModalOpen(true)}>
              Add New User
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <ClipLoader color="#3498db" size={50} />
          </div>
        ) : (
          <>
            <UserTable
              currentUsers={getCurrentUsers()}
              currentUser={currentUser}
              requestSort={requestSort}
              getSortIcon={getSortIcon}
              handleEditClick={handleEditClick}
              handleDeleteUser={handleDeleteUser}
            />

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Sayfa {currentPage} / {totalPages}
                  {` (Total ${filteredUsers.length} users)`}
                </div>

                {/* Users per page selector */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="users-per-page"
                    className="text-sm text-gray-600"
                  >
                    Per page:
                  </label>
                  <select
                    id="users-per-page"
                    value={usersPerPage}
                    onChange={handleUsersPerPageChange}
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    {usersPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <FaChevronLeft className="mr-2" /> Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  Sonraki <FaChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        editingUser={editingUser}
        newUser={newUser}
        currentUser={currentUser}
        handleInputChange={handleInputChange}
        handleRoleChange={handleRoleChange}
        handleSubmitUser={handleSubmitUser}
        handleProfilePictureChange={handleProfilePictureChange}
      />
    </div>
  );
};

export default UserManagement;
