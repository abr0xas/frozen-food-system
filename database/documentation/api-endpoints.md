# API Endpoints Documentation - Frozen Food System

## Overview
Supabase auto-generates REST API endpoints for all tables with Row Level Security (RLS) applied. This document describes the available endpoints and their usage.

## Base URL
```
https://your-project-id.supabase.co/rest/v1
```

## Authentication
All requests require the Authorization header:
```
Authorization: Bearer <supabase_anon_key>
```

For authenticated requests, use the user's JWT token instead of the anon key.

## =============================================
## CORE ENTITIES ENDPOINTS
## =============================================

### Profiles
**Base endpoint:** `/profiles`

#### GET /profiles
- **Purpose:** Get user profiles
- **Access:** Users can see their own profile, admins see all
- **Query params:** 
  - `select=*` (default) or specific fields
  - `role=eq.admin` (filter by role)
  - `is_active=eq.true` (filter active users)

**Example:**
```typescript
// Get current user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// Get all operators (admin only)
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('role', 'operator');
```

#### POST /profiles
- **Access:** Admin only
- **Body:** Profile data without id, created_at, updated_at

#### PATCH /profiles?id=eq.<uuid>
- **Access:** Users can update their own (except role), admins all
- **Body:** Partial profile data

### Customers
**Base endpoint:** `/customers`

#### GET /customers
- **Access:** Operators/admins see all, drivers see delivery-related only
- **Query params:**
  - `select=*`
  - `is_active=eq.true`
  - `name=ilike.%search_term%`

**Example:**
```typescript
// Search customers by name
const { data, error } = await supabase
  .from('customers')
  .select('*')
  .ilike('name', '%restaurant%')
  .eq('is_active', true);
```

#### POST /customers
- **Access:** Operators/admins only
- **Body:** Customer data

#### PATCH /customers?id=eq.<uuid>
- **Access:** Operators/admins only

### Products & Ingredients
**Base endpoints:** `/products`, `/ingredients`

#### GET /products
- **Access:** Operators/admins only
- **Query params:**
  - `format=eq.S` or `format=eq.L`
  - `is_active=eq.true`
  - `current_stock=lt.minimum_stock` (low stock)

**Example:**
```typescript
// Get low stock products
const { data, error } = await supabase
  .from('products')
  .select('*')
  .filter('current_stock', 'lt', 'minimum_stock')
  .eq('is_active', true);

// Get products with recipes
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    recipes(
      quantity_needed,
      ingredient:ingredients(name, unit_of_measure)
    )
  `);
```

### Recipes
**Base endpoint:** `/recipes`

#### GET /recipes
- **Access:** Operators/admins only
- **Relations:** Can join with products and ingredients

**Example:**
```typescript
// Get complete recipe information
const { data, error } = await supabase
  .from('recipes')
  .select(`
    *,
    product:products(name, format),
    ingredient:ingredients(name, unit_of_measure, current_stock)
  `);
```

## =============================================
## ORDER SYSTEM ENDPOINTS
## =============================================

### Orders
**Base endpoint:** `/orders`

#### GET /orders
- **Access:** Operators/admins see all, drivers see assigned deliveries
- **Query params:**
  - `status=eq.pending`
  - `customer_id=eq.<uuid>`
  - `order_date=gte.2025-01-01`
  - `payment_status=eq.pending`

**Example:**
```typescript
// Get orders with customer and items
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    customer:customers(name, phone),
    order_items(
      *,
      product:products(name, format)
    ),
    delivery:deliveries(*)
  `)
  .eq('status', 'pending')
  .order('created_at', { ascending: false });

// Get today's orders
const today = new Date().toISOString().split('T')[0];
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .gte('order_date', today);
```

#### POST /orders
- **Access:** Operators/admins only
- **Body:** Order data (order_number and total_amount auto-generated)
- **Note:** Use transactions for creating order + order_items

#### PATCH /orders?id=eq.<uuid>
- **Access:** Operators/admins, drivers can update delivery-related fields

### Order Items
**Base endpoint:** `/order_items`

#### GET /order_items
- **Relations:** Usually accessed through orders endpoint

#### POST /order_items
- **Access:** Operators/admins only
- **Note:** line_total should be calculated (quantity * unit_price)

## =============================================
## PRODUCTION SYSTEM ENDPOINTS
## =============================================

### Production Batches
**Base endpoint:** `/production_batches`

#### GET /production_batches
- **Access:** Operators/admins only

**Example:**
```typescript
// Get production batches with ingredients
const { data, error } = await supabase
  .from('production_batches')
  .select(`
    *,
    product:products(name, format),
    production_batch_ingredients(
      *,
      ingredient:ingredients(name, unit_of_measure)
    )
  `)
  .eq('status', 'completed')
  .gte('production_date', '2025-01-01');
```

## =============================================
## DELIVERY SYSTEM ENDPOINTS
## =============================================

### Deliveries
**Base endpoint:** `/deliveries`

#### GET /deliveries
- **Access:** Operators/admins see all, drivers see assigned only

**Example:**
```typescript
// Get today's deliveries for driver
const today = new Date().toISOString().split('T')[0];
const { data, error } = await supabase
  .from('deliveries')
  .select(`
    *,
    order:orders(
      order_number,
      total_amount,
      customer:customers(name, phone)
    )
  `)
  .eq('assigned_to', user.id)
  .eq('scheduled_date', today)
  .order('scheduled_time_start');
```

#### PATCH /deliveries?id=eq.<uuid>
- **Access:** Operators/admins and assigned drivers
- **Common updates:** status, actual_delivery_time, payment_collected

## =============================================
## FINANCIAL SYSTEM ENDPOINTS
## =============================================

### Financial Transactions
**Base endpoint:** `/financial_transactions`

#### GET /financial_transactions
- **Access:** Admin only (drivers see delivery-related payments)
- **Query params:**
  - `type=eq.income` or `type=eq.expense`
  - `transaction_date=gte.2025-01-01`
  - `category=eq.Ventas`

**Example:**
```typescript
// Get monthly financial summary
const { data, error } = await supabase
  .from('financial_transactions')
  .select('type, amount')
  .gte('transaction_date', '2025-01-01')
  .lt('transaction_date', '2025-02-01');

// Calculate totals
const income = data?.filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0) || 0;
const expenses = data?.filter(t => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0) || 0;
```

## =============================================
## RPC FUNCTIONS
## =============================================

### Available Functions

#### get_user_role()
```typescript
const { data: role, error } = await supabase.rpc('get_user_role');
```

#### is_admin()
```typescript
const { data: isAdmin, error } = await supabase.rpc('is_admin');
```

#### calculate_order_total(order_uuid)
```typescript
const { data: total, error } = await supabase
  .rpc('calculate_order_total', { order_uuid: orderId });
```

## =============================================
## COMMON QUERY PATTERNS
## =============================================

### Dashboard Statistics
```typescript
async function getDashboardStats() {
  const today = new Date().toISOString().split('T')[0];
  
  // Orders stats
  const { data: ordersStats } = await supabase
    .from('orders')
    .select('status')
    .eq('order_date', today);
  
  // Deliveries stats  
  const { data: deliveriesStats } = await supabase
    .from('deliveries')
    .select('status')
    .eq('scheduled_date', today);
    
  // Low stock items
  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('id')
    .filter('current_stock', 'lte', 'minimum_stock');
    
  // Financial stats
  const { data: financialStats } = await supabase
    .from('financial_transactions')
    .select('type, amount')
    .eq('transaction_date', today);
}
```

### Search with Filters
```typescript
// Complex order search
async function searchOrders(filters: OrderFilters) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      customer:customers(name),
      order_items(quantity, product:products(name))
    `);
    
  if (filters.status) {
    if (Array.isArray(filters.status)) {
      query = query.in('status', filters.status);
    } else {
      query = query.eq('status', filters.status);
    }
  }
  
  if (filters.date_from) {
    query = query.gte('order_date', filters.date_from);
  }
  
  if (filters.date_to) {
    query = query.lte('order_date', filters.date_to);
  }
  
  return query.order('created_at', { ascending: false });
}
```

## =============================================
## ERROR HANDLING
## =============================================

### Common Error Codes
- **PGRST116:** Table not found (schema not deployed)
- **23505:** Unique constraint violation  
- **23503:** Foreign key constraint violation
- **42501:** Insufficient privileges (RLS policy)

### TypeScript Error Handling
```typescript
async function safeQuery<T>(queryFn: () => Promise<{ data: T | null; error: any }>) {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  }
}
```

## =============================================
## PERFORMANCE CONSIDERATIONS
## =============================================

### Efficient Queries
- Use `select()` to specify needed columns
- Use `limit()` for pagination
- Use `single()` when expecting one result
- Use `order()` with indexed columns
- Use `range()` for pagination

### Avoid N+1 Queries
```typescript
// ❌ Bad - Multiple queries
const orders = await supabase.from('orders').select('*');
for (const order of orders.data || []) {
  const items = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);
}

// ✅ Good - Single query with join
const orders = await supabase
  .from('orders')
  .select(`
    *,
    order_items(*)
  `);
```

## =============================================
## SECURITY CONSIDERATIONS
## =============================================

### RLS Policies
- All queries respect Row Level Security
- Users automatically see only authorized data
- Use service_role key only in secure server environments
- Never expose service_role key in frontend

### Data Validation
- Validate data on client before sending
- Database constraints provide final validation
- Use TypeScript interfaces for type safety
- Sanitize user inputs for text search