import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import CustomDatePicker from '../common/CustomDatePicker';

export const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignedTo: 'system_group',
    assignedAsset: '',
    deadline: new Date(new Date().setHours(0, 0, 0, 0) + 86400000), // Tomorrow's date
  });
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/products");
        setAssets(response.data);
      } catch (error) {
        toast.error("Veriler alınırken bir hata oluştu.");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (task.assignedAsset) {
      const selectedAsset = assets.find(asset => asset._id === task.assignedAsset);
      if (selectedAsset) {
        setTask(prevTask => ({ ...prevTask, assignedTo: selectedAsset.assignedTo }));
      }
    }
  }, [task.assignedAsset, assets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    onClose();
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Yeni Görev Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Son Tarih</label>
            <CustomDatePicker
              selectedDate={task.deadline}
              onChange={(date) => setTask({ ...task, deadline: date })}
              minDate={getMinDate()}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Atanacak Varlık</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.assignedAsset}
              onChange={(e) => setTask({ ...task, assignedAsset: e.target.value })}
            >
              <option value="" disabled>
                Bir varlık seçin
              </option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Atanacak Grup</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.assignedTo}
              onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
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
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;