// Form related types
export interface FormFieldError {
  [key: string]: string;
}

// Product form data type (strings for form inputs)
export interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  sku: string;
  status: "active" | "inactive" | "low-stock";
  supplier: string;
  image: string;
}
