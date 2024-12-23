import React, { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import moment from "moment";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../api/api";

const AssetValueTrends = () => {
  const [weeklyAssetValues, setWeeklyAssetValues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("total");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesResponse = await api.get("/categories");
        setCategories([
          { _id: "total", name: "Toplam" },
          ...categoriesResponse.data,
        ]);

        let assetValuesResponse;
        if (selectedCategory === "total") {
          const allValues = await api.get("/asset-values");
          const groupedByWeek = allValues.data.reduce((acc, curr) => {
            const { weekNumber, totalAssetValue } = curr;
            const existingWeek = acc.find(w => w.weekNumber === weekNumber);
            
            if (existingWeek) {
              existingWeek.totalAssetValue += totalAssetValue;
            } else {
              acc.push({
                weekNumber,
                totalAssetValue,
                date: moment().week(weekNumber).format("DD MMM YYYY")
              });
            }
            return acc;
          }, []);
          
          assetValuesResponse = groupedByWeek.sort((a, b) => a.weekNumber - b.weekNumber);
        } else {
          const categoryValues = await api.get(`/asset-values/category/${selectedCategory}`);
          assetValuesResponse = categoryValues.data.map(item => ({
            date: moment().week(item.weekNumber).format("DD MMM YYYY"),
            totalAssetValue: item.totalAssetValue,
            weekNumber: item.weekNumber
          }));
        }

        setWeeklyAssetValues(assetValuesResponse);
        setLoading(false);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.[0]) {
      return (
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
          <p className="font-bold text-gray-700">Tarih: {label}</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">
              Risk Değeri: {payload[0].value.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const calculateTotalChange = () => {
    if (weeklyAssetValues.length < 2) return 0;
    const firstValue = weeklyAssetValues[0].totalAssetValue;
    const lastValue = weeklyAssetValues[weeklyAssetValues.length - 1].totalAssetValue;
    return ((lastValue - firstValue) / firstValue * 100).toFixed(2);
  };

  if (loading) {
    return <div className="flex justify-center items-center py-4">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Veri yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Risk Değeri Trendi</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className={`flex items-center ${calculateTotalChange() >= 0 ? "text-green-600" : "text-red-600"}`}>
            <span className="text-sm font-medium mr-2">
              Değişim: %{calculateTotalChange()}
            </span>
            {calculateTotalChange() >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {weeklyAssetValues.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={weeklyAssetValues}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#8884d8"
              label={{ value: "Tarihler", position: "insideBottomRight", offset: -10 }}
            />
            <YAxis
              stroke="#8884d8"
              label={{ value: "Risk Değeri", angle: -90, position: "insideLeft", offset: -10 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="totalAssetValue"
              stroke="#8884d8"
              activeDot={{ r: 8, style: { fill: "#8884d8", opacity: 0.7 } }}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Henüz risk değeri verisi bulunmamaktadır.
        </div>
      )}
    </div>
  );
};

export default AssetValueTrends;