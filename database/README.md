# Database Setup - Frozen Food System

## Overview
Complete PostgreSQL schema for frozen food business management with Supabase backend.

## 🗂️ Structure
```
database/
├── migrations/          # SQL migration files (run in order)
├── seeds/              # Test data for development
├── documentation/      # Schema and API docs
└── README.md          # This file
```

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Save your project URL and anon key

### 2. Run Migrations (in order)
Execute these SQL files in your Supabase SQL editor:

```sql
-- 1. Core tables and functions
-- Copy/paste: migrations/001_core_tables.sql

-- 2. Order and business logic
-- Copy/paste: migrations/002_order_system.sql  

-- 3. Security policies
-- Copy/paste: migrations/003_rls_policies.sql
```

### 3. Load Test Data
```sql
-- Copy/paste: seeds/001_initial_data.sql
```

### 4. Update Environment
Update your `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key'
  }
};
```

## 📊 Database Schema

### Core Entities
- **profiles** - User roles and information (extends auth.users)
- **customers** - Customer contact and delivery info
- **ingredients** - Raw materials inventory  
- **products** - Finished goods (Small/Large formats)
- **recipes** - Ingredient → Product relationships

### Business Logic
- **orders** - Customer orders with status tracking
- **order_items** - Individual products per order
- **production_batches** - Manufacturing runs
- **deliveries** - Delivery scheduling and payment
- **financial_transactions** - Income/expense tracking

### Security Features
- **Row Level Security (RLS)** on all tables
- **Role-based access:** admin, operator, driver
- **Audit logging** for sensitive operations
- **Automatic timestamps** and data validation

## 🔐 User Roles & Access

### Admin Role
- Full access to all data
- Financial transactions management
- User role management
- System configuration

### Operator Role  
- Orders, customers, inventory
- Production planning
- Stock management
- No financial data access

### Driver Role
- Assigned deliveries only
- Payment collection
- Delivery status updates
- No inventory/production access

## 🧪 Test Data Overview

The seed data includes:
- **3 test users** (admin, operator, driver)
- **5 sample customers** (restaurants, bars, hotels)
- **10 ingredients** (flour, cheese, tomato, etc.)
- **6 products** (pizzas in S/L formats)
- **Sample orders** with realistic data
- **Production batches** and delivery records
- **Financial transactions** (income/expenses)

### Test User Accounts
Create these in Supabase Auth first, then adjust UUIDs in seed data:
- `admin@frozenfood.com` (admin role)
- `operator@frozenfood.com` (operator role)  
- `driver@frozenfood.com` (driver role)

## 📋 Verification Checklist

After setup, verify everything works:

### ✅ Database Structure
```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should return: audit_log, customers, deliveries, financial_transactions, 
-- ingredients, order_items, orders, production_batch_ingredients, 
-- production_batches, products, profiles, recipes
```

### ✅ RLS Policies
```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- All tables should have rowsecurity = true
```

### ✅ Test Data
```sql
-- Quick data count
SELECT 'customers' as table_name, COUNT(*) FROM customers
UNION ALL SELECT 'products', COUNT(*) FROM products  
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'ingredients', COUNT(*) FROM ingredients;

-- Should show: customers(5), products(6), orders(3), ingredients(10)
```

### ✅ Angular Integration
```typescript
// Test in your Angular app
async testConnection() {
  const result = await this.supabase.testConnection();
  console.log(result); // Should show: success: true
  
  const schema = await this.supabase.testDatabaseSchema();
  console.log(schema); // Should show all 9+ tables
}
```

## 🔧 Common Issues & Solutions

### Migration Errors
**Issue:** "relation does not exist"
- **Solution:** Run migrations in exact order (001, 002, 003)

**Issue:** "permission denied for schema public"  
- **Solution:** Use Supabase SQL editor, not external tools

### RLS Policy Issues
**Issue:** "new row violates row-level security policy"
- **Solution:** Ensure user has correct role in profiles table
- **Check:** User exists in both auth.users and profiles

### Seed Data Problems
**Issue:** "insert or update on table violates foreign key constraint"
- **Solution:** Adjust UUIDs in seed data to match your auth.users IDs
- **Alternative:** Create test users first, then update seed data

### Connection Issues
**Issue:** "Invalid API key"
- **Solution:** Check environment.ts has correct URL and anon key
- **Verify:** Project settings in Supabase dashboard

## 📚 Documentation

- **Schema Design:** `documentation/schema-design.md`
- **API Endpoints:** `documentation/api-endpoints.md`  
- **TypeScript Models:** `src/app/shared/models/database.interface.ts`

## 🚢 Deployment Notes

### Production Checklist
- [ ] Enable database backups
- [ ] Set up monitoring alerts
- [ ] Review RLS policies for production data
- [ ] Configure connection pooling if needed
- [ ] Set up SSL certificate verification

### Performance Optimization
- All critical indexes are included in migrations
- Consider partitioning for high-volume tables
- Monitor slow query log in Supabase dashboard
- Use connection pooling for high concurrent usage

## 🔄 Updates & Maintenance

### Adding New Fields
1. Create migration file: `004_add_new_field.sql`
2. Update TypeScript interfaces
3. Update seed data if needed
4. Test thoroughly before production

### Schema Changes
- Always use migrations, never direct ALTER statements
- Test migrations on staging environment first
- Backup database before major changes
- Update documentation after schema changes

---

**Need Help?** 
- Check Supabase documentation: https://supabase.com/docs
- Review logs in Supabase dashboard
- Test queries in SQL editor before using in Angular