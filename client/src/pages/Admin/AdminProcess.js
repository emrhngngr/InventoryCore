import React, { useEffect, useState } from "react";
import api from "../../api/api";

const AdminProcess = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: "",
    name: "",
    category: "",
    dynamicAttributes: {},
    amount: 0,
    criticalityDegree: 1,
    privacyDegree: 1,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dynamicAttributes, setDynamicAttributes] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userResponse, productsResponse, categoriesResponse] =
          await Promise.all([
            api.get("http://localhost:5000/api/users/me"),
            api.get("http://localhost:5000/api/products"),
            api.get("http://localhost:5000/api/categories"),
          ]);
        setCurrentUser(userResponse.data);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const isProductOld = (updatedAt) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(updatedAt) < oneWeekAgo;
  };

  const openEditModal = (product) => {
    const category = categories.find((cat) => cat._id === product.category._id);

    setCurrentProduct({
      _id: product._id,
      name: product.name,
      category: product.category._id,
      dynamicAttributes: product.dynamicAttributes || {},
      amount: product.amount,
      criticalityDegree: product.criticalityDegree,
      privacyDegree: product.privacyDegree,
    });

    setSelectedCategory(category);

    // Prepare dynamic attributes
    const attributes = {};
    category.attributes.forEach((attr) => {
      attributes[attr] = product.dynamicAttributes?.[attr] || "";
    });
    setDynamicAttributes(attributes);

    setIsModalOpen(true);
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    setSelectedCategory(category);
    setCurrentProduct((prev) => ({
      ...prev,
      category: categoryId,
      dynamicAttributes: {},
    }));

    // Create dynamic attribute inputs
    const attributes = {};
    category.attributes.forEach((attr) => {
      attributes[attr] = "";
    });
    setDynamicAttributes(attributes);
  };

  const handleAttributeChange = (attr, value) => {
    setDynamicAttributes((prev) => ({
      ...prev,
      [attr]: value,
    }));
    setCurrentProduct((prev) => ({
      ...prev,
      dynamicAttributes: {
        ...prev.dynamicAttributes,
        [attr]: value,
      },
    }));
  };

  const saveProduct = async () => {
    // Validation similar to the original component
    if (
      currentProduct.criticalityDegree < 1 ||
      currentProduct.privacyDegree < 1 ||
      currentProduct.privacyDegree > 5 ||
      currentProduct.criticalityDegree > 5
    ) {
      alert(
        "Kritiklik derecesi ve gizlilik derecesi en az 1 ve en fazla 5 olmalıdır."
      );
      return;
    }
    if (currentProduct.amount < 0) {
      alert("Adet negatif bir değer olamaz.");
      return;
    }

    try {
      const response = await api.put(
        `http://localhost:5000/api/products/${currentProduct._id}`,
        {
          ...currentProduct,
          dynamicAttributes,
          updatedAt: new Date(), // Explicitly update timestamp
        }
      );

      // Update products list
      setProducts((prev) =>
        prev.map((p) => (p._id === response.data._id ? response.data : p))
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const confirmProduct = async (productId) => {
    try {
      const response = await api.put(
        `http://localhost:5000/api/products/${productId}/confirm`,
        { updatedAt: new Date() }
      );

      // Update the products list
      setProducts((prev) =>
        prev.map((p) => (p._id === response.data._id ? response.data : p))
      );
    } catch (error) {
      console.error("Error confirming product:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ürün Onaylama</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Ürün Adı
              </th>
              <th scope="col" className="px-6 py-3">
                Oluşturulma Tarihi
              </th>
              <th scope="col" className="px-6 py-3">
                Güncellenme Tarihi
              </th>
              <th scope="col" className="px-6 py-3">
                Kritiklik Derecesi
              </th>
              <th scope="col" className="px-6 py-3">
                Gizlilik Derecesi
              </th>
              <th scope="col" className="px-6 py-3">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className={`border-b ${
                  isProductOld(product.updatedAt)
                    ? "bg-red-100 hover:bg-red-200"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  {new Date(product.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(product.updatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.criticalityDegree}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.privacyDegree}
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-blue-600 hover:underline"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => confirmProduct(product._id)}
                    className="text-green-600 hover:underline"
                  >
                    Onayla
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Ürünü Düzenle</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Adı
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
                placeholder="Ürün adını girin"
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
                Kritiklik Derecesi
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
                Gizlilik Derecesi
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
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
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
                {selectedCategory.attributes.map((attr) => (
                  <div key={attr} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {attr}
                    </label>
                    <input
                      type="text"
                      value={dynamicAttributes[attr] || ""}
                      onChange={(e) =>
                        handleAttributeChange(attr, e.target.value)
                      }
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
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProcess;
