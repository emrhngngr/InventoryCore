import React, { useEffect, useState } from "react";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { GoDuplicate } from "react-icons/go";
import api from "../../api/api";
import AssetValueTrends from "../../components/AssetValueTrends";
import ProductAgePieChart from "../../components/ProductAgePieChart";

const AdminPage = () => {
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
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 mb-16">
          <div className="grid grid-cols-4 gap-4 font-medium ">
            <div className="flex flex-col justify-center text-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <div className="flex justify-center mt-4">
                {" "}
                <AiOutlineProduct className="text-6xl" />{" "}
              </div>
              <div className="">Toplam Ürün Sayısı</div>
              <div className="mb-4">{dashboardStats.totalProducts}</div>
            </div>
            <div className="flex flex-col justify-center text-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <div className="flex justify-center mt-4">
                {" "}
                <GoDuplicate className="text-6xl" />{" "}
              </div>
              <div className="">Kategori Sayısı</div>
              <div className="mb-4">{dashboardStats.totalCategories}</div>
            </div>
            <div className="flex flex-col justify-center text-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <div className="flex justify-center mt-4">
                {" "}
                <AiFillProduct className="text-6xl" />{" "}
              </div>
              <div className="">Kategori Sayısı</div>
              <div className="mb-4">4</div>
            </div>
            <div className="flex flex-col justify-center text-center bg-white shadow-lg rounded-xl p-4 border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <div className="flex justify-center mt-4">
                {" "}
                <FaRegUser className="text-6xl" />{" "}
              </div>
              <div className="">Üye Sayısı</div>
              <div className="mb-4">{dashboardStats.totalUsers}</div>
            </div>
          </div>
        </div>
        <div className="col-span-4 p-10 h-max border  bg-white shadow-lg rounded-xl p-4  transform transition-all hover:scale-105 duration-300 ">
          <div>
            <h2 className="font-bold mb-5">Duyuru</h2>
            <ul className="">
              <li className="p-4 bg-slate-50 border rounded border-black my-4">
                🎉 Yeni Ürün Yönetim Sistemi Güncellendi!
              </li>
            </ul>
            <div className="flex justify-end mr-3">
              <div>

              <h5 className="underline cursor-pointer">Tüm Duyurular</h5>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <AssetValueTrends />
        <ProductAgePieChart />
      </div>
    </>
  );
};

export default AdminPage;
