import { api } from './client';
import type {
  AuthUser,
  Customer,
  CustomerReport,
  DeliveryReport,
  Driver,
  Notification,
  Order,
  Payment,
  UserRole,
} from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api<AuthUser>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
    role: UserRole;
  }) =>
    api<AuthUser>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const ordersApi = {
  create: (token: string, data: object) =>
    api<Order>('/api/orders', { method: 'POST', body: JSON.stringify(data) }, token),
  myOrders: (token: string) => api<Order[]>('/api/orders/my', {}, token),
  getById: (token: string, id: number) => api<Order>(`/api/orders/${id}`, {}, token),
};

export const paymentsApi = {
  create: (token: string, data: object) =>
    api<Payment>('/api/payments', { method: 'POST', body: JSON.stringify(data) }, token),
  byOrder: (token: string, orderId: number) =>
    api<Payment[]>(`/api/payments/order/${orderId}`, {}, token),
};

export const notificationsApi = {
  list: (token: string) => api<Notification[]>('/api/notifications', {}, token),
  markRead: (token: string, id: number) =>
    api<void>(`/api/notifications/${id}/read`, { method: 'PUT' }, token),
};

export const adminApi = {
  customers: (token: string) => api<Customer[]>('/api/admin/customers', {}, token),
  drivers: (token: string) => api<Driver[]>('/api/admin/drivers', {}, token),
  createDriver: (token: string, data: object) =>
    api<Driver>('/api/admin/drivers', { method: 'POST', body: JSON.stringify(data) }, token),
  orders: (token: string) => api<Order[]>('/api/admin/orders', {}, token),
  assignDriver: (token: string, orderId: number, driverId: number) =>
    api<Order>(
      `/api/admin/orders/${orderId}/assign-driver`,
      { method: 'PUT', body: JSON.stringify({ driverId }) },
      token
    ),
  updateStatus: (token: string, orderId: number, status: string) =>
    api<Order>(
      `/api/admin/orders/${orderId}/status`,
      { method: 'PUT', body: JSON.stringify({ status }) },
      token
    ),
  deliveryReport: (token: string) =>
    api<DeliveryReport[]>('/api/admin/reports/deliveries', {}, token),
  customerReport: (token: string) =>
    api<CustomerReport[]>('/api/admin/reports/customers', {}, token),
};

export const driverApi = {
  assignments: (token: string) => api<Order[]>('/api/drivers/assignments', {}, token),
  updateStatus: (token: string, orderId: number, status: string) =>
    api<Order>(
      `/api/drivers/orders/${orderId}/status`,
      { method: 'PUT', body: JSON.stringify({ status }) },
      token
    ),
  complete: (token: string, orderId: number) =>
    api<Order>(`/api/drivers/orders/${orderId}/complete`, { method: 'PUT' }, token),
};
