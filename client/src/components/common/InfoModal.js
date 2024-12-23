// components/common/InfoModal.js
import React from 'react';
import Button from './Button';

const InfoModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-semibold mb-4">Bilgi</h2>
        <p>{content}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
