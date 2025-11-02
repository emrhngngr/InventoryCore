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
  toast.error("An error occurred while fetching data.");
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
  <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <CustomDatePicker
              selectedDate={task.deadline}
              onChange={(date) => setTask({ ...task, deadline: date })}
              minDate={getMinDate()}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Assigned Asset</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.assignedAsset}
              onChange={(e) => setTask({ ...task, assignedAsset: e.target.value })}
            >
              <option value="" disabled>
                Select an asset
              </option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Assigned Group</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={task.assignedTo}
              onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
            >
              <option value="system_group">System Group</option>
              <option value="a_group">Group A</option>
              <option value="software_group">Software Group</option>
              <option value="technical_service">Technical Service</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;