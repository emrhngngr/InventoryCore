import React from 'react';

const ProductModal = ({ 
  isOpen, 
  onClose, 
  currentProduct, 
  setCurrentProduct, 
  selectedCategory,
  categories,
  roles,
  handleCategoryChange,
  dynamicAttributes,
  handleAttributeChange,
  saveProduct,
  isEditMode 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Varlığı Düzenle" : "Yeni Varlık Ekle"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Varlık Adı
          </label>
          <input
            type="text"
            value={currentProduct.name}
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Varlık adını girin"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adet
          </label>
          <input
            type="number"
            min="0"
            value={currentProduct.amount}
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kritiklik Derecesi (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={currentProduct.criticalityDegree}
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                criticalityDegree: e.target.value,
              }))
            }
            placeholder="1-5"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gizlilik Derecesi (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={currentProduct.privacyDegree}
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                privacyDegree: e.target.value,
              }))
            }
            placeholder="1-5"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori Seç
          </label>
          <select
            onChange={(e) => handleCategoryChange(e.target.value)}
            value={currentProduct.category}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Kategori seçin</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sorumlu Seç
          </label>
          <select
            onChange={(e) =>
              setCurrentProduct((prev) => ({
                ...prev,
                assignedTo: e.target.value,
              }))
            }
            value={currentProduct.assignedTo}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Sorumlu seçin</option>
            {roles.map((role, index) => (
              <option key={role._id || index} value={role._id}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div>
            <h3 className="text-md font-semibold mb-2">
              {selectedCategory.name} Özellikleri
            </h3>
            {selectedCategory.attributes.map((attr) => (
              <div key={attr} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {attr}
                </label>
                <input
                  type="text"
                  value={dynamicAttributes[attr] || ""}
                  onChange={(e) => handleAttributeChange(attr, e.target.value)}
                  placeholder={`${attr} girin`}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            İptal
          </button>
          <button
            onClick={saveProduct}
            disabled={!currentProduct.name || !currentProduct.category}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isEditMode ? "Güncelle" : "Oluştur"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;