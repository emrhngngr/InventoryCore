import React from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
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
        {['name', 'email', 'role', 'lastLogin', 'createdAt'].map(key => (
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

  return (
    <tr className="hover:bg-gray-50">
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
        {canModify && (
          <>
            <Button
              variant="outline"
              className="text-sm"
              onClick={onEdit}
            >
              Düzenle
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

const getColumnLabel = (key) => {
  const labels = {
    name: 'Ad',
    email: 'E-posta',
    role: 'Rol',
    lastLogin: 'Son Giriş',
    createdAt: 'Oluşturulma Tarihi'
  };
  return labels[key];
};

export default UserTable;