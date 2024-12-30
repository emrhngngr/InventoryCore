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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* İlk Kısım: Kartlar */}
      <div className="grid grid-cols-12 gap-4">
        {/* Dashboard Kartları */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
            <AiOutlineProduct className="text-6xl" />
            <div>Toplam Ürün Sayısı</div>
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
            <div>Aktif Ürünler</div>
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
