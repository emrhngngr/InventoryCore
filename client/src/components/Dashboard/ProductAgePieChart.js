import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import api from "../../api/api";

const ProductAgePieChart = () => {
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const isProductOld = (updatedAt) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);
      return new Date(updatedAt) < oneWeekAgo;
    };

    const oldProductsCount = products.filter((product) =>
      isProductOld(product.updatedAt)
    ).length;
    const newProductsCount = products.length - oldProductsCount;

    setChartData([
      {
        name: "Güncel Ürünler",
        value: newProductsCount,
        color: "#34D399",
        status: "new",
        icon: CheckCircle,
      },
      {
        name: "Eski Ürünler",
        value: oldProductsCount,
        color: "#F87171",
        status: "old",
        icon: AlertCircle,
      },
    ]);
  }, [products]);

  const handlePieClick = (data) => {
    navigate("/user/process", {
      state: { initialFilter: data.payload.status },
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const Icon = data.payload.icon;

      return (
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Icon
              className={`w-6 h-6 ${
                data.payload.status === "new"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            />
            <div>
              <p className="font-bold text-gray-700">{data.name}</p>
              <p className="text-sm text-gray-500">
                {data.value} Ürün (
                {((data.value / products.length) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="flex justify-center space-x-4 mt-4">
      {chartData.map((entry) => {
        const Icon = entry.icon;
        return (
          <div
            key={entry.name}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all"
            onClick={() =>
              navigate("/user/process", {
                state: { initialFilter: entry.status },
              })
            }
          >
            <Icon
              className={`w-6 h-6 ${
                entry.status === "new" ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.name}
            </span>
          </div>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 duration-300">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800 flex justify-center items-center space-x-2">
        <RefreshCw className="w-5 h-5 text-blue-500" />
        <span>Ürün Güncelleme Durumu</span>
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            onClick={handlePieClick}
            animationBegin={0}
            animationDuration={1500}
            paddingAngle={5}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  );
};

export default ProductAgePieChart;
