// Database Models - TypeScript interfaces for Supabase tables
// Generated from database schema for frozen food system

// =============================================
// ENUMS
// =============================================

export type UserRole = 'admin' | 'operator' | 'driver';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered' | 'failed';
export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'refunded';
export type TransactionType = 'income' | 'expense';
export type ProductFormat = 'S' | 'L';

// =============================================
// BASE INTERFACES
// =============================================

interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// CORE ENTITIES
// =============================================

export interface Profile extends BaseEntity {
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  is_active: boolean;
}

export interface Customer extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  delivery_notes?: string;
  is_active: boolean;
}

export interface Ingredient extends BaseEntity {
  name: string;
  description?: string;
  unit_of_measure: string; // kg, g, L, ml, units
  current_stock: number;
  minimum_stock: number;
  unit_cost: number;
  supplier?: string;
  is_active: boolean;
}

export interface Product extends BaseEntity {
  name: string;
  format: ProductFormat;
  description?: string;
  current_stock: number;
  minimum_stock: number;
  unit_price: number;
  production_cost: number;
  is_active: boolean;
}

export interface Recipe extends BaseEntity {
  product_id: string;
  ingredient_id: string;
  quantity_needed: number;
  notes?: string;
}

// =============================================
// ORDER SYSTEM
// =============================================

export interface Order extends BaseEntity {
  order_number: string;
  customer_id: string;
  created_by: string;
  status: OrderStatus;
  order_date: string;
  preferred_delivery_date?: string;
  special_instructions?: string;
  total_amount: number;
  payment_status: PaymentStatus;
  whatsapp_reference?: string;
  notes?: string;
}

export interface OrderItem extends BaseEntity {
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  notes?: string;
}

// =============================================
// PRODUCTION SYSTEM
// =============================================

export interface ProductionBatch extends BaseEntity {
  batch_number: string;
  product_id: string;
  planned_quantity: number;
  actual_quantity?: number;
  production_date: string;
  completed_at?: string;
  created_by: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ProductionBatchIngredient extends BaseEntity {
  batch_id: string;
  ingredient_id: string;
  planned_quantity: number;
  actual_quantity?: number;
}

// =============================================
// DELIVERY SYSTEM
// =============================================

export interface Delivery extends BaseEntity {
  order_id: string;
  assigned_to?: string;
  delivery_address: string;
  scheduled_date: string;
  scheduled_time_start?: string;
  scheduled_time_end?: string;
  actual_delivery_time?: string;
  status: DeliveryStatus;
  delivery_notes?: string;
  payment_collected?: number;
  payment_method?: 'cash' | 'transfer' | 'card' | 'pending';
}

// =============================================
// FINANCIAL SYSTEM
// =============================================

export interface FinancialTransaction extends BaseEntity {
  transaction_number: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  reference_id?: string;
  reference_type?: 'order' | 'delivery' | 'purchase' | 'expense' | 'other';
  created_by: string;
  notes?: string;
}

// =============================================
// AUDIT SYSTEM
// =============================================

export interface AuditLog {
  id: string;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  row_id: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  user_id?: string;
  timestamp: string;
}

// =============================================
// VIEW MODELS (for joins and computed data)
// =============================================

export interface OrderWithDetails extends Order {
  customer: Customer;
  items: (OrderItem & { product: Product })[];
  delivery?: Delivery;
  created_by_profile: Profile;
}

export interface DeliveryWithOrder extends Delivery {
  order: Order & { customer: Customer; items: OrderItem[] };
  assigned_driver?: Profile;
}

export interface ProductWithStock extends Product {
  low_stock: boolean; // computed: current_stock <= minimum_stock
  recipes: (Recipe & { ingredient: Ingredient })[];
}

export interface IngredientWithStock extends Ingredient {
  low_stock: boolean; // computed: current_stock <= minimum_stock
  used_in_products: (Recipe & { product: Product })[];
}

export interface ProductionBatchWithDetails extends ProductionBatch {
  product: Product;
  ingredients: (ProductionBatchIngredient & { ingredient: Ingredient })[];
  created_by_profile: Profile;
}

// =============================================
// CREATE/UPDATE DTOs
// =============================================

export interface CreateCustomerDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  delivery_notes?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  is_active?: boolean;
}

export interface CreateProductDto {
  name: string;
  format: ProductFormat;
  description?: string;
  minimum_stock: number;
  unit_price: number;
  production_cost: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  current_stock?: number;
  is_active?: boolean;
}

export interface CreateIngredientDto {
  name: string;
  description?: string;
  unit_of_measure: string;
  minimum_stock: number;
  unit_cost: number;
  supplier?: string;
}

export interface UpdateIngredientDto extends Partial<CreateIngredientDto> {
  current_stock?: number;
  is_active?: boolean;
}

export interface CreateOrderDto {
  customer_id: string;
  preferred_delivery_date?: string;
  special_instructions?: string;
  whatsapp_reference?: string;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price?: number; // Will default to product.unit_price if not provided
    notes?: string;
  }[];
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  preferred_delivery_date?: string;
  special_instructions?: string;
  notes?: string;
}

export interface CreateDeliveryDto {
  order_id: string;
  assigned_to?: string;
  delivery_address: string;
  scheduled_date: string;
  scheduled_time_start?: string;
  scheduled_time_end?: string;
  delivery_notes?: string;
}

export interface UpdateDeliveryDto extends Partial<CreateDeliveryDto> {
  status?: DeliveryStatus;
  actual_delivery_time?: string;
  payment_collected?: number;
  payment_method?: 'cash' | 'transfer' | 'card' | 'pending';
}

export interface CreateFinancialTransactionDto {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  reference_id?: string;
  reference_type?: 'order' | 'delivery' | 'purchase' | 'expense' | 'other';
  notes?: string;
}

// =============================================
// QUERY FILTERS
// =============================================

export interface OrderFilters {
  status?: OrderStatus | OrderStatus[];
  customer_id?: string;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  created_by?: string;
}

export interface DeliveryFilters {
  status?: DeliveryStatus | DeliveryStatus[];
  assigned_to?: string;
  scheduled_date?: string;
  date_from?: string;
  date_to?: string;
}

export interface FinancialTransactionFilters {
  type?: TransactionType;
  category?: string;
  date_from?: string;
  date_to?: string;
  reference_type?: string;
  created_by?: string;
}

// =============================================
// DASHBOARD STATISTICS
// =============================================

export interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    ready: number;
    delivered_today: number;
  };
  deliveries: {
    scheduled_today: number;
    in_transit: number;
    completed_today: number;
  };
  inventory: {
    low_stock_ingredients: number;
    low_stock_products: number;
  };
  financial: {
    today_income: number;
    today_expenses: number;
    cash_balance: number;
    pending_payments: number;
  };
}

// =============================================
// SUPABASE SPECIFIC
// =============================================

// For Supabase client typing
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;
      };
      ingredients: {
        Row: Ingredient;
        Insert: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      recipes: {
        Row: Recipe;
        Insert: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Recipe, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number' | 'total_amount'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at' | 'updated_at' | 'line_total'>;
        Update: Partial<Omit<OrderItem, 'id' | 'created_at' | 'updated_at'>>;
      };
      production_batches: {
        Row: ProductionBatch;
        Insert: Omit<ProductionBatch, 'id' | 'created_at' | 'updated_at' | 'batch_number'>;
        Update: Partial<Omit<ProductionBatch, 'id' | 'created_at' | 'updated_at' | 'batch_number'>>;
      };
      production_batch_ingredients: {
        Row: ProductionBatchIngredient;
        Insert: Omit<ProductionBatchIngredient, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProductionBatchIngredient, 'id' | 'created_at' | 'updated_at'>>;
      };
      deliveries: {
        Row: Delivery;
        Insert: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Delivery, 'id' | 'created_at' | 'updated_at'>>;
      };
      financial_transactions: {
        Row: FinancialTransaction;
        Insert: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at' | 'transaction_number'>;
        Update: Partial<Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at' | 'transaction_number'>>;
      };
      audit_log: {
        Row: AuditLog;
        Insert: never; // Audit log is insert-only via triggers
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_operator_or_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      calculate_order_total: {
        Args: { order_uuid: string };
        Returns: number;
      };
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      delivery_status: DeliveryStatus;
      payment_status: PaymentStatus;
      transaction_type: TransactionType;
      product_format: ProductFormat;
    };
  };
}