
import { api } from './api';

// Create COD order
export const createOrder = (payload) => api.post('/orders', payload);

// Customer orders
export const getMyOrders = async () =>
  (await api.get('/orders/my-orders')).orders;

export const getOrder = async (id) =>
  (await api.get(`/orders/${id}`)).order;

// Cancel order
export const cancelOrder = async (id) =>
  (await api.post(`/orders/${id}/cancel`)).order;

// Return order
export const requestReturn = async (id, reason) =>
  (await api.post(`/orders/${id}/return`, { reason })).order;
