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
        </div>

        {/* Active Announcement */}
        <div className="col-span-4">
          <ActiveAnnouncement />
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
    </div>
  );
};

export default AdminStatistics;