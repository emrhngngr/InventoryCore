import React, { useEffect, useState } from "react";
import api from "../../api/api";
import ClipLoader from "react-spinners/ClipLoader"; // React Spinners
import { ToastContainer, toast } from "react-toastify"; // Toastify
import Swal from "sweetalert2"; // SweetAlert2

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dynamicAttributes, setDynamicAttributes] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    _id: "",
    name: "",
    category: "",
    dynamicAttributes: {},
    amount: 0,
    criticalityDegree: 1,
    privacyDegree: 1,
  });

  // New state for filtering products by category
  const [selectedTableCategory, setSelectedTableCategory] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/users/me");
        setCurrentUser(response.data);
        console.log("data:", response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get("http://localhost:5000/api/products"),
          api.get("http://localhost:5000/api/categories"),
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        toast.error("Veriler alınırken bir hata oluştu."); // Toastify Error
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Open modal for adding new product
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentProduct({
      name: "",
      category: "",
      dynamicAttributes: {},
      amount: 0,
      criticalityDegree: 1,
      privacyDegree: 1,
    });
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing product
  const openEditModal = (product) => {
    setIsEditMode(true);
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

  // Handle category selection
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

  // Handle dynamic attribute changes
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

  // Save product (create or update)
  const saveProduct = async () => {
    if (
      currentProduct.criticalityDegree < 1 ||
      currentProduct.privacyDegree < 1 ||
      currentProduct.privacyDegree > 5 ||
      currentProduct.criticalityDegree > 5
    ) {
      toast.warn(
        "Kritiklik derecesi ve gizlilik derecesi 1 ile 5 arasında olmalıdır."
      );
      return;
    }
    if (currentProduct.amount < 0) {
      toast.warn("Adet negatif bir değer olamaz.");
      return;
    }

    try {
      if (isEditMode) {
        // Update existing product
        const response = await api.put(
          `http://localhost:5000/api/products/${currentProduct._id}`,
          {
            ...currentProduct,
            dynamicAttributes,
          }
        );

        setProducts((prev) =>
          prev.map((p) => (p._id === response.data._id ? response.data : p))
        );
        Swal.fire({
          icon: "success",
          title: "Tebrikler!",
          text: "Ürün Güncellemesi Başarılı!",
        });
      } else {
        // Create new product
        const response = await api.post("http://localhost:5000/api/products", {
          ...currentProduct,
          dynamicAttributes,
        });

        setProducts((prev) => [...prev, response.data]);
        Swal.fire({
          icon: "success",
          title: "Tebrikler!",
          text: "Ürün Ekleme Başarılı!",
        });
      }

      setIsModalOpen(false);
      setCurrentProduct({
        name: "",
        category: "",
        dynamicAttributes: {},
        amount: 0,
        criticalityDegree: 1,
        privacyDegree: 1,
      });
      setSelectedCategory(null);
      setDynamicAttributes({});
    } catch (error) {
      toast.error("Ürün kaydedilirken bir hata oluştu.");
      console.error("Error saving product:", error);
    }

  };

  // Delete product
  const deleteProduct = async (productId) => {
    // Kullanıcıdan silme onayı al
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Hayır, iptal et",
    });
  
    if (result.isConfirmed) {
      try {
        // Silme işlemini gerçekleştir
        await api.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts((prev) => prev.filter((p) => p._id !== productId)); // Listeden kaldır
  
        // Başarı mesajı göster
        Swal.fire({
          title: "Silindi!",
          text: "Ürün başarıyla silindi.",
          icon: "success",
          confirmButtonText: "Tamam",
        });
      } catch (error) {
        // Hata durumunda mesaj göster
        Swal.fire({
          title: "Hata!",
          text: "Ürün silinirken bir hata oluştu.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    } else {
      // İptal durumunda bilgilendirme
      Swal.fire({
        title: "İptal Edildi",
        text: "Ürün silme işlemi iptal edildi.",
        icon: "info",
        confirmButtonText: "Tamam",
      });
    }
  };

  // Get all unique attributes for a specific category or all categories
  const getAttributesForCategory = (categoryId = null) => {
    const allAttributes = new Set();

    // If a specific category is selected, get its attributes
    if (categoryId) {
      const category = categories.find((cat) => cat._id === categoryId);
      return category ? category.attributes : [];
    }

    // Otherwise, collect attributes from all categories
    categories.forEach((category) => {
      category.attributes.forEach((attr) => allAttributes.add(attr));
    });

    return Array.from(allAttributes);
  };

  // Filter products based on search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedTableCategory
      ? product.category?._id === selectedTableCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4">
       <ToastContainer />
      {/* Search and Filter Section */}
      <div className="w-full flex justify-between items-center mb-4 gap-4">
        {/* Search Input */}
        <div className="w-2/3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full px-3 py-2 border rounded-md"
            />
        </div>

        {/* Category Filter */}
        <div className="w-1/3">
          <select
            value={selectedTableCategory}
            onChange={(e) => setSelectedTableCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        {currentUser && currentUser.permissions.includes("create_products") && (
          <>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
              Ürün Ekle
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h2>

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
                {isEditMode ? "Güncelle" : "Oluştur"}
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
              <th scope="col" className="px-6 py-3">
                Ürün Adı
              </th>
              <th scope="col" className="px-6 py-3">
                Kategori
              </th>
              {/* Dynamically generate attribute columns */}
              {getAttributesForCategory(selectedTableCategory).map((attr) => (
                <th key={attr} scope="col" className="px-6 py-3">
                  {attr}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                Adet
              </th>
              <th scope="col" className="px-6 py-3">
                Kritik Derecesi
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
            {filteredProducts.map((product) => (
              <tr
              key={product._id}
              className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  {product.category?.name || "Kategori Yok"}
                </td>
                {/* Dynamically render attribute values */}
                {getAttributesForCategory(selectedTableCategory).map((attr) => (
                  <td key={attr} className="px-6 py-4">
                    {product.dynamicAttributes?.[attr] || "-"}
                  </td>
                ))}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.amount}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.criticalityDegree}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.privacyDegree}
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  {currentUser &&
                    currentUser.permissions.includes("edit_products") && (
                      <>
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-600 hover:underline"
                          >
                          Düzenle
                        </button>
                      </>
                    )}
                  {currentUser &&
                    currentUser.permissions.includes("delete_products") && (
                      <>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="text-red-600 hover:underline"
                          >
                          Sil
                        </button>
                      </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      {loading && (
       <div className="flex justify-center items-center py-4">
         <ClipLoader color="#3498db" size={50} /> {/* Loading Spinner */}
       </div>
      )}
      </div>
    </div>
  );
};

export default AdminProducts;
