import React, { useState, useMemo } from 'react';

export const TaskTable = ({ tasks, onComplete, onDelete, isAdmin }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Status filter
    switch (filter) {
      case 'active': result = result.filter(task => task.status === 'pending'); break;
      case 'reviewing': result = result.filter(task => task.status === 'reviewing'); break;
      case 'approved': result = result.filter(task => task.status === 'approved'); break;
      default: break;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.assignedAsset?.name?.toLowerCase().includes(searchLower) ||
        task.assignedTo?.toLowerCase().includes(searchLower)
      );
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return result;
  }, [tasks, filter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!tasks?.length) {
    return <div className="p-8 text-center text-gray-500">Yapılacak görev bulunmuyor.</div>;
  }

  return (
    <div className="flex-1 p-6 ml-16 mt-16 bg-gray-50">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {/* Search Input */}
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

          {/* Filter Select */}
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
                {['Varlık Adı','Başlık', 'Açıklama', 'Oluşturulma Tarihi', 'Son Tarih', 'Durum', 'Geri Dönüş', 'Atanan Grup', 'İşlemler'].map(header => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
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
                  <td className="px-4 py-3">{task.assignedTo}</td>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Önceki
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === i + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;