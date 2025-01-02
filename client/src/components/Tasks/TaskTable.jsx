import React from 'react';

export const TaskTable = ({ tasks, onComplete, onDelete, isAdmin }) => {
  const [filter, setFilter] = React.useState('all');

  const filteredTasks = React.useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => task.status === 'pending');
      case 'reviewing':
        return tasks.filter(task => task.status === 'reviewing');
      case 'approved':
        return tasks.filter(task => task.status === 'approved');
      default:
        return tasks;
    }
  }, [tasks, filter]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Yapılacak görev bulunmuyor.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">Tüm Görevler</option>
          <option value="active">Aktif Görevler</option>
          <option value="reviewing">İnceleme Bekleyenler</option>
          <option value="approved">Tamamlananlar</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturulma Tarihi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Tarih
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geri Dönüş
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Atanan Grup
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
  {filteredTasks.map((task) => (
    <tr
      key={task._id}
      className={`hover:bg-gray-50 ${task.feedback && task.status !== 'approved' ? 'bg-red-100' : ''}`}
    >
      <td className="px-4 py-3">{task.title}</td>
      <td className="px-4 py-3">{task.description}</td>
      <td className="px-4 py-3">
        {new Date(task.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        {new Date(task.deadline).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        {task.status === 'pending' && (
          <span className="text-blue-500">Aktif</span>
        )}
        {task.status === 'reviewing' && (
          <span className="text-yellow-500">İnceleme Bekliyor</span>
        )}
        {task.status === 'approved' && (
          <span className="text-green-500">Tamamlandı</span>
        )}
      </td>
      <td className="px-4 py-3">{task.feedback}</td>
      <td className="px-4 py-3">{task.assignedTo}</td>
      <td className="px-4 py-3 space-x-2">
        {task.status === 'pending' && (
          <button
            onClick={() => onComplete(task._id)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Tamamla
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => onDelete(task._id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
  );
};