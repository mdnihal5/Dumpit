/**
 * Types related to orders in the application
 */

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  billing: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  shipping?: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
} 