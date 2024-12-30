import React, { useState } from 'react';

export const SendBackModal = ({ isOpen, onClose, onSubmit }) => {
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(note);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Düzeltilmesi Gereken İşlemler</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Yapılması Gereken İşlem Açıklaması
            </label>
            <textarea
              className="w-full p-2 border rounded"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
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
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};