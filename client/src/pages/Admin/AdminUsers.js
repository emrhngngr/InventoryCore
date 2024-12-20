import React, { useState, useEffect } from 'react';
import UserTable from '../../components/UserManagement/UserTable';
import UserModal from '../../components/UserManagement/UserModal';
import Button from '../../components/common/Button';
import { FaSort, FaSortDown, FaSortUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../../api/api'

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    direction: 'ascending'
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    permissions: [],
    profilePictureFile: null,
    preview: null,
    profilePicture: null // Existing profile picture URL
  });

  const handleProfilePictureChange = (e) => {
    const { name, value, preview } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value,
      preview: preview || prev.preview
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
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
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
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
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
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
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
    return sortConfig.direction === 'ascending' 
      ? <FaSortUp className="inline ml-1" /> 
      : <FaSortDown className="inline ml-1" />;
  };

  // Handle input changes for new user
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file upload separately
    if (name === 'profilePictureFile') {
      setNewUser((prev) => ({
        ...prev,
        profilePictureFile: value,
        preview: e.preview // Add preview URL
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
      permissions: ROLE_PERMISSIONS[selectedRole] || [],
    }));
  };

  // Toggle permission
  const togglePermission = (permissionKey) => {
    setNewUser((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter((p) => p !== permissionKey)
        : [...prev.permissions, permissionKey],
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
      permissions: user.permissions || [],
      profilePicture: user.profilePicture 
      ? `${serverBaseUrl}/${user.profilePicture}` // Profil fotoğrafının tam URL'sini oluşturun
      : null, // Profil fotoğrafı yoksa null      preview: null, // Düzenleme sırasında önizleme sıfırlanır
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
      permissions: [],
    });
    setEditingUser(null);
  };

  // Submit user (create/update)
  const handleSubmitUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      // Append all user data
      formData.append('name', newUser.name);
      formData.append('email', newUser.email);
      formData.append('password', newUser.password);
      formData.append('role', newUser.role);
      
      // Append permissions
      newUser.permissions.forEach((permission, index) => {
        formData.append(`permissions[${index}]`, permission);
      });
  
      // Append profile picture if selected
      if (newUser.profilePictureFile) {
        formData.append('profilePicture', newUser.profilePictureFile);
      }
  
      const headers = {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
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
      } else {
        // Create new user
        response = await api.post(
          "http://localhost:5000/api/users",
          formData,
          { headers }
        );
  
        // Add new user to list
        setUsers((prev) => [...prev, response.data]);
      }
  
      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Kullanıcı kaydedilirken bir hata oluştu");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        // Remove user from state
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Kullanıcı silinirken bir hata oluştu");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Kullanıcı Yönetimi
          </h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="İsim veya e-posta ile ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <Button onClick={() => setIsModalOpen(true)}>
              Yeni Kullanıcı Ekle
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Yükleniyor...</div>
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
                  {` (Toplam ${filteredUsers.length} kullanıcı)`}
                </div>
                
                {/* Users per page selector */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="users-per-page" className="text-sm text-gray-600">
                    Sayfa başına:
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
                  <FaChevronLeft className="mr-2" /> Önceki
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
        PERMISSION_CONFIG={PERMISSION_CONFIG}
        handleInputChange={handleInputChange}
        handleRoleChange={handleRoleChange}
        togglePermission={togglePermission}
        handleSubmitUser={handleSubmitUser}
        handleProfilePictureChange ={handleProfilePictureChange}
      />
    </div>
  );
};

export default UserManagement;

const PERMISSION_CONFIG = [
  {
      group: "Ürünler",
      permissions: [
        { key: "read_products", label: "Ürünleri Görüntüleme" },
        { key: "create_products", label: "Ürün Ekleme" },
        { key: "edit_products", label: "Ürün Düzenleme" },
        { key: "delete_products", label: "Ürün Silme" },
      ],
    },
    {
      group: "Kategoriler",
      permissions: [
        { key: "read_categories", label: "Kategorileri Görüntüleme" },
        { key: "create_categories", label: "Kategoriler Ekleme" },
        { key: "edit_categories", label: "Kategoriler Düzenleme" },
        { key: "delete_categories", label: "Kategoriler Silme" },
      ],
    },
    {
      group: "Kullanıcılar",
      permissions: [
        { key: "read_users", label: "Kullanıcıları Görüntüleme" },
        { key: "manage_users", label: "Kullanıcı Yönetimi" },
      ],
    }
];

const ROLE_PERMISSIONS = {
  product_viewer: ["read_products"],
  product_manager: [
    "read_products",
    "create_products",
    "edit_products",
    "delete_products",
  ],
  user_manager: ["read_users", "manage_users"],
  category_manager: [
    "read_categories",
    "create_categories",
    "edit_categories",
    "delete_categories",
  ],
  admin: [
    "read_products",
    "create_products",
    "edit_products",
    "delete_products",
    "read_categories",
    "create_categories",
    "edit_categories",
    "delete_categories",
    "read_users",
    "manage_users",
  ],
  user: [], // Default kullanıcı rolü
};