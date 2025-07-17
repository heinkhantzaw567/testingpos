// Order related types
import { Product, SimpleProduct } from './product';
import { Customer } from './customer';

export type OrderStatus = "completed" | "pending" | "processing" | "cancelled";

// Simplified customer info for orders
export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// OrderItem for new order form (includes simple product for selection)
export interface OrderItem {
  product: SimpleProduct;
  quantity: number;
  subtotal: number;
}

// Simplified OrderItem for order history (just the essential data)
export interface OrderItemSummary {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: OrderItemSummary[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  date: string;
  time: string;
  notes?: string;
}

// Extended order with full data (for new orders)
export interface FullOrder {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountReason?: string;
  taxRate: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  notes?: string;
  date: string;
  time: string;
}

// New order form props
export interface NewOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: NewOrderData) => void;
}

// Data structure for new order submission
export interface NewOrderData {
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountReason?: string;
  taxRate: number;
  tax: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  date: string;
  time: string;
}
