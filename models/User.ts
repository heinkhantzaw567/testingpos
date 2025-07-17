export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'cashier' | 'employee';
  isActive: boolean;
  permissions: UserPermission[];
  lastLogin?: Date;
  passwordLastChanged?: Date;
  profileImage?: string;
  storeId?: string; // For multi-store systems
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPermission {
  id: string;
  name: string;
  description?: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'cashier' | 'employee';
  password: string;
  permissions?: string[]; // Array of permission IDs
  storeId?: string;
  notes?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'cashier' | 'employee';
  isActive?: boolean;
  permissions?: string[]; // Array of permission IDs
  storeId?: string;
  notes?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Default permission sets for different roles
export const DEFAULT_PERMISSIONS = {
  admin: [
    'manage_users',
    'manage_products',
    'manage_customers',
    'view_reports',
    'manage_settings',
    'process_sales',
    'process_returns',
    'manage_inventory',
    'view_analytics'
  ],
  manager: [
    'manage_products',
    'manage_customers',
    'view_reports',
    'process_sales',
    'process_returns',
    'manage_inventory',
    'view_analytics'
  ],
  cashier: [
    'view_products',
    'view_customers',
    'process_sales',
    'process_returns'
  ],
  employee: [
    'view_products',
    'view_customers',
    'process_sales'
  ]
};

// Database schema for Supabase/PostgreSQL
export const UserSchema = `
  -- If using Supabase auth, this extends the auth.users table
  -- Create a custom users table for additional user data
  CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'cashier', 'employee')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    password_last_changed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    profile_image TEXT,
    store_id UUID, -- For multi-store systems
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES user_profiles(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, permission_id)
  );

  -- Indexes for better performance
  CREATE INDEX idx_user_profiles_email ON user_profiles(email);
  CREATE INDEX idx_user_profiles_role ON user_profiles(role);
  CREATE INDEX idx_user_profiles_is_active ON user_profiles(is_active);
  CREATE INDEX idx_user_profiles_store_id ON user_profiles(store_id);
  
  CREATE INDEX idx_permissions_name ON permissions(name);
  CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
  CREATE INDEX idx_user_permissions_permission_id ON user_permissions(permission_id);

  -- Trigger to update updated_at timestamp
  CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  -- Insert default permissions
  INSERT INTO permissions (name, description) VALUES
    ('manage_users', 'Create, update, and delete user accounts'),
    ('manage_products', 'Full product management including add, edit, delete'),
    ('view_products', 'View products and inventory'),
    ('manage_customers', 'Full customer management including add, edit, delete'),
    ('view_customers', 'View customer information'),
    ('process_sales', 'Process sales transactions'),
    ('process_returns', 'Process returns and refunds'),
    ('manage_inventory', 'Manage inventory levels and stock'),
    ('view_reports', 'Access sales and inventory reports'),
    ('view_analytics', 'Access detailed analytics and insights'),
    ('manage_settings', 'Manage system settings and configuration')
  ON CONFLICT (name) DO NOTHING;

  -- Function to assign default permissions based on role
  CREATE OR REPLACE FUNCTION assign_default_permissions()
  RETURNS TRIGGER AS $$
  DECLARE
    permission_names TEXT[];
    permission_id UUID;
    perm_name TEXT;
  BEGIN
    -- Define permission arrays for each role
    IF NEW.role = 'admin' THEN
      permission_names := ARRAY['manage_users', 'manage_products', 'manage_customers', 'view_reports', 'manage_settings', 'process_sales', 'process_returns', 'manage_inventory', 'view_analytics'];
    ELSIF NEW.role = 'manager' THEN
      permission_names := ARRAY['manage_products', 'manage_customers', 'view_reports', 'process_sales', 'process_returns', 'manage_inventory', 'view_analytics'];
    ELSIF NEW.role = 'cashier' THEN
      permission_names := ARRAY['view_products', 'view_customers', 'process_sales', 'process_returns'];
    ELSIF NEW.role = 'employee' THEN
      permission_names := ARRAY['view_products', 'view_customers', 'process_sales'];
    END IF;

    -- Clear existing permissions if role changed
    IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
      DELETE FROM user_permissions WHERE user_id = NEW.id;
    END IF;

    -- Assign permissions for new users or role changes
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.role != NEW.role) THEN
      FOREACH perm_name IN ARRAY permission_names
      LOOP
        SELECT id INTO permission_id FROM permissions WHERE name = perm_name;
        IF permission_id IS NOT NULL THEN
          INSERT INTO user_permissions (user_id, permission_id) 
          VALUES (NEW.id, permission_id)
          ON CONFLICT (user_id, permission_id) DO NOTHING;
        END IF;
      END LOOP;
    END IF;

    RETURN NEW;
  END;
  $$ language 'plpgsql';

  CREATE TRIGGER assign_user_permissions
    AFTER INSERT OR UPDATE OF role ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_default_permissions();

  -- RLS (Row Level Security) policies for Supabase
  ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

  -- Policy: Users can view their own profile
  CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

  -- Policy: Users can update their own profile (limited fields)
  CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  -- Policy: Admins can manage all user profiles
  CREATE POLICY "Admins can manage users" ON user_profiles
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin' AND up.is_active = true
      )
    );

  -- Policy: Everyone can view permissions (for UI purposes)
  CREATE POLICY "Everyone can view permissions" ON permissions
    FOR SELECT USING (true);

  -- Policy: Users can view their own permissions
  CREATE POLICY "Users can view own permissions" ON user_permissions
    FOR SELECT USING (user_id = auth.uid());

  -- Policy: Admins can manage user permissions
  CREATE POLICY "Admins can manage user permissions" ON user_permissions
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin' AND up.is_active = true
      )
    );
`;

export default User;
