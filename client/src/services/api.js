/**
 * StockFlow 2.0 API Client
 * Seamless communication with backend Node.js and ML bridge
 */

const BASE_URL = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = `Server error ${res.status}`;
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch (_) {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Status & System
  getStatus: () => fetch(`${BASE_URL}/status`).then(handleResponse),
  resetDemoData: () => fetch(`${BASE_URL}/seed/reset`, { method: 'POST' }).then(handleResponse),
  configureSupabase: (url, key) =>
    fetch(`${BASE_URL}/config/supabase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key })
    }).then(handleResponse),

  // Dashboard
  getDashboardStats: () => fetch(`${BASE_URL}/dashboard/stats`).then(handleResponse),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/products${query ? `?${query}` : ''}`).then(handleResponse);
  },
  createProduct: (product) =>
    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }).then(handleResponse),
  updateProduct: (id, product) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }).then(handleResponse),
  deleteProduct: (id) =>
    fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Categories
  getCategories: () => fetch(`${BASE_URL}/categories`).then(handleResponse),
  createCategory: (cat) =>
    fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    }).then(handleResponse),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/orders${query ? `?${query}` : ''}`).then(handleResponse);
  },
  createOrder: (order) =>
    fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).then(handleResponse),
  updateOrderStatus: (id, status) =>
    fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(handleResponse),
  deleteOrder: (id) =>
    fetch(`${BASE_URL}/orders/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Suppliers
  getSuppliers: () => fetch(`${BASE_URL}/suppliers`).then(handleResponse),
  createSupplier: (supplier) =>
    fetch(`${BASE_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier)
    }).then(handleResponse),
  updateSupplier: (id, supplier) =>
    fetch(`${BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier)
    }).then(handleResponse),
  deleteSupplier: (id) =>
    fetch(`${BASE_URL}/suppliers/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Warehouses
  getWarehouses: () => fetch(`${BASE_URL}/warehouses`).then(handleResponse),
  createWarehouse: (warehouse) =>
    fetch(`${BASE_URL}/warehouses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(warehouse)
    }).then(handleResponse),
  transferWarehouseStock: (data) =>
    fetch(`${BASE_URL}/warehouses/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  // Stock Movements
  getStockMovements: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/movements${query ? `?${query}` : ''}`).then(handleResponse);
  },
  createStockMovement: (data) =>
    fetch(`${BASE_URL}/movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

  // AI Forecasting
  getForecast: (fresh = false, days = 30) =>
    fetch(`${BASE_URL}/forecast?fresh=${fresh}&days=${days}`).then(handleResponse),
  generateForecast: (days = 30) =>
    fetch(`${BASE_URL}/forecast/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days })
    }).then(handleResponse),

  // Reports
  getReportsAnalytics: () => fetch(`${BASE_URL}/reports/analytics`).then(handleResponse)
};
