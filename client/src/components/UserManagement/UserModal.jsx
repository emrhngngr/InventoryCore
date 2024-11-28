import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FaCheckCircle } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const UserModal = ({
  isOpen,
  onClose,
  editingUser,
  newUser,
  currentUser,
  PERMISSION_CONFIG,
  handleInputChange,
  handleRoleChange,
  togglePermission,
  handleSubmitUser
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Oluştur"}
  >
    <div className="space-y-4">
      <InputField 
        label="Ad Soyad"
        name="name"
        value={newUser.name}
        onChange={handleInputChange}
      />
      <InputField 
        label="E-posta"
        type="email"
        name="email"
        value={newUser.email}
        onChange={handleInputChange}
      />
      <InputField 
        label={editingUser ? "Şifre (Boş bırakılırsa değiştirilmez)" : "Şifre"}
        type="password"
        name="password"
        value={newUser.password}
        onChange={handleInputChange}
      />

      <RoleSelector 
        value={newUser.role}
        onChange={handleRoleChange}
        currentUser={currentUser}
      />

      <PermissionSection 
        permissionConfig={PERMISSION_CONFIG}
        selectedPermissions={newUser.permissions}
        onTogglePermission={togglePermission}
      />

      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onClose}>
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
);

const InputField = ({ label, type = "text", name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
    />
  </div>
);

const RoleSelector = ({ value, onChange, currentUser }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Rol
    </label>
    <select
      value={value}
      onChange={onChange}
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
);

const PermissionSection = ({ 
  permissionConfig, 
  selectedPermissions, 
  onTogglePermission 
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">İzinler</h3>
    {permissionConfig.map((group) => (
      <PermissionGroup 
        key={group.group} 
        group={group} 
        selectedPermissions={selectedPermissions}
        onTogglePermission={onTogglePermission}
      />
    ))}
  </div>
);

const PermissionGroup = ({ group, selectedPermissions, onTogglePermission }) => (
  <div key={group.group} className="mb-4">
    <h3 className="text-md font-semibold mb-2">{group.group}</h3>
    <div className="grid grid-cols-2 gap-2">
      {group.permissions.map((perm) => (
        <Button
          key={perm.key}
          variant={
            selectedPermissions.includes(perm.key) ? "default" : "outline"
          }
          onClick={() => onTogglePermission(perm.key)}
          className="justify-between"
        >
          {perm.label}
          {selectedPermissions.includes(perm.key) ? (
            <FaCheckCircle className="ml-2 h-4 w-4" />
          ) : (
            <RxCross2 className="ml-2 h-4 w-4 text-red-500" />
          )}
        </Button>
      ))}
    </div>
  </div>
);

export default UserModal;