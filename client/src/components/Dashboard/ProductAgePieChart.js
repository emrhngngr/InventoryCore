import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsivePie } from "@nivo/pie";
import api from "../../api/api";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

const ProductAgePieChart = () => {
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/products");
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
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(updatedAt) < oneWeekAgo;
    };

    const oldProductsCount = products.filter((product) =>
      isProductOld(product.updatedAt)
    ).length;
    const newProductsCount = products.length - oldProductsCount;

    setChartData([
      {
        id: "Current Assets",
        label: "Current Assets",
        value: newProductsCount,
        color: "#34D399",
        status: "new",
        icon: CheckCircle,
      },
      {
        id: "Old Assets",
        label: "Old Assets",
        value: oldProductsCount,
        color: "#F87171",
        status: "old",
        icon: AlertCircle,
      },
    ]);
  }, [products]);

  const handlePieClick = (data) => {
    navigate("/user/process", {
      state: { initialFilter: data.data.status },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w mx-auto bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 duration-300">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800 flex justify-center items-center space-x-2">
        <RefreshCw className="w-5 h-5 text-blue-500" />
        <span>Asset Update Status</span>
      </h2>

      <div style={{ height: 400 }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.6}
          padAngle={1}
          cornerRadius={5}
          activeOuterRadiusOffset={8}
          colors={{ datum: "data.color" }}
          borderWidth={2}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextColor="#333333"
          radialLabelsLinkColor={{ from: "color" }}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#ffffff"
          animate={true}
          motionConfig="wobbly"
          onClick={handlePieClick}
          tooltip={({ datum }) => (
            <div
              style={{
                padding: "5px 10px",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <strong>{datum.label}</strong>: {datum.value} assets (
              {((datum.value / products.length) * 100).toFixed(1)}%)
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ProductAgePieChart;