# Database Schema Design - Frozen Food System

## Overview
Complete PostgreSQL schema for frozen food business management system.

## Core Entities

### 1. Users & Authentication
```sql
-- Managed by Supabase Auth
-- Additional profile data in profiles table
```

### 2. Business Core Tables

#### profiles
- User profile information
- Role-based access control
- Links to Supabase auth.users

#### customers  
- Customer information
- Contact details and preferences
- Delivery addresses

#### ingredients
- Raw materials inventory
- Stock tracking and alerts
- Purchase information

#### products
- Finished goods (Small/Large formats)
- Current stock levels
- Production recipes

#### recipes
- Ingredient → Product relationships
- Quantities and measurements
- Production instructions

#### orders (pedidos)
- Customer orders from WhatsApp
- Status tracking (pending → delivered)
- Payment and delivery information

#### order_items
- Individual products in each order
- Quantities and formats
- Pricing information

#### production_batches
- Production runs/batches
- Ingredient consumption
- Product output

#### deliveries
- Delivery management
- Routes and status
- Payment collection

#### financial_transactions
- Income and expense tracking
- Cash flow management
- Transaction categorization

## Key Relationships

```
customers (1) ←→ (N) orders
orders (1) ←→ (N) order_items
products (1) ←→ (N) order_items
products (1) ←→ (N) recipes ←→ (N) ingredients
orders (1) ←→ (1) deliveries
deliveries (1) ←→ (N) financial_transactions
```

## Security Model (RLS)

### Role-Based Access
- **admin**: Full access to all tables
- **operator**: Orders, stock, production (no financial data)
- **driver**: Deliveries and payment collection only

### Data Isolation
- Users can only see data relevant to their role
- Financial data restricted to admin role
- Audit trail for all sensitive operations

## Indexes Strategy

### Performance Indexes
- orders.customer_id, orders.status, orders.created_at
- order_items.order_id, order_items.product_id
- ingredients.stock_quantity, products.stock_quantity
- financial_transactions.transaction_date, financial_transactions.type

### Unique Constraints
- customers.email (if provided)
- products.name, products.format combination
- ingredients.name

## Triggers & Functions

### Automatic Timestamps
- created_at, updated_at for all tables
- PostgreSQL triggers for automatic maintenance

### Stock Management
- Automatic stock updates on order completion
- Stock alerts when below minimum levels
- Production batch stock calculations

### Financial Calculations
- Automatic transaction creation on order completion
- Cash balance calculations
- Daily/monthly financial summaries

## Data Validation

### Business Rules
- Order quantities must be positive
- Stock quantities cannot go negative
- Required fields per business process
- Date validations for deliveries

### Data Types
- UUIDs for primary keys (Supabase standard)
- DECIMAL for monetary values
- TIMESTAMP WITH TIME ZONE for dates
- ENUM types for status fields

## Migration Strategy

1. **Core structure** (users, customers, products, ingredients)
2. **Order management** (orders, order_items)
3. **Production system** (recipes, production_batches)  
4. **Delivery system** (deliveries)
5. **Financial system** (financial_transactions)
6. **Indexes and optimization**
7. **RLS policies and security**
8. **Seed data and testing**

## Future Considerations

### Scalability
- Partitioning for large transaction tables
- Archive strategy for old orders
- Backup and recovery procedures

### Features
- WhatsApp integration hooks
- Reporting and analytics tables
- Audit logging system
- File attachments support