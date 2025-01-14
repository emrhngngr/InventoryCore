import { Pen } from 'lucide-react';
import React from 'react';
import Button from '../common/Button';

const UserTable = ({ 
  currentUsers, 
  currentUser, 
  requestSort, 
  getSortIcon, 
  handleEditClick, 
  handleDeleteUser 
}) => (
  <table className="w-full">
    <thead className="bg-gray-100">
      <tr>
        {['profilePicture','name', 'email', 'role', 'createdAt'].map(key => (
          <th
            key={key}
            onClick={() => requestSort(key)}
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
          >
            {getColumnLabel(key)} {getSortIcon(key)}
          </th>
        ))}
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          İşlemler
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {currentUsers.map((user) => (
        <UserTableRow 
          key={user._id} 
          user={user} 
          currentUser={currentUser}
          onEdit={() => handleEditClick(user)}
          onDelete={() => handleDeleteUser(user._id)}
        />
      ))}
    </tbody>
  </table>
);

const UserTableRow = ({ user, currentUser, onEdit, onDelete }) => {
  const canModify = 
    currentUser?.role === 'admin' || 
    (currentUser?.role !== 'admin' && user.role !== 'admin');
    const serverBaseUrl = "http://localhost:5000"; // Backend'in temel URL'si
    const defaultPhoto = "uploads/profile-pictures/1732807319854-Person.png"


  return (
    <tr className="hover:bg-gray-50">
      <td className='px-4 py-4'>       
          <img 
          src={user.profilePicture 
            ? `${serverBaseUrl}/${user.profilePicture}` 
            : `${serverBaseUrl}/${defaultPhoto}` } // Eğer fotoğraf yoksa varsayılan bir resim
          alt={`${user.name} profil resmi`}
          className="w-10 h-10 rounded-full object-cover"
        /></td>
      <td className="px-4 py-3">{user.name}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            user.role === "admin"
            ? "bg-red-100 text-red-800"
            : user.role === "system_group"
            ? "bg-green-100 text-green-800"
            : user.role === "a_group"
            ? "bg-yellow-100 text-yellow-800"
            : user.role === "software_group"
            ? "bg-blue-100 text-blue-800"
            : user.role === "technical_service"
            ? "bg-indigo-200 text-indigo-800"
            : "bg-gray-100 text-gray-800"
          }`}
        >
           {translateRole(user.role)}
        </span>
      </td>
      <td className="px-4 py-3">
        {new Date(user.createdAt).toLocaleString("tr-TR")}
      </td>
      <td className="px-4 flex py-3 space-x-2">
        {canModify && (
          <>
            <Button
              variant="outline"
              className="text-sm"
              onClick={onEdit}
            >
                      <Pen size={16} />
                      </Button>
          
            <Button
              variant="destructive"
              className="text-sm"
              onClick={onDelete}
            >
              Sil
            </Button>
          </>
        )}
      </td>
    </tr>
  );
};

// İngilizce role değerlerini Türkçe'ye çeviren fonksiyon
const translateRole = (role) => {
  const roleTranslations = {
    admin: 'Yönetici',
    system_group: 'Sistem Grubu',
    a_group: 'A Grubu',
    software_group: 'Yazılım Grubu',
    technical_service: 'Teknik Servis',
  };
  return roleTranslations[role] || 'Bilinmeyen Rol';
};

const getColumnLabel = (key) => {
  const labels = {
    profilePicture: 'Fotoğraf',
    name: 'Ad',
    email: 'E-posta',
    role: 'Rol',
    createdAt: 'Oluşturulma Tarihi'
  };
  return labels[key];
};

export default UserTable;