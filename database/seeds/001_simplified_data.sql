-- Simplified Seed Data - WITHOUT user profiles dependency
-- Description: Create sample data for development and testing (no auth users required)
-- Date: 2025-01-14

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
-- VERIFICATION QUERIES
-- =============================================

-- Check data was inserted correctly
SELECT 'Customers' as table_name, COUNT(*) as count FROM customers
UNION ALL
SELECT 'Ingredients', COUNT(*) FROM ingredients
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Recipes', COUNT(*) FROM recipes;

-- Expected results:
-- Customers: 5
-- Ingredients: 10  
-- Products: 6
-- Recipes: 17 (5+5+7 for the three pizza types)