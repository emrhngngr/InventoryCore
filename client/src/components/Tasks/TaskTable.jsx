import React from 'react';

export const TaskTable = ({ tasks, onComplete, onDelete, isAdmin }) => {
  const [filter, setFilter] = React.useState('all');

  const filteredTasks = React.useMemo(() => {
    switch (filter) {
      case 'active': return tasks.filter(task => task.status === 'pending');
      case 'reviewing': return tasks.filter(task => task.status === 'reviewing');
      case 'approved': return tasks.filter(task => task.status === 'approved');
      default: return tasks;
    }
  }, [tasks, filter]);

  if (!tasks?.length) {
    return <div className="p-8 text-center text-gray-500">Yapılacak görev bulunmuyor.</div>;
  }

  return (
    <div className="flex-1 p-6 ml-16 mt-16 bg-gray-50">
      <div className="space-y-4">
        <div className="flex justify-end">
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
                {['Başlık', 'Açıklama', 'Oluşturulma Tarihi', 'Son Tarih', 'Durum', 'Geri Dönüş', 'Atanan Grup', 'İşlemler'].map(header => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => (
                <tr key={task._id} className={`hover:bg-gray-50 ${task.feedback && task.status !== 'approved' ? 'bg-red-50' : ''}`}>
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
      </div>
    </div>
  );
};
