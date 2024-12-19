import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api/api';
import moment from 'moment';

const AssetValueTrends = () => {
  const [weeklyAssetValues, setWeeklyAssetValues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and initial asset values
  useEffect(() => {
    const fetchCategoriesAndAssetValues = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);

        // Fetch initial asset values
        const assetValuesResponse = await api.get('/asset-values/');
        setWeeklyAssetValues(assetValuesResponse.data);
        
        // Set first category as default if available
        if (categoriesResponse.data.length > 0) {
          setSelectedCategory(categoriesResponse.data[0]._id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Veri yüklenirken hata:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCategoriesAndAssetValues();
  }, []);

  // Fetch asset values for selected category
  useEffect(() => {
    const fetchCategoryAssetValues = async () => {
      if (!selectedCategory) return;

      try {
        const response = await api.get(`/asset-values/category/${selectedCategory}`);
        
        // Format data with dates instead of week numbers
        const formattedData = response.data.map(item => ({
          date: moment().week(item.weekNumber).format('DD MMM YYYY'),
          totalAssetValue: item.totalAssetValue,
          weekNumber: item.weekNumber
        }));

        setWeeklyAssetValues(formattedData);
      } catch (err) {
        console.error('Kategori varlık değerleri yüklenirken hata:', err);
        setError(err);
      }
    };

    fetchCategoryAssetValues();
  }, [selectedCategory]);

  useEffect(() => {
    // Backend'deki API'yi çağıran bir fonksiyon
    const calculateAssetValues = async () => {
      try {
        const response = await api.post("/asset-values/calculate");
        console.log("API çağrısı başarılı:", response.data);
      } catch (error) {
        console.error("API çağrısı sırasında hata:", error.message);
      }
    };

    // Fonksiyonu hemen çağırıyoruz
    calculateAssetValues();
  }, []); // [] ile sadece component mount olduğunda çalışır

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
          <p className="font-bold text-gray-700">Tarih: {label}</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">
              Toplam Varlık Değeri: {data.value.toLocaleString()}
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
    const changePercentage = ((lastValue - firstValue) / firstValue) * 100;
    return changePercentage.toFixed(2);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl mx-auto transform transition-all hover:scale-[1.02] duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Haftalık Varlık Değeri</h2>
        
        {/* Category Dropdown */}
        <div className="flex items-center space-x-4">
          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className={`flex items-center ${calculateTotalChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-sm font-medium mr-2">
              Toplam Değişim: %{calculateTotalChange()}
            </span>
            {calculateTotalChange() >= 0 ? 
              <TrendingUp className="w-5 h-5" /> : 
              <TrendingDown className="w-5 h-5" />
            }
          </div>
        </div>
      </div>

      {weeklyAssetValues.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart 
            data={weeklyAssetValues}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
            />
            <XAxis 
              dataKey="date" 
              stroke="#8884d8" 
              label={{ value: 'Tarihler', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis 
              stroke="#8884d8" 
              label={{ 
                value: 'Toplam Varlık Değeri', 
                angle: -90, 
                position: 'insideLeft',
                offset: -10
              }}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              name="Haftalık Varlık Değeri"
              type="monotone"
              dataKey="totalAssetValue"
              stroke="#8884d8"
              activeDot={{ 
                r: 8, 
                style: { 
                  fill: '#8884d8', 
                  opacity: 0.7 
                } 
              }}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Henüz varlık değeri verisi bulunmamaktadır.
        </div>
      )}
    </div>
  );
};

export default AssetValueTrends;