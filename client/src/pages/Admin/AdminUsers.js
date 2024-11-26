import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const Button = ({
  children,
  variant = "default",
  className = "",
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-between";

  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    permissions: [],
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10); // Her sayfada 10 kullanıcı
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const getFilteredUsers = () => {
    if (!searchTerm) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Sıralanmış ve filtrelenmiş kullanıcıları al
  const getSortedUsers = () => {
    let sortableUsers = [...getFilteredUsers()];
    
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

  // Sayfalama için kullanılacak fonksiyonlar
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  
  const currentUsers = getSortedUsers().slice(
    indexOfFirstUser, 
    indexOfLastUser
  );

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(getSortedUsers().length / usersPerPage);

  // Sayfa değiştirme fonksiyonları
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

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    // Sayfalamayı sıfırla
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <FaSortUp className="inline ml-1" /> 
      : <FaSortDown className="inline ml-1" />;
  };




  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: token },
        });
        setCurrentUser(response.data);
        console.log("data:", response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Predefined permission configurations
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
    },
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

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setNewUser((prev) => ({
      ...prev,
      role: selectedRole,
      permissions: ROLE_PERMISSIONS[selectedRole] || [],
    }));
  };

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
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

  const handleEditClick = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: "", // Empty password field for editing
      role: user.role,
      permissions: user.permissions || [],
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
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

  // Handle input changes for new user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
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

  // Submit new user
  const handleSubmitUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };

      let response;
      if (editingUser) {
        // Update existing user
        response = await axios.put(
          `http://localhost:5000/api/users/${editingUser._id}`,
          newUser,
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
        response = await axios.post(
          "http://localhost:5000/api/users",
          newUser,
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

  // Render permission toggle buttons
  const renderPermissionToggles = () => {
    return PERMISSION_CONFIG.map((group) => (
      <div key={group.group} className="mb-4">
        <h3 className="text-md font-semibold mb-2">{group.group}</h3>
        <div className="grid grid-cols-2 gap-2">
          {group.permissions.map((perm) => (
            <Button
              key={perm.key}
              variant={
                newUser.permissions.includes(perm.key) ? "default" : "outline"
              }
              onClick={() => togglePermission(perm.key)}
              className="justify-between"
            >
              {perm.label}
              {newUser.permissions.includes(perm.key) ? (
                <FaCheckCircle className="ml-2 h-4 w-4" />
              ) : (
                <RxCross2 className="ml-2 h-4 w-4 text-red-500" />
              )}
            </Button>
          ))}
        </div>
      </div>
    ));
  };


  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Kullanıcı Yönetimi
          </h2>
          <div className="flex space-x-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="İsim veya e-posta ile ara..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              Yeni Kullanıcı Ekle
            </Button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th
                  onClick={() => requestSort("name")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Ad {getSortIcon("name")}
                </th>
                <th
                  onClick={() => requestSort("email")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  E-posta {getSortIcon("email")}
                </th>
                <th
                  onClick={() => requestSort("role")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Rol {getSortIcon("role")}
                </th>
                <th
                  onClick={() => requestSort("lastLogin")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Son Giriş {getSortIcon("lastLogin")}
                </th>
                <th
                  onClick={() => requestSort("createdAt")}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Oluşturulma Tarihi {getSortIcon("createdAt")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString("tr-TR")
                      : "Henüz giriş yapılmadı"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {currentUser &&
                      currentUser.role !== "admin" &&
                      user.role !== "admin" && (
                        <>
                          <Button
                            variant="outline"
                            className="text-sm"
                            onClick={() => handleEditClick(user)}
                          >
                            Düzenle
                          </Button>
                          <Button
                            variant="destructive"
                            className="text-sm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Sil
                          </Button>
                        </>
                      )}

                    {currentUser && currentUser.role === "admin" && (
                      <>
                        <Button
                          variant="outline"
                          className="text-sm"
                          onClick={() => handleEditClick(user)}
                        >
                          Düzenle
                        </Button>
                        <Button
                          variant="destructive"
                          className="text-sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Sil
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {/* Pagination Kontrolü */}
        <div className="flex justify-between items-center mt-4 px-4">
          {/* Sayfa Bilgisi */}
          <div className="text-sm text-gray-700">
            Sayfa {currentPage} / {totalPages} 
            <span className="ml-4">
              Toplam {getSortedUsers().length} kullanıcıdan 
              {' '}
              {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, getSortedUsers().length)} 
              {' '}arası gösteriliyor
            </span>
          </div>

          {/* Sayfalama Düğmeleri */}
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={prevPage} 
              disabled={currentPage === 1}
              className="px-4 py-2"
            >
              Önceki Sayfa
            </Button>
            <Button 
              variant="outline"
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className="px-4 py-2"
            >
              Sonraki Sayfa
            </Button>
          </div>
        </div>

        {/* Sayfa Başına Kullanıcı Sayısı Seçimi */}
        <div className="mt-4 px-4">
          <label className="block text-sm font-medium text-gray-700">
            Sayfa Başına Kullanıcı Sayısı
          </label>
          <select 
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(Number(e.target.value));
              setCurrentPage(1); // Sayfa sayısını sıfırla
            }}
            className="mt-1 block w-32 border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            {[5, 10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} Kullanıcı
              </option>
            ))}
          </select>
        </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        title={editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Oluştur"}
      >
        <div className="space-y-4">
          {/* Input Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {editingUser ? "Şifre (Boş bırakılırsa değiştirilmez)" : "Şifre"}
            </label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              value={newUser.role}
              onChange={handleRoleChange} // handleInputChange yerine handleRoleChange kullanıyoruz.
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            >
              <option value="user">Kullanıcı</option>
              <option value="product_viewer">Ürün Görüntüleyici</option>
              <option value="product_manager">Ürün Yöneticisi</option>
              <option value="user_manager">Üye Yöneticisi</option>
              <option value="category_manager">Kategori Yöneticisi</option>

              {currentUser?.role === "admin" && (
                <option value="admin">Yönetici</option>
              )}
            </select>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İzinler</h3>
            {renderPermissionToggles()}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsModalOpen(false);
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmitUser}
              disabled={
                !newUser.name ||
                !newUser.email ||
                (!editingUser && !newUser.password)
              }
            >
              {editingUser ? "Kaydet" : "Kullanıcı Oluştur"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
