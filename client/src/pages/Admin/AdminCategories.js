import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../api/api";
import {
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../../services/categoryService";
import ClipLoader from "react-spinners/ClipLoader"; // React Spinners
import Button from "../../components/common/Button";
import { CircleX, Pen } from "lucide-react";

const AdminClasses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [attributes, setAttributes] = useState([""]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCategoryName("");
    setAttributes([""]);
    setCurrentCategory(null);
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const addAttributeField = () => setAttributes([...attributes, ""]);

  const handleAttributeChange = (value, index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = value;
    setAttributes(updatedAttributes);
  };

  // New method to delete an attribute field
  const deleteAttributeField = (indexToRemove) => {
    // Prevent removing the last attribute field
    if (attributes.length > 1) {
      setAttributes(attributes.filter((_, index) => index !== indexToRemove));
    } else {
      alert("En az bir özellik olmalıdır!");
    }
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setAttributes(category.attributes);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleRemoveCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Hayır, iptal et",
    });
    if (result.isConfirmed) {
      try {
        await deleteCategory(categoryId);
        getCategories();
        Swal.fire({
          title: "Silindi!",
          text: "Kategori başarıyla silindi.",
          icon: "success",
          confirmButtonText: "Tamam", 
        });
      } catch (error) {
        Swal.fire({
          title: "Hata!",
          text: "Kategori silinirken bir hata oluştu.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
        console.error("Kategori silinirken bir hata oluştu:", error);
      }
    } else {
      Swal.fire({
        title: "İptal Edildi",
        text: "Kategori silme işlemi iptal edildi.",
        icon: "info",
        confirmButtonText: "Tamam",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCategoryExist = categories.some(
      (category) =>
        category.name.toLowerCase() === categoryName.toLowerCase() &&
        category._id !== currentCategory?._id
    );

    if (isCategoryExist) {
      Swal.fire({
        title: "İptal Edildi",
        text: "Bu kategori zaten mevcut!",
        icon: "info",
        confirmButtonText: "Tamam",
      });
      return;
    }

    try {
      if (isEditMode && currentCategory) {
        // Update existing category
        const updatedCategory = {
          name: categoryName,
          attributes,
        };
        await updateCategory(currentCategory._id, updatedCategory);
        Swal.fire({
          title: "Başarılı!",
          text: "Kategori başarıyla güncellendi.",
          icon: "success",
          confirmButtonText: "Tamam", 
        });
      } else {
        // Add new category
        const newCategory = { name: categoryName, attributes };
        await api.post("http://localhost:5000/api/categories", newCategory);
        Swal.fire({
          title: "Başarılı!",
          text: "Kategori başarıyla eklendi.",
          icon: "success",
          confirmButtonText: "Tamam", 
        });
      }

      getCategories();
      closeModal();
    } catch (err) {
      console.error("İşlem sırasında bir hata oluştu:", err);
      alert(err.response?.data?.message || "");
      Swal.fire({
        title: "Hata!",
        text: "İşlem sırasında bir hata oluştu!",
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
  };
  return (
    <div>
      <div className="w-full top-0 flex justify-end">
        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={openModal}
          >
            Kategori Ekle
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Kategori İsmi
              </th>
              <th scope="col" className="px-6 py-3">
                Özellikler
              </th>
              <th scope="col" className="px-6 py-3">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category._id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4">{category.attributes.join(", ")}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <Button
                      variant="outline"
                      className="text-sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Pen size={16} />
                    </Button>
                  <Button
                      variant="destructive"
                      className="text-sm"
                      onClick={() => handleRemoveCategory(category._id)}
                    >
                      Sil
                    </Button>
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block mb-2">
                  Kategori İsmi
                </label>
                <input
                  type="text"
                  id="categoryName"
                  className="w-full p-2 border rounded"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Özellikler</label>
                {attributes.map((attribute, index) => (
                  <div key={index} className="flex items-center mb-2 space-x-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={attribute}
                      onChange={(e) =>
                        handleAttributeChange(e.target.value, index)
                      }
                      placeholder={`Özellikler ${index + 1}`}
                      required
                    />
                    {attributes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteAttributeField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <CircleX/>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={addAttributeField}
                >
                  Yeni Alan Ekle
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
                  onClick={closeModal}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {isEditMode ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClasses;
