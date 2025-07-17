// Type exports
export type { Customer, CreateCustomerData, UpdateCustomerData } from './Customer';
export type { Product, CreateProductData, UpdateProductData } from './Product';
export type { Order, OrderItem, CreateOrderData, CreateOrderItemData, UpdateOrderData } from './Order';
export type { User, UserPermission, CreateUserData, UpdateUserData, UpdatePasswordData } from './User';

// Schema exports for database setup
export { CustomerSchema } from './Customer';
export { ProductSchema } from './Product';
export { OrderSchema } from './Order';
export { UserSchema } from './User';

// Utility exports
export { DEFAULT_PERMISSIONS } from './User';

// Import schemas for combined export
import { CustomerSchema } from './Customer';
import { ProductSchema } from './Product';
import { OrderSchema } from './Order';
import { UserSchema } from './User';

// Combined schema for easy database setup
export const AllSchemas = `
-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Customer tables
${CustomerSchema}

-- Product tables  
${ProductSchema}

-- User tables
${UserSchema}

-- Order tables (depends on customers, products, users)
${OrderSchema}
`;
