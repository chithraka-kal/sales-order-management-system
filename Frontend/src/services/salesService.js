import axios from 'axios';

const API_URL = "http://localhost:5278/api/sales"; 

export const salesService = {
  getAll: () => axios.get(API_URL),
  getById: (id) => axios.get(`${API_URL}/${id}`),
  create: (data) => axios.post(API_URL, data),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data),
  getCustomers: () => axios.get(`${API_URL}/customers`),
  getItems: () => axios.get(`${API_URL}/items`),
};