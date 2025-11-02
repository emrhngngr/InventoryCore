import React, { useEffect, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Toastify
import Swal from "sweetalert2"; // SweetAlert2
import api from "../../api/api";
import ProductModal from "../../components/Products/ProductModal";
import ProductTable from "../../components/Products/ProductTable";
import Button from "../../components/common/Button";
import InfoModal from "../../components/Products/InfoModal";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [modalInfoContent, setInfoModalContent] = useState("");
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
    assignedTo: "",
    amount: 0,
    criticalityDegree: 1,
    privacyDegree: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [itemsPerPageOptions] = useState([5, 10, 20, 50, 100]);

  // New state for filtering products by category
  const [selectedTableCategory, setSelectedTableCategory] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("http://localhost:5000/api/users/me");
        setCurrentUser(response.data);
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
        const [productsResponse, categoriesResponse, rolesResponse] =
          await Promise.all([
            api.get("http://localhost:5000/api/products"),
            api.get("http://localhost:5000/api/categories"),
            api.get("http://localhost:5000/api/users/roles"),
          ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        console.log("categoriesResponse.data ==> ", categoriesResponse.data);
        setRoles(rolesResponse.data);
        console.log("rolesResponse.data ==> ", rolesResponse.data);
      } catch (error) {
  toast.error("An error occurred while fetching data."); // Toastify Error
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
      assignedTo: "",
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
      assignedTo: product.assignedTo,
      amount: product.amount,
      criticalityDegree: product.criticalityDegree,
      privacyDegree: product.privacyDegree,
    });

    console.log("currentProduct ==> ", currentProduct);
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
    if (!categoryId) {
      setSelectedCategory(null);
      setCurrentProduct((prev) => ({
        ...prev,
        category: "",
      }));
      return;
    }
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

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-50" />;
    }
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
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
  "Criticality and privacy degrees must be between 1 and 5."
      );
      return;
    }
    if (currentProduct.amount < 0) {
  toast.warn("Quantity cannot be a negative value.");
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
          text: "Asset update successful!",
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
          text: "Asset added successfully!",
        });
      }

      setIsModalOpen(false);
      setCurrentProduct({
        name: "",
        category: "",
        dynamicAttributes: {},
        assignedTo: "",
        amount: 0,
        criticalityDegree: 1,
        privacyDegree: 1,
      });
      setSelectedCategory(null);
      setDynamicAttributes({});
    } catch (error) {
  toast.error("An error occurred while saving the asset.");
      console.error("Error saving product:", error);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
  // Get deletion confirmation from the user
    const result = await Swal.fire({
      title: "Emin misiniz?",
  text: "Are you sure you want to delete this asset? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
  cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
  // perform the deletion
        await api.delete(`http://localhost:5000/api/products/${productId}`);
  setProducts((prev) => prev.filter((p) => p._id !== productId)); // remove from list

  // show success message
        Swal.fire({
          title: "Silindi!",
          text: "Asset deleted successfully.",
          icon: "success",
          confirmButtonText: "Tamam",
        });
      } catch (error) {
  // show message on error
        Swal.fire({
          title: "Hata!",
          text: "An error occurred while deleting the asset.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    } else {
  // notify on cancel
      Swal.fire({
  title: "Cancelled",
  text: "Asset deletion cancelled.",
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
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedTableCategory
        ? product.category?._id === selectedTableCategory
        : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const key = sortConfig.key;

      const aValue = key.startsWith("attr_")
        ? a.dynamicAttributes[key.replace("attr_", "")]
        : a[key] || "";
      const bValue = key.startsWith("attr_")
        ? b.dynamicAttributes[key.replace("attr_", "")]
        : b[key] || "";

      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

  // Open info modal with specific content
  const openInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsInfoModalOpen(false);
  };

  // Event handler to close info modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      {/* Search and Filter Section */}
      
      {isInfoModalOpen && (
        <div
          className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full sm:w-96 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Bilgi</h2>
            <p>{modalInfoContent}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={closeModal}>
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}
      
        <InfoModal isOpen={isInfoModalOpen} onClose={closeModal} />
      <div className=" flex flex-col md:flex-row justify-end items-center mb-4 gap-4">
      <h1
          onClick={openInfoModal} // function that opens the modal
          className="cursor-pointer text-blue-600 hover:text-blue-800"
        >
          What are Privacy and Criticality Levels?
        </h1>
        {/* Search Input */}
        <div className="w-max">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Category Filter */}
        <div className="w-max">
          <select
            value={selectedTableCategory}
            onChange={(e) => setSelectedTableCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        {currentUser && currentUser?.role === "admin"&& (
          <>
            <Button variant="default" onClick={openAddModal}>
              Add Asset
            </Button>
          </>
        )}
      </div>


      {/* Modal */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentProduct={currentProduct}
          setCurrentProduct={setCurrentProduct}
          selectedCategory={selectedCategory}
          categories={categories}
          roles={roles}
          handleCategoryChange={handleCategoryChange}
          dynamicAttributes={dynamicAttributes}
          handleAttributeChange={handleAttributeChange}
          saveProduct={saveProduct}
          isEditMode={isEditMode}
        />
      )}

      {/* Products Table */}
      <ProductTable
        filteredProducts={filteredProducts}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        itemsPerPageOptions={itemsPerPageOptions}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        getAttributesForCategory={getAttributesForCategory}
        selectedTableCategory={selectedTableCategory}
        currentUser={currentUser}
        openEditModal={openEditModal}
        deleteProduct={deleteProduct}
        loading={loading}
        requestSort={requestSort}
        getSortIcon={getSortIcon}
      />
    </div>
  );
};

export default AdminProducts;
