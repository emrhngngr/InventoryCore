import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../api/api";
import Modal from "../components/common/Modal";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    userId: "",
    action: "",
    resourceType: "",
  });
  const [selectedDetails, setSelectedDetails] = useState(null); // Modal için seçilen detay
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("http://localhost:5000/api/activity-logs", {
        headers: {
          Authorization: token,
        },
      });
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(
        `http://localhost:5000/api/activity-logs/filter?${queryParams}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLogs(response.data);
    } catch (error) {
      console.error("Error filtering logs:", error);
    }
  };

  const getFriendlyActionMessage = (log) => {
    const actionMessages = {
      create: "oluşturdu",
      update: "güncelledi",
      delete: "sildi",
      login: "giriş yaptı",
      logout: "çıkış yaptı",
    };
  
    const resourceMessages = {
      product: "ürün",
      category: "kategori",
      user: "kullanıcı",
    };
  
    return `${log.user?.name || "Bilinmeyen Kullanıcı"} bir ${resourceMessages[log.resourceType]} ${actionMessages[log.action]}.`;
  };
  

  if (loading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Aktivite Logları</h2>
      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="Başlangıç Tarihi"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="Bitiş Tarihi"
        />
        <select
          name="action"
          value={filters.action}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Tüm Aksiyonlar</option>
          <option value="create">Oluşturma</option>
          <option value="update">Güncelleme</option>
          <option value="delete">Silme</option>
        </select>
        <select
          name="resourceType"
          value={filters.resourceType}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Tüm Kaynaklar</option>
          <option value="product">Ürün</option>
          <option value="category">Kategori</option>
          <option value="user">Kullanıcı</option>
        </select>
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Filtrele
        </button>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="p-2 border">Tarih</th>
              <th className="p-2 border">Aksiyon</th>
              <th className="p-2 border">IP Adresi</th>
              <th className="p-2 border">Detay</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="p-2 border">
                  {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="p-2 border">{getFriendlyActionMessage(log)}</td>
                <td className="p-2 border">{log.ipAddress}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => {
                      setSelectedDetails(log.details);
                      setModalOpen(true);
                    }}
                    className="bg-gray-200 text-blue-500 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    Detay JSON
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Detaylar"
      >
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
          {JSON.stringify(selectedDetails, null, 2)}
        </pre>
      </Modal>
    </div>
  );
};

export default ActivityLogs;
