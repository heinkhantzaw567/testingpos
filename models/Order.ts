export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  userId?: string; // Who created the order
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'credit_balance' | 'split';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'draft' | 'completed' | 'cancelled' | 'refunded';
  notes?: string;
  taxRate: number;
  discountType: 'fixed' | 'percentage';
  creditUsed: number;
  cashReceived?: number;
  changeGiven?: number;
  receiptNumber?: string;
  dateCreated: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number; // Price at time of sale
  cost?: number; // Cost at time of sale
  total: number;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderData {
  customerId: string;
  customerName: string;
  userId?: string;
  items: CreateOrderItemData[];
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'credit_balance' | 'split';
  notes?: string;
  taxRate?: number;
  discount?: number;
  discountType?: 'fixed' | 'percentage';
  creditUsed?: number;
  cashReceived?: number;
}

export interface CreateOrderItemData {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  cost?: number;
  discount?: number;
}

export interface UpdateOrderData {
  status?: 'draft' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
}

// Database schema for Supabase/PostgreSQL
export const OrderSchema = `
  CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    user_id UUID, -- References auth.users if using Supabase auth
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'credit_balance', 'split')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'cancelled', 'refunded')),
    notes TEXT,
    tax_rate DECIMAL(5,4) DEFAULT 0.08,
    discount_type VARCHAR(20) DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
    credit_used DECIMAL(10,2) DEFAULT 0.00,
    cash_received DECIMAL(10,2),
    change_given DECIMAL(10,2),
    receipt_number VARCHAR(50),
    date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    total DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Indexes for better performance
  CREATE INDEX idx_orders_customer_id ON orders(customer_id);
  CREATE INDEX idx_orders_user_id ON orders(user_id);
  CREATE INDEX idx_orders_status ON orders(status);
  CREATE INDEX idx_orders_date_created ON orders(date_created);
  CREATE INDEX idx_orders_payment_status ON orders(payment_status);
  
  CREATE INDEX idx_order_items_order_id ON order_items(order_id);
  CREATE INDEX idx_order_items_product_id ON order_items(product_id);

  -- Trigger to update updated_at timestamp
  CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  -- Function to generate receipt number
  CREATE OR REPLACE FUNCTION generate_receipt_number()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.receipt_number IS NULL THEN
      NEW.receipt_number = 'RCP-' || TO_CHAR(NEW.date_created, 'YYYYMMDD') || '-' || LPAD(NEXTVAL('receipt_sequence')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Create sequence for receipt numbers
  CREATE SEQUENCE receipt_sequence START 1;

  CREATE TRIGGER generate_orders_receipt_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_receipt_number();
`;

export default Order;
