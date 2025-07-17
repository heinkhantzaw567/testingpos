// Vendor related types
export interface Vendor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  website?: string;
  contactPerson: string;
  paymentTerms: string;
  status: "active" | "inactive" | "suspended";
  rating: number; // 1-5 stars
  totalOrders: number;
  totalPurchases: number;
  lastOrderDate?: string;
  dateAdded: string;
  notes?: string;
  taxId?: string;
  currency: string;
  leadTime: number; // in days
}

// Simplified vendor for product forms and quick selection
export interface SimpleVendor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

// Vendor form data (subset used in forms)
export interface VendorFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  website: string;
  contactPerson: string;
  paymentTerms: string;
  status: "active" | "inactive" | "suspended";
  rating: number;
  notes: string;
  taxId: string;
  currency: string;
  leadTime: number;
}

// Vendor form props
export interface AddVendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vendorData: VendorFormData) => void;
}

export interface EditVendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vendorData: Vendor) => void;
  vendor: Vendor | null;
}
