import React from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';

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
  handleSubmitUser,
  handleProfilePictureChange
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfilePictureChange({
          target: {
            name: 'profilePictureFile',
            value: file,
            preview: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
  title={editingUser ? "Edit User" : "Create New User"}
    >
      <div className="space-y-4">
        {/* Profile Picture Upload */}
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <InputField 
              label="Full Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex-shrink-0">
            <input 
              type="file" 
              id="profilePicture"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="profilePicture" 
              className="cursor-pointer"
            >
              <div className="w-24 h-24 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                {newUser.preview || newUser.profilePicture ? (
                  <img 
                    src={newUser.preview || newUser.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Add Photo</span>
                )}
              </div>
            </label>
          </div>
        </div>

        <InputField 
          label="Email"
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
        />
        <InputField 
          label={editingUser ? "Password (leave blank to keep unchanged)" : "Password"}
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

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitUser}
            disabled={
              !newUser.name ||
              !newUser.email ||
              (!editingUser && !newUser.password)
            }
          >
            {editingUser ? "Save" : "Create User"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

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
      Role
    </label>
    <select
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
    >
      <option value="system_group">System Group</option>
      <option value="a_group">Group A</option>
      <option value="software_group">Software Group</option>
      <option value="technical_service">Technical Service</option>
      {currentUser?.role === "admin" && (
        <option value="admin">Admin</option>
      )}
    </select>
  </div>
);

// const PermissionSection = ({ 
//   permissionConfig, 
//   selectedPermissions, 
//   onTogglePermission 
// }) => (
//   <div>
//     <h3 className="text-lg font-semibold mb-4">Permissions</h3>
//     {permissionConfig.map((group) => (
//       <PermissionGroup 
//         key={group.group} 
//         group={group} 
//         selectedPermissions={selectedPermissions}
//         onTogglePermission={onTogglePermission}
//       />
//     ))}
//   </div>
// );

// const PermissionGroup = ({ group, selectedPermissions, onTogglePermission }) => (
//   <div key={group.group} className="mb-4">
//     <h3 className="text-md font-semibold mb-2">{group.group}</h3>
//     <div className="grid grid-cols-2 gap-2">
//       {group.permissions.map((perm) => (
//         <Button
//           key={perm.key}
//           variant={
//             selectedPermissions.includes(perm.key) ? "default" : "outline"
//           }
//           onClick={() => onTogglePermission(perm.key)}
//           className="justify-between"
//         >
//           {perm.label}
//           {selectedPermissions.includes(perm.key) ? (
//             <FaCheckCircle className="ml-2 h-4 w-4" />
//           ) : (
//             <RxCross2 className="ml-2 h-4 w-4 text-red-500" />
//           )}
//         </Button>
//       ))}
//     </div>
//   </div>
// );

export default UserModal;