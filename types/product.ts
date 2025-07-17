// Product related types
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  sku: string;
  status: "active" | "inactive" | "low-stock";
  dateAdded: string;
  supplier: string;
  image?: string;
}

// Simplified product for forms/order selection
export interface SimpleProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Product form props
export interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'id' | 'dateAdded'>) => void;
}

export interface EditProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Product) => void;
  product: Product | null;
}
