export type OrderStatus = "PENDIENTE" | "SERVIDO" | "PAGADO";

export interface Order {
  id?: number;
  customerId: number;
  customerName?: string;
  items: { productId: number; quantity: number }[];
  totalAmount?: number;
  status?: OrderStatus;
  notes?: string;
}


export interface Product {
  id?: number;
  name: string;
  price: number;
  available?: boolean;
}

export interface Customer {
  id?: number;
  cedula: string;
  fullName: string;
  phone?: string;
  address?: string;
}

export type Role = 'ROLE_ADMIN' | 'ROLE_CASHIER' | 'ROLE_WAITER';

export interface User {
  username: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  role: Role;
}
