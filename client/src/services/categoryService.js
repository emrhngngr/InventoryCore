import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/categories';

export const fetchCategories = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const updateCategory = async (categoryId, categoryData) => {
  const response = await axios.put(`${BASE_URL}/${categoryId}`, categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await axios.delete(`${BASE_URL}/${categoryId}`);
  return response.data;
};