import React, { useMemo, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export const TaskTable = ({ tasks, onComplete, onDelete, isAdmin }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    
    switch (filter) {
      case 'active': result = result.filter(task => task.status === 'pending'); break;
      case 'reviewing': result = result.filter(task => task.status === 'reviewing'); break;
      case 'approved': result = result.filter(task => task.status === 'approved'); break;
      default: break;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.assignedAsset?.name?.toLowerCase().includes(searchLower) ||
        task.assignedTo?.toLowerCase().includes(searchLower)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
        let bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

        if (sortConfig.key === 'createdAt' || sortConfig.key === 'deadline') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [tasks, filter, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage);
  const currentTasks = filteredAndSortedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!tasks?.length) {
    return <div className="p-8 text-center text-gray-500">Yapılacak görev bulunmuyor.</div>;
  }

  const columns = [
    { key: 'assignedAsset.name', label: 'Varlık Adı', sortable: true },
    { key: 'title', label: 'Başlık', sortable: true },
    { key: 'description', label: 'Açıklama', sortable: true },
    { key: 'createdAt', label: 'Oluşturulma Tarihi', sortable: true },
    { key: 'deadline', label: 'Son Tarih', sortable: true },
    { key: 'status', label: 'Durum', sortable: true },
    { key: 'feedback', label: 'Geri Dönüş', sortable: true },
    { key: 'assignedTo', label: 'Atanan Grup', sortable: true },
    { key: 'actions', label: 'İşlemler', sortable: false }
  ];

  return (
    <div className="flex-1 p-6 ml-16 mt-16 bg-gray-50">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Görev ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 w-64"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Görevler</option>
            <option value="active">Aktif Görevler</option>
            <option value="reviewing">İnceleme Bekleyenler</option>
            <option value="approved">Tamamlananlar</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(column => (
                  <th 
                    key={column.key} 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => column.sortable && requestSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTasks.map(task => (
                <tr key={task._id} className={`hover:bg-gray-50 ${task.feedback && task.status !== 'approved' ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 whitespace-nowrap">{task.assignedAsset.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{task.title}</td>
                  <td className="px-4 py-3">{task.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(task.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(task.deadline).toLocaleDateString('tr-TR')}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-sm rounded-full
                      ${task.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
                        task.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {task.status === 'pending' ? 'Aktif' :
                       task.status === 'reviewing' ? 'İnceleme Bekliyor' : 'Tamamlandı'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{task.feedback}</td>
                  <td className="px-4 py-3">{translateRole(task.assignedTo)}</td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => onComplete(task._id)}
                        className="px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                      >
                        Tamamla
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(task._id)}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        Sil
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-start mt-4">
          <div className="text-sm text-gray-600">
            Sayfa {currentPage} / {totalPages} (Toplam {filteredAndSortedTasks.length} görev)
          </div>

          <div className="flex items-center space-x-4 ml-7">
            <label htmlFor="items-per-page" className="text-sm text-gray-600">
              Sayfa başına:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
            >
              {[5, 10, 20].map((option) => (
                <option key={option} value={option}>
                  {option} Kayıt
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              İlk
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Önceki
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                const showAllPages = 5;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) < Math.ceil(showAllPages / 2)) return true;
                return false;
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                return (
                  <React.Fragment key={`page-${page}`}>
                    {prevPage && page - prevPage > 1 && (
                      <span key={`ellipsis-${index}`} className="px-2">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sonraki
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Son
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const translateRole = (role) => {
  const roleTranslations = {
    admin: 'Yönetici',
    system_group: 'Sistem Grubu',
    a_group: 'A Grubu',
    software_group: 'Yazılım Grubu',
    technical_service: 'Teknik Servis',
  };
  return roleTranslations[role] || 'Bilinmeyen Rol';
};

export default TaskTable;