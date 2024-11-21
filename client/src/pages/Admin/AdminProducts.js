import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dynamicAttributes, setDynamicAttributes] = useState({});
  const [currentProduct, setCurrentProduct] = useState({
    _id: '',
    name: '',
    category: '',
    dynamicAttributes: {}
  });
  
  // New state for filtering products by category
  const [selectedTableCategory, setSelectedTableCategory] = useState('');

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories')
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Open modal for adding new product
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentProduct({
      name: '',
      category: '',
      dynamicAttributes: {}
    });
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing product
  const openEditModal = (product) => {
    setIsEditMode(true);
    const category = categories.find(cat => cat._id === product.category._id);
    
    setCurrentProduct({
      _id: product._id,
      name: product.name,
      category: product.category._id,
      dynamicAttributes: product.dynamicAttributes || {}
    });
    
    setSelectedCategory(category);
    
    // Prepare dynamic attributes
    const attributes = {};
    category.attributes.forEach(attr => {
      attributes[attr] = product.dynamicAttributes?.[attr] || '';
    });
    setDynamicAttributes(attributes);
    
    setIsModalOpen(true);
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    setSelectedCategory(category);
    setCurrentProduct(prev => ({
      ...prev,
      category: categoryId,
      dynamicAttributes: {}
    }));
    
    // Create dynamic attribute inputs
    const attributes = {};
    category.attributes.forEach(attr => {
      attributes[attr] = '';
    });
    setDynamicAttributes(attributes);
  };

  // Handle dynamic attribute changes
  const handleAttributeChange = (attr, value) => {
    setDynamicAttributes(prev => ({
      ...prev,
      [attr]: value
    }));
    setCurrentProduct(prev => ({
      ...prev,
      dynamicAttributes: {
        ...prev.dynamicAttributes,
        [attr]: value
      }
    }));
  };

  // Save product (create or update)
  const saveProduct = async () => {
    try {
      if (isEditMode) {
        // Update existing product
        const response = await axios.put(`http://localhost:5000/api/products/${currentProduct._id}`, {
          ...currentProduct,
          dynamicAttributes
        });
        
        // Update products list
        setProducts(prev => 
          prev.map(p => p._id === response.data._id ? response.data : p)
        );
      } else {
        // Create new product
        const response = await axios.post('http://localhost:5000/api/products', {
          ...currentProduct,
          dynamicAttributes
        });
        
        // Add new product to list
        setProducts(prev => [...prev, response.data]);
      }
      
      // Reset form and close modal
      setIsModalOpen(false);
      setCurrentProduct({
        name: '',
        category: '',
        dynamicAttributes: {}
      });
      setSelectedCategory(null);
      setDynamicAttributes({});
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      
      // Remove product from list
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Get all unique attributes for a specific category or all categories
  const getAttributesForCategory = (categoryId = null) => {
    const allAttributes = new Set();
    
    // If a specific category is selected, get its attributes
    if (categoryId) {
      const category = categories.find(cat => cat._id === categoryId);
      return category ? category.attributes : [];
    }
    
    // Otherwise, collect attributes from all categories
    categories.forEach(category => {
      category.attributes.forEach(attr => allAttributes.add(attr));
    });
    
    return Array.from(allAttributes);
  };

  // Filter products based on selected category
  const filteredProducts = selectedTableCategory 
    ? products.filter(product => product.category?._id === selectedTableCategory)
    : products;

  return (
    <div className="p-4">
      {/* Top Row with Add Product and Category Filter */}
      <div className='w-full flex justify-between items-center mb-4'>
        {/* Category Filter Dropdown */}
        <div className="w-1/3">
          <select 
            value={selectedTableCategory}
            onChange={(e) => setSelectedTableCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option 
                key={category._id} 
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button 
          onClick={openAddModal}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
        >
          Ürün Ekle
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
            </h2>

            {/* Product Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Adı
              </label>
              <input 
                type="text"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct(prev => ({
                  ...prev, 
                  name: e.target.value
                }))}
                placeholder="Ürün adını girin"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Category Selection */}
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
                {categories.map(category => (
                  <option 
                    key={category._id} 
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Attributes Based on Category */}
            {selectedCategory && (
              <div>
                <h3 className="text-md font-semibold mb-2">
                  {selectedCategory.name} Özellikleri
                </h3>
                {selectedCategory.attributes.map(attr => (
                  <div key={attr} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {attr}
                    </label>
                    <input 
                      type="text"
                      value={dynamicAttributes[attr] || ''}
                      onChange={(e) => handleAttributeChange(attr, e.target.value)}
                      placeholder={`${attr} girin`}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                İptal
              </button>
              <button 
                onClick={saveProduct}
                disabled={!currentProduct.name || !currentProduct.category}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isEditMode ? 'Güncelle' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Ürün Adı
              </th>
              <th scope="col" className="px-6 py-3">
                Kategori
              </th>
              {/* Dynamically generate attribute columns */}
              {getAttributesForCategory(selectedTableCategory).map(attr => (
                <th key={attr} scope="col" className="px-6 py-3">
                  {attr}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr 
                key={product._id} 
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  {product.category?.name || 'Kategori Yok'}
                </td>
                {/* Dynamically render attribute values */}
                {getAttributesForCategory(selectedTableCategory).map(attr => (
                  <td key={attr} className="px-6 py-4">
                    {product.dynamicAttributes?.[attr] || '-'}
                  </td>
                ))}
                <td className="px-6 py-4 flex space-x-2">
                  <button 
                    onClick={() => openEditModal(product)}
                    className="text-blue-600 hover:underline"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-600 hover:underline"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;