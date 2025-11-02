import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipLoader } from "react-spinners";
import { DownloadCloud } from "lucide-react";
import api from "../../api/api";


const AssetValueTrends = ({ assetValues }) => {
  const generateColor = (index) => {
    const hue = (index * 137.5) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const processData = (rawData) => {
    const weeks = new Set();
    const weekRanges = {};
    const products = new Set();

    rawData.forEach((item) => {
      weeks.add(item.weekNumber);
      weekRanges[item.weekNumber] = item.weekRange;
      products.add(item.product?.name || "Unknown");
    });

    const sortedWeeks = Array.from(weeks).sort((a, b) => a - b);
    const productsList = Array.from(products);

    const valueMap = new Map();
    rawData.forEach((item) => {
      const key = `${item.weekNumber}-${item.product?.name || "Unknown"}`;
      valueMap.set(key, item.totalAssetValue);
    });

    return sortedWeeks.map((weekNum) => {
      const entry = { week: weekRanges[weekNum] };
      productsList.forEach((productName) => {
        const key = `${weekNum}-${productName}`;
        entry[productName] = valueMap.get(key) || null;
      });
      return entry;
    });
  };

  const data = processData(assetValues);

  const handleExcelDownload = async () => {
    try {
      const response = await api.get('/asset-values/download-excel', {
        responseType: 'blob', // Important for file downloads
      });
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
  a.download = 'asset-risk-values.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      } catch (error) {
      console.error('Excel download failed:', error);
      alert('An error occurred while downloading the Excel file. Please try again.');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-100">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="mt-1">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const products =
    data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "week") : [];

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Asset Risk Value Statistics
        </h2>
        <div className="text-sm text-gray-600">
          {products.length} Tracked Assets
        </div>
        <button
            onClick={handleExcelDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <DownloadCloud size={20} />
            Download Excel
          </button>
      </div>

      {assetValues.length === 0 ? (
        <div className="flex justify-center items-center py-4">
          <ClipLoader color="#3498db" size={50} /> {/* Loading Spinner */}
        </div>
      ) : data.length > 0 ? (
        <div className="transition-transform duration-300 hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="week"
                stroke="#6b7280"
                tick={{ fill: "#4b5563" }}
              />
              <YAxis stroke="#6b7280" tick={{ fill: "#4b5563" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {products.map((product, index) => (
                <Line
                  key={product}
                  type="monotone"
                  dataKey={product}
                  name={product}
                  stroke={generateColor(index)}
                  strokeWidth={3}
                  dot={{
                    fill: generateColor(index),
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 8,
                    fill: generateColor(index),
                    className: "animate-pulse",
                  }}
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default AssetValueTrends;
