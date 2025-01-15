import React, { useEffect, useState } from "react";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { GoDuplicate } from "react-icons/go";
import api from "../../api/api";
import AssetValueTrends from "../../components/Dashboard/AssetValueTrends";
import ProductAgePieChart from "../../components/Dashboard/ProductAgePieChart";

const OverdueTasksModal = ({ tasks, isOpen, onClose }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

        {/* Modal */}
        <div className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-xl p-6 m-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Gecikmiş Görevler</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div key={index} className="mb-4">
                  <div>
                    <strong>Görev Başlığı: </strong> {task.title}
                  </div>
                  <div>
                    <strong>Görev Durumu: </strong> {task.status}
                  </div>
                  <div>
                    <strong>Son Tarih: </strong>
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <hr className="my-2" />
                </div>
              ))
            ) : (
              <p>Aktif gecikmiş görev bulunmamaktadır.</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

const AdminStatistics = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

  const [assetValues, setAssetValues] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTasks, setActiveTasks] = useState(0); // Bu kısmı düzeltelim

  const fetchDashboardData = async () => {
    try {
      const productsResponse = await api.get("http://localhost:5000/api/products");
      const categoriesResponse = await api.get("http://localhost:5000/api/categories");
      const usersResponse = await api.get("http://localhost:5000/api/users");

      setDashboardStats({
        totalProducts: productsResponse.data.length,
        totalCategories: categoriesResponse.data.length,
        totalUsers: usersResponse.data.length,
      });
    } catch (error) {
      console.error("Dashboard verilerini çekerken hata oluştu:", error);
    }
  };

  const getCurrentWeek = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysDifference = Math.floor(
      (today - startOfYear) / (1000 * 60 * 60 * 24)
    );
    return Math.ceil((daysDifference + startOfYear.getDay() + 1) / 7);
  };

  const fetchAssetValues = async () => {
    try {
      const tasksResponse = await api.get("http://localhost:5000/api/tasks");

      // Deadline kontrolü
      const today = new Date();
      const overdue = tasksResponse.data.filter((task) => {
        return new Date(task.deadline) < today && task.status !== "approved";
      });
      setOverdueTasks(overdue);

      //Aktif Görevleri Almak
      const activeTask = tasksResponse.data.filter((task) => {
        return task.status === "pending";
      });
      setActiveTasks(activeTask.length); // Burada sadece length kullanıyoruz

      if (overdue.length > 0) {
        console.log("Gecikmiş Görevler:", overdue);
      }

      const currentWeek = getCurrentWeek();
      await api.post("http://localhost:5000/api/asset-values/calculate-risk", {
        weekNumber: currentWeek,
      });

      const response = await api.get(
        "http://localhost:5000/api/asset-values/risk-values"
      );
      setAssetValues(response.data);
    } catch (error) {
      console.error("Risk değerlerini çekerken hata oluştu:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchAssetValues();
    fetchDashboardData();
  }, []);



  return (
    <div className="space-y-6">
      {/* İlk Kısım: Kartlar ve Duyuru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Dashboard Kartları */}
        <div className="col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <AiOutlineProduct className="text-6xl" />
              <div>Toplam Varlık Sayısı</div>
              <div className="text-lg font-semibold">
                {dashboardStats.totalProducts}
              </div>
            </div>
            <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <GoDuplicate className="text-6xl" />
              <div>Kategori Sayısı</div>
              <div className="text-lg font-semibold">
                {dashboardStats.totalCategories}
              </div>
            </div>
            <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <AiFillProduct className="text-6xl" />
              <div>Aktif Görevler</div>
              <div className="text-lg font-semibold">{activeTasks}</div>
            </div>
            <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <FaRegUser className="text-6xl" />
              <div>Üye Sayısı</div>
              <div className="text-lg font-semibold">
                {dashboardStats.totalUsers}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="relative overflow-hidden rounded-xl border shadow-lg transform transition-all hover:scale-105 duration-300">
            <div className={`absolute inset-0 ${
              overdueTasks.length > 0 ? 'bg-gradient-to-r from-red-100 to-red-300 animate-pulse' : 'bg-white'
            }`} />
            
            <div className="relative p-5 md:p-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-bold text-xl ${
                  overdueTasks.length > 0 ? 'text-red-800' : 'text-gray-800'
                }`}>
                  Gecikmiş görev sayısı: {overdueTasks.length}
                </h2>
                
                {overdueTasks.length > 0 && (
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                )}
              </div>

              <div className="p-4 bg-white/90 backdrop-blur-sm border rounded border-gray-200 my-4 shadow-sm">
                {overdueTasks.length > 0 ? (
                  <button
                    onClick={openModal}
                    className="group relative w-full text-left text-red-700 hover:text-red-800 transition-colors duration-200"
                  >
                    Gecikmiş görevleri görmek için tıklayınız
                    <span className="absolute -right-2 top-1/2 -translate-y-1/2 transform opacity-0 transition-all duration-200 group-hover:right-0 group-hover:opacity-100">
                      →
                    </span>
                  </button>
                ) : (
                  <p className="text-green-700">Aktif gecikmiş görev bulunmamaktadır.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İkinci Kısım: Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <AssetValueTrends assetValues={assetValues} />
        </div>
        <div>
          <ProductAgePieChart />
        </div>
      </div>

      {/* Modal */}
      <OverdueTasksModal
        tasks={overdueTasks}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default AdminStatistics;
