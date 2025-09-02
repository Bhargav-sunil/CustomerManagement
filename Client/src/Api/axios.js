import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Customers
export const customersAPI = {
  getAll: (params) => api.get("/customers", { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post("/customers", data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Addresses
export const addressesAPI = {
  getByCustomerId: (customerId) => api.get(`/${customerId}/addresses`),
  create: (customerId, data) => api.post(`/${customerId}/addresses`, data),
  update: (addressId, data) => api.put(`/${addressId}`, data),
  delete: (addressId) => api.delete(`/${addressId}`),
};

export default api;
