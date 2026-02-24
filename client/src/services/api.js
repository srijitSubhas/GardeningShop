import axios from 'axios';

/**
 * Axios instance configured to talk to the Node.js API server.
 * In dev, Vite proxies /api/* to http://localhost:3001.
 * In production, set VITE_API_BASE_URL env var.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: true, // send/receive session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
};

// ─── Plants ──────────────────────────────────────────────────────────────────

export const plantsAPI = {
  getAll: () => api.get('/api/plants'),
  getById: (id) => api.get(`/api/plants/${id}`),
};

// ─── Cart ────────────────────────────────────────────────────────────────────

export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addItem: (plant_id, quantity) => api.post('/api/cart', { plant_id, quantity }),
  removeItem: (id) => api.delete(`/api/cart/${id}`),
  clearCart: () => api.delete('/api/cart'),
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export const ordersAPI = {
  getOrders: (order_id = '') =>
    api.get('/api/orders', { params: order_id ? { order_id } : {} }),
  placeBulkOrder: (data) => api.post('/api/orders/bulk', data),
  updateStatus: (order_id, status) =>
    api.patch(`/api/orders/${encodeURIComponent(order_id)}/status`, { status }),
};

export default api;
