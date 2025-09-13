-- Migration 003: Row Level Security (RLS) Policies - FIXED VERSION
-- Description: Implement role-based security for all tables
-- Date: 2025-01-14
-- Depends on: 001_core_tables.sql, 002_order_system.sql

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_batch_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- =============================================

-- Get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM profiles 
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is operator or admin
CREATE OR REPLACE FUNCTION is_operator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('admin', 'operator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is driver, operator or admin
CREATE OR REPLACE FUNCTION is_authenticated_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('admin', 'operator', 'driver');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================

-- Users can read their own profile, admins can read all
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (
        id = auth.uid() OR is_admin()
    );

-- Users can update their own profile (except role), admins can update all
CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (
        id = auth.uid() OR is_admin()
    );

-- Only admins can insert new profiles
CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (is_admin());

-- Only admins can delete profiles
CREATE POLICY "profiles_delete_policy" ON profiles
    FOR DELETE USING (is_admin());

-- =============================================
-- CUSTOMERS TABLE POLICIES
-- =============================================

-- Operators and admins can see customers, drivers can see only delivery-related
CREATE POLICY "customers_select_policy" ON customers
    FOR SELECT USING (
        is_operator_or_admin() OR 
        (get_user_role() = 'driver' AND EXISTS (
            SELECT 1 FROM orders o 
            JOIN deliveries d ON d.order_id = o.id 
            WHERE o.customer_id = customers.id 
            AND d.assigned_to = auth.uid()
        ))
    );

-- Operators and admins can insert customers
CREATE POLICY "customers_insert_policy" ON customers
    FOR INSERT WITH CHECK (is_operator_or_admin());

-- Operators and admins can update customers
CREATE POLICY "customers_update_policy" ON customers
    FOR UPDATE USING (is_operator_or_admin());

-- Only admins can delete customers (soft delete preferred)
CREATE POLICY "customers_delete_policy" ON customers
    FOR DELETE USING (is_admin());

-- =============================================
-- INVENTORY TABLES POLICIES (ingredients, products, recipes)
-- =============================================

-- Operators and admins can see inventory
CREATE POLICY "ingredients_select_policy" ON ingredients
    FOR SELECT USING (is_operator_or_admin());

CREATE POLICY "ingredients_insert_policy" ON ingredients
    FOR INSERT WITH CHECK (is_operator_or_admin());

CREATE POLICY "ingredients_update_policy" ON ingredients
    FOR UPDATE USING (is_operator_or_admin());

CREATE POLICY "ingredients_delete_policy" ON ingredients
    FOR DELETE USING (is_admin());

-- Products policies (similar to ingredients)
CREATE POLICY "products_select_policy" ON products
    FOR SELECT USING (is_operator_or_admin());

CREATE POLICY "products_insert_policy" ON products
    FOR INSERT WITH CHECK (is_operator_or_admin());

CREATE POLICY "products_update_policy" ON products
    FOR UPDATE USING (is_operator_or_admin());

CREATE POLICY "products_delete_policy" ON products
    FOR DELETE USING (is_admin());

-- Recipes policies
CREATE POLICY "recipes_select_policy" ON recipes
    FOR SELECT USING (is_operator_or_admin());

CREATE POLICY "recipes_insert_policy" ON recipes
    FOR INSERT WITH CHECK (is_operator_or_admin());

CREATE POLICY "recipes_update_policy" ON recipes
    FOR UPDATE USING (is_operator_or_admin());

CREATE POLICY "recipes_delete_policy" ON recipes
    FOR DELETE USING (is_admin());

-- =============================================
-- ORDER SYSTEM POLICIES
-- =============================================

-- Orders: Operators and admins can see all, drivers see assigned deliveries only
CREATE POLICY "orders_select_policy" ON orders
    FOR SELECT USING (
        is_operator_or_admin() OR 
        (get_user_role() = 'driver' AND EXISTS (
            SELECT 1 FROM deliveries d 
            WHERE d.order_id = orders.id 
            AND d.assigned_to = auth.uid()
        ))
    );

CREATE POLICY "orders_insert_policy" ON orders
    FOR INSERT WITH CHECK (is_operator_or_admin());

CREATE POLICY "orders_update_policy" ON orders
    FOR UPDATE USING (
        is_operator_or_admin() OR
        (get_user_role() = 'driver' AND EXISTS (
            SELECT 1 FROM deliveries d 
            WHERE d.order_id = orders.id 
            AND d.assigned_to = auth.uid()
        ))
    );

CREATE POLICY "orders_delete_policy" ON orders
    FOR DELETE USING (is_admin());

-- Order Items: Follow same rules as orders
CREATE POLICY "order_items_select_policy" ON order_items
    FOR SELECT USING (
        is_operator_or_admin() OR 
        (get_user_role() = 'driver' AND EXISTS (
            SELECT 1 FROM orders o
            JOIN deliveries d ON d.order_id = o.id 
            WHERE o.id = order_items.order_id 
            AND d.assigned_to = auth.uid()
        ))
    );

CREATE POLICY "order_items_insert_policy" ON order_items
    FOR INSERT WITH CHECK (is_operator_or_admin());

CREATE POLICY "order_items_update_policy" ON order_items
    FOR UPDATE USING (is_operator_or_admin());

CREATE POLICY "order_items_delete_policy" ON order_items
    FOR DELETE USING (is_operator_or_admin());

-- =============================================
-- PRODUCTION SYSTEM POLICIES
-- =============================================

-- Production batches: Only operators and admins
CREATE POLICY "production_batches_select_policy" ON production_batches
    FOR SELECT USING (is_operator_or_admin());

CREATE POLICY "production_batches_insert_policy" ON production_batches
    FOR INSERT WITH CHECK (is_operator_or_admin());

CREATE POLICY "production_batches_update_policy" ON production_batches
    FOR UPDATE USING (is_operator_or_admin());

CREATE POLICY "production_batches_delete_policy" ON production_batches
    FOR DELETE USING (is_admin());

-- Production batch ingredients: Only operators and admins
CREATE POLICY "production_batch_ingredients_select_policy" ON production_batch_ingredients
    FOR SELECT USING (is_operator_or_admin());

CREATE POLICY "production_batch_ingredients_insert_policy" ON production_batch_ingredients
    FOR INSERT WITH CHECK (is_operator_or_admin());

CREATE POLICY "production_batch_ingredients_update_policy" ON production_batch_ingredients
    FOR UPDATE USING (is_operator_or_admin());

CREATE POLICY "production_batch_ingredients_delete_policy" ON production_batch_ingredients
    FOR DELETE USING (is_admin());

-- =============================================
-- DELIVERY SYSTEM POLICIES
-- =============================================

-- Deliveries: All roles can see relevant deliveries
CREATE POLICY "deliveries_select_policy" ON deliveries
    FOR SELECT USING (
        is_operator_or_admin() OR 
        (get_user_role() = 'driver' AND assigned_to = auth.uid())
    );

-- Operators and admins can create deliveries
CREATE POLICY "deliveries_insert_policy" ON deliveries
    FOR INSERT WITH CHECK (is_operator_or_admin());

-- Operators, admins, and assigned drivers can update deliveries
CREATE POLICY "deliveries_update_policy" ON deliveries
    FOR UPDATE USING (
        is_operator_or_admin() OR 
        (get_user_role() = 'driver' AND assigned_to = auth.uid())
    );

CREATE POLICY "deliveries_delete_policy" ON deliveries
    FOR DELETE USING (is_admin());

-- =============================================
-- FINANCIAL SYSTEM POLICIES
-- =============================================

-- Financial transactions: Only admins can see all, drivers can see their delivery payments
CREATE POLICY "financial_transactions_select_policy" ON financial_transactions
    FOR SELECT USING (
        is_admin() OR 
        (get_user_role() = 'driver' AND 
         reference_type = 'delivery' AND 
         EXISTS (
            SELECT 1 FROM deliveries d 
            WHERE d.id = financial_transactions.reference_id 
            AND d.assigned_to = auth.uid()
         ))
    );

-- Only admins can manage financial transactions
CREATE POLICY "financial_transactions_insert_policy" ON financial_transactions
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "financial_transactions_update_policy" ON financial_transactions
    FOR UPDATE USING (is_admin());

CREATE POLICY "financial_transactions_delete_policy" ON financial_transactions
    FOR DELETE USING (is_admin());

-- =============================================
-- SECURITY GRANTS
-- =============================================

-- Grant usage on schema to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions to authenticated users
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON FUNCTION get_user_role() IS 'Returns the role of the current authenticated user';
COMMENT ON FUNCTION is_admin() IS 'Check if current user has admin role';
COMMENT ON FUNCTION is_operator_or_admin() IS 'Check if current user is operator or admin';
COMMENT ON FUNCTION is_authenticated_user() IS 'Check if current user has any valid role';