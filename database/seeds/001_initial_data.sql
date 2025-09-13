-- Seed Data 001: Initial test data for frozen food system
-- Description: Create sample data for development and testing
-- Date: 2025-01-14
-- Dependencies: All migrations must be applied first

-- =============================================
-- SAMPLE PROFILES
-- =============================================

-- Note: auth.users entries must be created through Supabase Auth
-- These profiles assume the following test users exist:
-- admin@frozenfood.com (admin role)
-- operator@frozenfood.com (operator role) 
-- driver@frozenfood.com (driver role)

-- Insert sample profiles (adjust UUIDs to match your Supabase Auth users)
INSERT INTO profiles (id, email, full_name, role, phone, is_active) VALUES
(
  '00000000-0000-0000-0000-000000000001', 
  'admin@frozenfood.com', 
  'Admin Usuario', 
  'admin', 
  '+34612345678', 
  true
),
(
  '00000000-0000-0000-0000-000000000002', 
  'operator@frozenfood.com', 
  'Operador Principal', 
  'operator', 
  '+34687654321', 
  true
),
(
  '00000000-0000-0000-0000-000000000003', 
  'driver@frozenfood.com', 
  'Repartidor José', 
  'driver', 
  '+34654321987', 
  true
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAMPLE CUSTOMERS
-- =============================================

INSERT INTO customers (name, email, phone, address, delivery_notes, is_active) VALUES
('Restaurante La Mesa', 'pedidos@lamesa.com', '+34912345678', 'Calle Mayor 123, Madrid', 'Entrada por puerta trasera, horario 9-17h', true),
('Bar El Rincón', NULL, '+34623456789', 'Plaza España 45, Madrid', 'Llamar antes de llegar', true),
('Cafetería Central', 'central@cafe.es', '+34687123456', 'Gran Vía 78, Madrid', 'Ascensor hasta 2º piso', true),
('Hotel Corona', 'compras@hotelcorona.com', '+34911234567', 'Avenida de la Paz 234, Madrid', 'Recepción 24h, preguntar por cocina', true),
('Panadería San Juan', NULL, '+34645678912', 'Calle San Juan 12, Madrid', 'Solo mañanas 7-12h', true);

-- =============================================
-- SAMPLE INGREDIENTS  
-- =============================================

INSERT INTO ingredients (name, description, unit_of_measure, current_stock, minimum_stock, unit_cost, supplier, is_active) VALUES
('Harina de trigo', 'Harina especial para masas congeladas', 'kg', 50.0, 10.0, 0.85, 'Harinas Molino S.L.', true),
('Aceite de oliva', 'Aceite virgen extra para frituras', 'L', 25.0, 5.0, 3.50, 'Aceites del Sur', true),
('Sal marina', 'Sal gruesa marina para condimentar', 'kg', 10.0, 2.0, 0.65, 'Salinas Mediterráneas', true),
('Levadura fresca', 'Levadura de panadería fresca', 'kg', 3.0, 1.0, 2.80, 'Levaduras García', true),
('Tomate triturado', 'Tomate natural triturado conserva', 'kg', 15.0, 3.0, 1.25, 'Conservas La Huerta', true),
('Queso mozzarella', 'Mozzarella rallada especial pizza', 'kg', 8.0, 2.0, 4.50, 'Lácteos Premium', true),
('Jamón cocido', 'Jamón cocido en lonchas', 'kg', 5.0, 1.5, 6.80, 'Cárnicos La Sierra', true),
('Champiñones', 'Champiñones laminados congelados', 'kg', 12.0, 3.0, 2.30, 'Vegetales del Norte', true),
('Pimiento rojo', 'Pimiento rojo en tiras congelado', 'kg', 7.0, 2.0, 2.80, 'Vegetales del Norte', true),
('Cebolla', 'Cebolla cortada congelada', 'kg', 9.0, 2.5, 1.90, 'Vegetales del Norte', true);

-- =============================================
-- SAMPLE PRODUCTS
-- =============================================

INSERT INTO products (name, format, description, current_stock, minimum_stock, unit_price, production_cost, is_active) VALUES
('Pizza Margarita', 'S', 'Pizza margarita pequeña (26cm) congelada', 15, 5, 8.50, 3.20, true),
('Pizza Margarita', 'L', 'Pizza margarita grande (32cm) congelada', 10, 3, 12.50, 4.80, true),
('Pizza Mixta', 'S', 'Pizza mixta pequeña con jamón y champiñones', 12, 4, 9.80, 4.20, true),
('Pizza Mixta', 'L', 'Pizza mixta grande con jamón y champiñones', 8, 3, 14.50, 6.50, true),
('Pizza Vegetariana', 'S', 'Pizza vegetariana pequeña', 10, 3, 9.20, 3.90, true),
('Pizza Vegetariana', 'L', 'Pizza vegetariana grande', 6, 2, 13.80, 5.80, true);

-- =============================================
-- SAMPLE RECIPES
-- =============================================

-- Pizza Margarita S recipes
INSERT INTO recipes (product_id, ingredient_id, quantity_needed, notes) VALUES
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Harina de trigo'), 0.150, 'Base de masa'),
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Tomate triturado'), 0.080, 'Salsa base'),
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Queso mozzarella'), 0.100, 'Cobertura principal'),
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Aceite de oliva'), 0.015, 'Para la masa y horneado'),
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Sal marina'), 0.005, 'Condimento');

-- Pizza Margarita L recipes  
INSERT INTO recipes (product_id, ingredient_id, quantity_needed, notes) VALUES
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'L'), 
 (SELECT id FROM ingredients WHERE name = 'Harina de trigo'), 0.220, 'Base de masa'),
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'L'), 
 (SELECT id FROM ingredients WHERE name = 'Tomate triturado'), 0.120, 'Salsa base'),
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'L'), 
 (SELECT id FROM ingredients WHERE name = 'Queso mozzarella'), 0.150, 'Cobertura principal'),
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'L'), 
 (SELECT id FROM ingredients WHERE name = 'Aceite de oliva'), 0.025, 'Para la masa y horneado'),
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'L'), 
 (SELECT id FROM ingredients WHERE name = 'Sal marina'), 0.008, 'Condimento');

-- Pizza Mixta S recipes
INSERT INTO recipes (product_id, ingredient_id, quantity_needed, notes) VALUES
((SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Harina de trigo'), 0.150, 'Base de masa'),
((SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Tomate triturado'), 0.080, 'Salsa base'),
((SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Queso mozzarella'), 0.100, 'Cobertura principal'),
((SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Jamón cocido'), 0.050, 'Ingrediente principal'),
((SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Champiñones'), 0.040, 'Ingrediente secundario'),
((SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Aceite de oliva'), 0.015, 'Para la masa y horneado'),
((SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'S'), 
 (SELECT id FROM ingredients WHERE name = 'Sal marina'), 0.005, 'Condimento');

-- =============================================
-- SAMPLE ORDERS
-- =============================================

-- Sample orders with realistic data
INSERT INTO orders (customer_id, created_by, status, order_date, preferred_delivery_date, special_instructions, payment_status, whatsapp_reference, notes) VALUES
((SELECT id FROM customers WHERE name = 'Restaurante La Mesa'), 
 (SELECT id FROM profiles WHERE email = 'operator@frozenfood.com'),
 'pending', 
 NOW() - INTERVAL '2 days',
 CURRENT_DATE + INTERVAL '1 day',
 'Entregar antes de las 10:00',
 'pending',
 'MSG_20250112_001',
 'Pedido urgente para evento especial'),

((SELECT id FROM customers WHERE name = 'Bar El Rincón'), 
 (SELECT id FROM profiles WHERE email = 'operator@frozenfood.com'),
 'ready', 
 NOW() - INTERVAL '1 day',
 CURRENT_DATE,
 NULL,
 'pending',
 'MSG_20250113_005',
 'Pedido regular semanal'),

((SELECT id FROM customers WHERE name = 'Hotel Corona'), 
 (SELECT id FROM profiles WHERE email = 'operator@frozenfood.com'),
 'delivered', 
 NOW() - INTERVAL '3 days',
 CURRENT_DATE - INTERVAL '1 day',
 'Recepción - Preguntar por Sr. García',
 'completed',
 'MSG_20250111_012',
 'Pedido completado satisfactoriamente');

-- =============================================
-- SAMPLE ORDER ITEMS
-- =============================================

-- Order items for the sample orders
INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
-- Restaurante La Mesa order
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250112_001'),
 (SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'L'), 
 5, 12.50, 62.50),
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250112_001'),
 (SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'S'), 
 3, 9.80, 29.40),

-- Bar El Rincón order  
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250113_005'),
 (SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'S'), 
 8, 8.50, 68.00),
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250113_005'),
 (SELECT id FROM products WHERE name = 'Pizza Vegetariana' AND format = 'S'), 
 2, 9.20, 18.40),

-- Hotel Corona order
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250111_012'),
 (SELECT id FROM products WHERE name = 'Pizza Mixta' AND format = 'L'), 
 10, 14.50, 145.00),
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250111_012'),
 (SELECT id FROM products WHERE name = 'Pizza Vegetariana' AND format = 'L'), 
 4, 13.80, 55.20);

-- Update order totals based on items
UPDATE orders SET total_amount = (
  SELECT SUM(line_total) FROM order_items WHERE order_items.order_id = orders.id
) WHERE id IN (
  SELECT id FROM orders WHERE whatsapp_reference IN ('MSG_20250112_001', 'MSG_20250113_005', 'MSG_20250111_012')
);

-- =============================================
-- SAMPLE DELIVERIES
-- =============================================

INSERT INTO deliveries (order_id, assigned_to, delivery_address, scheduled_date, scheduled_time_start, scheduled_time_end, status) VALUES
-- Pending delivery
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250112_001'),
 (SELECT id FROM profiles WHERE email = 'driver@frozenfood.com'),
 'Calle Mayor 123, Madrid',
 CURRENT_DATE + INTERVAL '1 day',
 '09:00',
 '10:00',
 'pending'),

-- Ready delivery
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250113_005'),
 (SELECT id FROM profiles WHERE email = 'driver@frozenfood.com'),
 'Plaza España 45, Madrid',
 CURRENT_DATE,
 '11:00',
 '12:00',
 'pending'),

-- Completed delivery
((SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250111_012'),
 (SELECT id FROM profiles WHERE email = 'driver@frozenfood.com'),
 'Avenida de la Paz 234, Madrid',
 CURRENT_DATE - INTERVAL '1 day',
 '14:00',
 '15:00',
 'delivered');

-- Update completed delivery with actual time and payment
UPDATE deliveries SET 
  actual_delivery_time = (scheduled_date + scheduled_time_start::TIME)::TIMESTAMP + INTERVAL '10 minutes',
  payment_collected = (SELECT total_amount FROM orders WHERE orders.id = deliveries.order_id),
  payment_method = 'cash'
WHERE order_id = (SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250111_012');

-- =============================================
-- SAMPLE FINANCIAL TRANSACTIONS
-- =============================================

-- Income from completed order
INSERT INTO financial_transactions (type, amount, description, category, transaction_date, reference_id, reference_type, created_by) VALUES
('income', 
 200.20, 
 'Pago pedido Hotel Corona - ORD25001',
 'Ventas',
 CURRENT_DATE - INTERVAL '1 day',
 (SELECT id FROM orders WHERE whatsapp_reference = 'MSG_20250111_012'),
 'order',
 (SELECT id FROM profiles WHERE email = 'admin@frozenfood.com'));

-- Sample expenses
INSERT INTO financial_transactions (type, amount, description, category, transaction_date, reference_id, reference_type, created_by) VALUES
('expense', 
 125.50, 
 'Compra ingredientes - Harinas Molino S.L.',
 'Materias Primas',
 CURRENT_DATE - INTERVAL '2 days',
 NULL,
 'purchase',
 (SELECT id FROM profiles WHERE email = 'admin@frozenfood.com')),
 
('expense', 
 45.80, 
 'Combustible reparto',
 'Transporte',
 CURRENT_DATE - INTERVAL '1 day',
 NULL,
 'expense',
 (SELECT id FROM profiles WHERE email = 'admin@frozenfood.com')),
 
('expense', 
 28.30, 
 'Materiales packaging',
 'Packaging',
 CURRENT_DATE,
 NULL,
 'expense',
 (SELECT id FROM profiles WHERE email = 'admin@frozenfood.com'));

-- =============================================
-- SAMPLE PRODUCTION BATCH
-- =============================================

INSERT INTO production_batches (product_id, planned_quantity, actual_quantity, production_date, status, created_by, notes) VALUES
((SELECT id FROM products WHERE name = 'Pizza Margarita' AND format = 'S'),
 20,
 18,
 CURRENT_DATE - INTERVAL '1 day',
 'completed',
 (SELECT id FROM profiles WHERE email = 'operator@frozenfood.com'),
 'Lote producido para reponer stock bajo');

-- Production batch ingredients consumption
INSERT INTO production_batch_ingredients (batch_id, ingredient_id, planned_quantity, actual_quantity) VALUES
((SELECT id FROM production_batches ORDER BY created_at DESC LIMIT 1),
 (SELECT id FROM ingredients WHERE name = 'Harina de trigo'),
 3.0, 2.9),
((SELECT id FROM production_batches ORDER BY created_at DESC LIMIT 1),
 (SELECT id FROM ingredients WHERE name = 'Tomate triturado'),
 1.6, 1.5),
((SELECT id FROM production_batches ORDER BY created_at DESC LIMIT 1),
 (SELECT id FROM ingredients WHERE name = 'Queso mozzarella'),
 2.0, 1.9);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- These are not executed but serve as examples for testing

/*
-- Verify data was inserted correctly
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers  
UNION ALL
SELECT 'Ingredients', COUNT(*) FROM ingredients
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Recipes', COUNT(*) FROM recipes
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items
UNION ALL
SELECT 'Deliveries', COUNT(*) FROM deliveries
UNION ALL
SELECT 'Financial Transactions', COUNT(*) FROM financial_transactions
UNION ALL
SELECT 'Production Batches', COUNT(*) FROM production_batches;

-- Test order with details
SELECT 
  o.order_number,
  c.name as customer_name,
  o.status,
  o.total_amount,
  COUNT(oi.id) as item_count
FROM orders o
JOIN customers c ON c.id = o.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.order_number, c.name, o.status, o.total_amount
ORDER BY o.created_at DESC;

-- Test low stock alerts  
SELECT 
  name,
  current_stock,
  minimum_stock,
  (current_stock <= minimum_stock) as low_stock_alert
FROM ingredients
WHERE current_stock <= minimum_stock;
*/