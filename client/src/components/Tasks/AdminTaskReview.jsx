import React from 'react';

export const AdminTaskReview = ({ tasks, onApprove, onSendBack }) => {
  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <div key={task._id} className="border rounded p-4">
          <h3 className="font-bold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="mt-2">
            <p className="font-medium">Tamamlama Notu:</p>
            <p className="text-gray-600">{task.completionNote}</p>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {task.assignedTo} - {new Date(task.createdAt).toLocaleDateString()}
            </span>
            <div className='space-x-4'>
              <button
                onClick={() => onSendBack(task._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                İncelenmesi İçin Geri Gönder
              </button>
              <button
                onClick={() => onApprove(task._id)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};