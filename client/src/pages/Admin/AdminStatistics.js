import React, { useEffect, useState } from "react";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { GoDuplicate } from "react-icons/go";
import api from "../../api/api";
import ActiveAnnouncement from "../../components/Dashboard/ActiveAnnouncement";
import AssetValueTrends from "../../components/Dashboard/AssetValueTrends";
import ProductAgePieChart from "../../components/Dashboard/ProductAgePieChart";

const AdminStatistics = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

  const [assetValues, setAssetValues] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const productsResponse = await api.get(
        "http://localhost:5000/api/products"
      );
      const categoriesResponse = await api.get(
        "http://localhost:5000/api/categories"
      );
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

  const fetchAssetValues = async () => {
    try {
      // İlk olarak risk hesaplamasını çalıştır
      await api.post("http://localhost:5000/api/asset-values/calculate-risk", {
        weekNumber: 1, // Burada haftayı dinamik hale getirebilirsin
      });

      // Ardından güncellenmiş risk değerlerini çek
      const response = await api.get(
        "http://localhost:5000/api/asset-values/risk-values"
      );
      setAssetValues(response.data);
      console.log("response.data ==> ", response.data);
    } catch (error) {
      console.error("Risk değerlerini çekerken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAssetValues();
  }, []);

  return (
    <div className="space-y-6">
      {/* İlk Kısım: Kartlar */}
      <div className="grid grid-cols-12 gap-4">
        {/* Dashboard Kartları */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-4 gap-4">
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
            <div>Aktif Varlıklar</div>
            <div className="text-lg font-semibold">4</div>
          </div>
          <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
            <FaRegUser className="text-6xl" />
            <div>Üye Sayısı</div>
            <div className="text-lg font-semibold">
              {dashboardStats.totalUsers}
            </div>
          </div>
        </div>

        {/* Active Announcement */}
        <div className="col-span-12 lg:col-span-4">
          <ActiveAnnouncement />
        </div>
      </div>

      {/* Risk Değerleri Tablosu */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Risk Değerleri</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Ürün Adı</th>
              <th className="border p-2">Toplam Risk Değeri</th>
            </tr>
          </thead>
          <tbody>
            {assetValues.length > 0 ? (
              assetValues.map((value) => (
                <tr key={value._id}>
                  <td className="border p-2">
                    {value.product?.name || "Bilinmiyor"}
                  </td>
                  <td className="border p-2">{value.totalAssetValue}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-4">
                  Risk değeri bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* İkinci Kısım: Grafikler */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <AssetValueTrends />
        </div>
        <div className="flex-1">
          <ProductAgePieChart />
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
