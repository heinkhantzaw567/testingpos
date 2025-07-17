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

export interface CreateCustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  creditBalance?: number;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  creditBalance?: number;
}

// Database schema for Supabase/PostgreSQL
export const CustomerSchema = `
  CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    last_order_date TIMESTAMP,
    date_added DATE DEFAULT CURRENT_DATE,
    loyalty_points INTEGER DEFAULT 0,
    credit_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Indexes for better performance
  CREATE INDEX idx_customers_email ON customers(email);
  CREATE INDEX idx_customers_status ON customers(status);
  CREATE INDEX idx_customers_name ON customers(name);
  CREATE INDEX idx_customers_created_at ON customers(created_at);

  -- Trigger to update updated_at timestamp
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

export default Customer;
