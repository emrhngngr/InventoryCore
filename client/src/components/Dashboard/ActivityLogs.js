import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import api from "../../api/api";
import Modal from "../common/Modal";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(logs.length / itemsPerPage);
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

  const paginatedLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchLogs = async () => {
    try {
      const response = await api.get("/activity-logs")
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
      pending: "inceledi",
      reviewed: "incelendi",
      completed: "tamamladı",
      sendback: "geri gönderdi",
    };

    const resourceMessages = {
      product: "varlık",
      category: "kategori",
      user: "kullanıcı",
      task: "görev",
    };

    return `${log.user?.name || "Bilinmeyen Kullanıcı"} bir ${
      resourceMessages[log.resourceType]
    } ${actionMessages[log.action]}.`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <ClipLoader color="#3498db" size={50} /> {/* Loading Spinner */}
      </div>
    );
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
          <option value="product">Varlık</option>
          <option value="category">Kategori</option>
          <option value="user">Kullanıcı</option>
          <option value="user">Görevler</option>
        </select>
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Filtrele
        </button>
      </div>

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
            {paginatedLogs.map((log) => (
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
        <div className="flex items-center justify-start mt-4">
          <div className="text-sm text-gray-600">
            Sayfa {currentPage} / {Math.ceil(logs.length / itemsPerPage)}{" "}
            (Toplam {logs.length} varlık)
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
      </div>
      {Math.ceil(logs.length / itemsPerPage) > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
  {/* İlk Sayfa Butonu */}
  <button
    onClick={() => setCurrentPage(1)}
    disabled={currentPage === 1}
    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
  >
    İlk
  </button>

  {/* Önceki Sayfa Butonu */}
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
  >
    Önceki
  </button>

  {/* Sayfa Numaraları */}
  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((page) => {
      // Sadece ilgili sayfaları göster
      const showAllPages = 5; // Etrafında gösterilecek toplam sayfa sayısı
      if (page === 1 || page === totalPages) return true; // İlk ve son sayfalar her zaman gösterilir
      if (
        Math.abs(page - currentPage) < Math.ceil(showAllPages / 2)
      )
        return true; // Mevcut sayfanın etrafındaki sayfalar gösterilir
      return false;
    })
    .map((page, index, array) => {
      // "..." eklemek için
      const prevPage = array[index - 1];
      return (
        <>
          {prevPage && page - prevPage > 1 && (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          )}
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded-md ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        </>
      );
    })}

  {/* Sonraki Sayfa Butonu */}
  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(prev + 1, totalPages)
      )
    }
    disabled={currentPage === totalPages}
    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
  >
    Sonraki
  </button>

  {/* Son Sayfa Butonu */}
  <button
    onClick={() => setCurrentPage(totalPages)}
    disabled={currentPage === totalPages}
    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
  >
    Son
  </button>
</div>

      )}

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
