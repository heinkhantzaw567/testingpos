// Customer related types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  status: "active" | "inactive" | "vip";
  creditBalance: number;
  dateAdded: string;
  // Additional fields for customer management
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  loyaltyPoints?: number;
  avatar?: string;
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
  zipCode: string;
  status: "active" | "inactive" | "vip";
  creditBalance: number;
}

// Customer form props
export interface AddCustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: CustomerFormData) => void;
}
