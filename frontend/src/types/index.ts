export interface Order {
  id?: number;
  customerId: number;
  customerName?: string;
  items: { productId: number; quantity: number }[];
  totalAmount?: number;
  status?: string;
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

