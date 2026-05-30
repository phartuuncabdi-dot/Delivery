export type UserRole = 'Admin' | 'Customer' | 'Driver';

export interface AuthUser {
  token: string;
  email: string;
  role: UserRole;
  userId: number;
}

export interface Order {
  orderId: number;
  customerId: number;
  customerName: string;
  driverId: number | null;
  driverName: string | null;
  productName: string;
  quantity: number;
  deliveryAddress: string;
  scheduledDate: string | null;
  status: string;
  createdAt: string;
}

export interface Customer {
  customerId: number;
  name: string;
  phone: string | null;
  address: string | null;
  email: string | null;
  isActive: boolean;
}

export interface Driver {
  driverId: number;
  driverName: string;
  phone: string | null;
  vehicleType: string | null;
  isAvailable: boolean;
}

export interface Payment {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: string | null;
  status: string;
  paymentDate: string;
}

export interface Notification {
  notificationId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DeliveryReport {
  orderId: number;
  customerName: string;
  driverName: string | null;
  productName: string;
  status: string;
  createdAt: string;
}

export interface CustomerReport {
  customerId: number;
  name: string;
  email: string | null;
  totalOrders: number;
}

export const ORDER_STATUSES = [
  'Pending',
  'Assigned',
  'PickedUp',
  'InTransit',
  'Delivered',
  'Cancelled',
] as const;
