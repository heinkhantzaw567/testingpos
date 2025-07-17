export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  supplier?: string;
  status: 'active' | 'inactive' | 'low-stock';
  dateAdded: string;
  image?: string;
  minStockLevel: number;
  maxStockLevel: number;
  cost: number; // Purchase cost
  barcode?: string;
  weight?: number;
  dimensions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  supplier?: string;
  image?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  cost?: number;
  barcode?: string;
  weight?: number;
  dimensions?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  supplier?: string;
  status?: 'active' | 'inactive' | 'low-stock';
  image?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  cost?: number;
  barcode?: string;
  weight?: number;
  dimensions?: string;
}

// Database schema for Supabase/PostgreSQL
export const ProductSchema = `
  CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    supplier VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'low-stock')),
    date_added DATE DEFAULT CURRENT_DATE,
    image TEXT,
    min_stock_level INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 1000,
    cost DECIMAL(10,2) DEFAULT 0.00,
    barcode VARCHAR(255),
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Indexes for better performance
  CREATE INDEX idx_products_sku ON products(sku);
  CREATE INDEX idx_products_category ON products(category);
  CREATE INDEX idx_products_status ON products(status);
  CREATE INDEX idx_products_name ON products(name);
  CREATE INDEX idx_products_barcode ON products(barcode);
  CREATE INDEX idx_products_stock ON products(stock);

  -- Trigger to automatically update status based on stock
  CREATE OR REPLACE FUNCTION update_product_status()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.stock = 0 THEN
      NEW.status = 'inactive';
    ELSIF NEW.stock <= NEW.min_stock_level THEN
      NEW.status = 'low-stock';
    ELSE
      NEW.status = 'active';
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  CREATE TRIGGER update_products_status_and_timestamp
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_status();
`;

export default Product;
