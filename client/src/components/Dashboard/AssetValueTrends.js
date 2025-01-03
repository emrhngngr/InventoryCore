import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import moment from "moment";
import api from "../../api/api";

const AssetValueTrends = () => {
  const [assetValues, setAssetValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animationActive, setAnimationActive] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/asset-values/risk-values");
        const processedData = response.data
          .reduce((acc, curr) => {
            const date = moment(curr.calculationDate).format("DD MMM YYYY");
            const weekNumber = moment(curr.calculationDate).week();

            const existingEntry = acc.find((item) => item.date === date);
            if (existingEntry) {
              existingEntry.totalAssetValue += curr.totalAssetValue;
            } else {
              acc.push({
                date,
                weekNumber,
                totalAssetValue: curr.totalAssetValue,
              });
            }
            return acc;
          }, [])
          .sort((a, b) => a.weekNumber - b.weekNumber);

        setAssetValues(processedData);
        setLoading(false);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.[0]) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-100 transition-all duration-300">
          <p className="font-semibold text-gray-800">Tarih: {label}</p>
          <p className="text-blue-600 mt-1">
            Değer: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 animate-fade-in">
        Veri yüklenirken bir hata oluştu
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Risk Değeri Trendi</h2>
        <button
          onClick={() => setAnimationActive(!animationActive)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          {animationActive ? 'Animasyonu Durdur' : 'Animasyonu Başlat'}
        </button>
      </div>

      {assetValues.length > 0 ? (
        <div className="transition-transform duration-300 hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={assetValues}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fill: '#4b5563' }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#4b5563' }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="totalAssetValue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                activeDot={{
                  r: 8,
                  fill: '#3b82f6',
                  className: 'animate-pulse'
                }}
                isAnimationActive={animationActive}
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Henüz veri bulunmamaktadır
        </div>
      )}
    </div>
  );
};

export default AssetValueTrends;