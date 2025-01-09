import { Check, Pen, Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import api from "../../api/api";
import Button from "../../components/common/Button";

const AdminProcess = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoTaskSettings, setAutoTaskSettings] = useState({});
  const [currentProduct, setCurrentProduct] = useState({
    _id: "",
    name: "",
    category: "",
    dynamicAttributes: {},
    assignedTo: "",
    amount: 0,
    criticalityDegree: 1,
    privacyDegree: 1,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dynamicAttributes, setDynamicAttributes] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const location = useLocation();
  const [productAgeFilter, setProductAgeFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
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
      setLoading(false);
    };

    fetchInitialData();
  }, []);
  

  const isProductOld = (updatedAt) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(updatedAt) < oneWeekAgo;
  };

  useEffect(() => {
    // Başlangıçta ürünlerin isAuto durumunu yükleme
    const initialAutoSettings = {};
    products.forEach((product) => {
      initialAutoSettings[product._id] = product.isAuto;
    });
    setAutoTaskSettings(initialAutoSettings);
  }, [products]);

  const toggleAuto = async (productId) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        const updatedAutoStatus = !autoTaskSettings[productId];
        return { ...product, isAuto: updatedAutoStatus };
      }
      return product;
    });
    
    // Arayüzü hemen güncelle
    setAutoTaskSettings((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));

    // Sunucuda değişikliği güncelle
    try {
      await api.put(`http://localhost:5000/api/products/${productId}`, {
        ...products.find((p) => p._id === productId),
        isAuto: !autoTaskSettings[productId],
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating auto task setting:", error);
      // Hata durumunda eski duruma döndür
      setAutoTaskSettings((prev) => ({
        ...prev,
        [productId]: prev[productId],
      }));
    }
  };

  useEffect(() => {
    setTotalValue(
      calculateTotalValue(
        currentProduct.privacyDegree,
        currentProduct.criticalityDegree
      )
    );
    if (location.state && location.state.initialFilter) {
      setProductAgeFilter(location.state.initialFilter);
    }
  }, [
    currentProduct.privacyDegree,
    currentProduct.criticalityDegree,
    location.state,
  ]);

  const openEditModal = (product) => {
    const category = categories.find((cat) => cat._id === product.category._id);

    setCurrentProduct({
      _id: product._id,
      name: product.name,
      category: product.category._id,
      dynamicAttributes: product.dynamicAttributes || {},
      assignedTo: product.assignedTo,
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

  const calculateTotalValue = (privacyDegree, criticalityDegree) => {
    return privacyDegree * criticalityDegree;
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
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu nesneyi onaylamak istediğinizden emin misiniz? Bu işlem geri alınamaz!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Evet, Onayla!",
      cancelButtonText: "Hayır, iptal et",
    });
    if (result.isConfirmed) {
      try {
        const response = await api.put(
          `http://localhost:5000/api/products/${productId}/confirm`,
          { updatedAt: new Date() }
        );

        // Update the products list
        setProducts((prev) =>
          prev.map((p) => (p._id === response.data._id ? response.data : p))
        );
        Swal.fire({
          title: "Onaylandı!",
          text: "Varlık başarıyla onaylandı.",
          icon: "success",
          confirmButtonText: "Tamam",
        });
      } catch (error) {
        Swal.fire({
          title: "Hata!",
          text: "Onaylanırken bir hata oluştu.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
        console.error("Error confirming product:", error);
      }
    } else {
      Swal.fire({
        title: "İptal Edildi",
        text: "Varlığı onaylama işlemi iptal edildi.",
        icon: "info",
        confirmButtonText: "Tamam",
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    if (productAgeFilter === "all") return true;
    if (productAgeFilter === "old") return isProductOld(product.updatedAt);
    if (productAgeFilter === "new") return !isProductOld(product.updatedAt);
    return true;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Varlık Güncelleme</h1>

      {/* Product Age Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Varlık Güncelleme Filtresi
        </label>
        <select
          value={productAgeFilter}
          onChange={(e) => setProductAgeFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="all">Tüm Varlıklar</option>
          <option value="new">Güncel Varlıklar</option>
          <option value="old">Güncellenmesi Gereken Varlıklar</option>
        </select>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Varlık Adı</th>
              <th scope="col" className="px-6 py-3">Atanmış Grup</th>
              <th scope="col" className="px-6 py-3">Oluşturulma Tarihi</th>
              <th scope="col" className="px-6 py-3">Güncellenme Tarihi</th>
              <th scope="col" className="px-6 py-3">Kritiklik Derecesi</th>
              <th scope="col" className="px-6 py-3">Gizlilik Derecesi</th>
              <th scope="col" className="px-6 py-3">Varlık Değeri</th>
              <th scope="col" className="px-6 py-3">Otomatik Görev</th>
              <th scope="col" className="px-6 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const isOld = isProductOld(product.updatedAt);
              return (
                <tr
                  key={product._id}
                  className={`border-b ${
                    isOld
                      ? "bg-red-100 hover:bg-red-200"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.assignedTo}
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
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {calculateTotalValue(
                      product.privacyDegree,
                      product.criticalityDegree
                    )}
                  </td>
                  <td className="px-6 py-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={autoTaskSettings[product._id] || false}
                      onChange={() => toggleAuto(product._id)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <Button
                      variant="outline"
                      className="text-sm"
                      onClick={() => openEditModal(product)}
                    >
                      <Pen size={16} />
                    </Button>
                    <Button
                      className="text-sm bg-green-500 text-white hover:bg-green-600"
                      onClick={() => confirmProduct(product._id)}
                    >
                      <Check size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && (
          <div className="flex justify-center items-center py-4">
            <ClipLoader color="#3498db" size={50} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Varlık Düzenle</h2>

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
              Atanmış Grup
              </label>
              <input
                type="text"
                value={currentProduct.assignedTo}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev,
                    assignedTo: e.target.value,
                  }))
                }
                placeholder="Atanmış grup adını girin"
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
