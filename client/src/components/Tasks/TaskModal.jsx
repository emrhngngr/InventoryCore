import React, { useState } from 'react';

export const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignedTo: 'system_group'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Yeni Görev Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={task.title}
              onChange={(e) => setTask({...task, title: e.target.value})}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              className="w-full p-2 border rounded"
              value={task.description}
              onChange={(e) => setTask({...task, description: e.target.value})}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Atanacak Grup</label>
            <select
              className="w-full p-2 border rounded"
              value={task.assignedTo}
              onChange={(e) => setTask({...task, assignedTo: e.target.value})}
            >
              <option value="system_group">Sistem Grubu</option>
              <option value="a_group">A Grubu</option>
              <option value="software_group">Yazılım Grubu</option>
              <option value="technical_service">Teknik Servis</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};