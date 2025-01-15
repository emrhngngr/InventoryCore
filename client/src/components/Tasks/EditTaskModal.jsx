import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const EditTaskModal = ({ isOpen, onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    assignedTo: '',
    status: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        assignedTo: task.assignedTo,
        status: task.status
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task._id, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Görevi Düzenle</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlık
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Atanan Grup
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Grup Seçin</option>
              <option value="system_group">Sistem Grubu</option>
              <option value="a_group">A Grubu</option>
              <option value="software_group">Yazılım Grubu</option>
              <option value="technical_service">Teknik Servis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durum
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="pending">Aktif</option>
              <option value="reviewing">İnceleme Bekliyor</option>
              <option value="approved">Tamamlandı</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;