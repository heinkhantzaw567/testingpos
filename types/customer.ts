// Customer related types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  dateAdded: string;
  loyaltyPoints: number;
  creditBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Simplified customer for forms/order selection
export interface SimpleCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Customer form data (subset used in forms)
export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  creditBalance?: number;
}

// Customer form props
export interface AddCustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: CustomerFormData) => void;
}
