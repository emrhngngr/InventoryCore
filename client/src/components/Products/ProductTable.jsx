import React from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Button from '../common/Button';
import { Pen } from 'lucide-react'

const ProductTable = ({ 
  filteredProducts,
  currentPage,
  itemsPerPage,
  itemsPerPageOptions,
  onPageChange,
  onItemsPerPageChange,
  getAttributesForCategory,
  selectedTableCategory,
  currentUser,
  openEditModal,
  deleteProduct,
  loading,
  requestSort,
  getSortIcon
}) => {
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const getBaseColumns = () => [
    { key: 'name', label: 'Varlık Adı' },
    { key: 'assignedTo', label: 'Sorumlu Grup' },
    { key: 'category', label: 'Kategori' },
    { key: 'amount', label: 'Adet' },
    { key: 'criticalityDegree', label: 'Kritik Derecesi' },
    { key: 'privacyDegree', label: 'Gizlilik Derecesi' }
  ];

  const getDynamicColumns = () => 
    getAttributesForCategory(selectedTableCategory).map(attr => ({
      key: `attr_${attr}`,
      label: attr,
      isDynamic: true,
      originalAttr: attr
    }));

  const allColumns = [...getBaseColumns(), ...getDynamicColumns()];

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {allColumns.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => requestSort(key)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  {label} {getSortIcon(key)}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                {allColumns.map(({ key, isDynamic, originalAttr }) => (
                  <td key={key} className="px-4 py-3">
                    {isDynamic 
                      ? product.dynamicAttributes?.[originalAttr] || '-'
                      : key === 'category'
                        ? product.category?.name || 'Kategori Yok'
                        : product[key]}
                  </td>
                ))}
                <td className="px-4 py-3 space-x-2 flex">
                  {currentUser?.role === "admin" && (
                    <Button
                      variant="outline"
                      className="text-sm"
                      onClick={() => openEditModal(product)}
                    >
                      <Pen size={16} />
                    </Button>
                  )}
                  {currentUser?.role === "admin" && (
                    <Button
                      variant="destructive"
                      className="text-sm"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Sil
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <ClipLoader color="#3498db" size={50} />
        </div>
      ) : (
        <div className="flex justify-between items-center p-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Sayfa {currentPage} / {totalPages}
              {` (Toplam ${totalItems} varlık)`}
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="items-per-page" className="text-sm text-gray-600">
                Sayfa başına:
              </label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <FaChevronLeft className="mr-2" /> Önceki
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Sonraki <FaChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;