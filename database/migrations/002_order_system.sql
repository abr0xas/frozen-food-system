-- Migration 002: Order Management System
-- Description: Create tables for order processing and management
-- Date: 2025-01-14
-- Depends on: 001_core_tables.sql

-- =============================================
-- ORDER SYSTEM TABLES
-- =============================================

-- Orders (main order entity)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status order_status NOT NULL DEFAULT 'pending',
    order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    preferred_delivery_date DATE,
    special_instructions TEXT,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    whatsapp_reference TEXT, -- Reference to original WhatsApp conversation
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Order Items (individual products in each order)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    line_total DECIMAL(10,2) NOT NULL CHECK (line_total >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================
-- PRODUCTION SYSTEM TABLES
-- =============================================

-- Production Batches
CREATE TABLE production_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL UNIQUE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    planned_quantity INTEGER NOT NULL CHECK (planned_quantity > 0),
    actual_quantity INTEGER CHECK (actual_quantity >= 0),
    production_date DATE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Production Batch Ingredients (actual ingredient consumption)
CREATE TABLE production_batch_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES production_batches(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    planned_quantity DECIMAL(10,3) NOT NULL CHECK (planned_quantity > 0),
    actual_quantity DECIMAL(10,3) CHECK (actual_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(batch_id, ingredient_id)
);

-- =============================================
-- DELIVERY SYSTEM TABLES
-- =============================================

-- Deliveries
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    delivery_address TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time_start TIME,
    scheduled_time_end TIME,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    status delivery_status NOT NULL DEFAULT 'pending',
    delivery_notes TEXT,
    payment_collected DECIMAL(10,2) DEFAULT 0,
    payment_method TEXT CHECK (payment_method IN ('cash', 'transfer', 'card', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(order_id) -- One delivery per order
);

-- =============================================
-- FINANCIAL SYSTEM TABLES
-- =============================================

-- Financial Transactions
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number TEXT NOT NULL UNIQUE,
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    reference_id UUID, -- Can reference orders, deliveries, etc.
    reference_type TEXT CHECK (reference_type IN ('order', 'delivery', 'purchase', 'expense', 'other')),
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Orders
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Production Batches
CREATE INDEX idx_production_batches_product_id ON production_batches(product_id);
CREATE INDEX idx_production_batches_production_date ON production_batches(production_date);
CREATE INDEX idx_production_batches_status ON production_batches(status);
CREATE INDEX idx_production_batches_created_by ON production_batches(created_by);

-- Production Batch Ingredients
CREATE INDEX idx_prod_batch_ingr_batch_id ON production_batch_ingredients(batch_id);
CREATE INDEX idx_prod_batch_ingr_ingredient_id ON production_batch_ingredients(ingredient_id);

-- Deliveries
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_assigned_to ON deliveries(assigned_to);
CREATE INDEX idx_deliveries_scheduled_date ON deliveries(scheduled_date);
CREATE INDEX idx_deliveries_status ON deliveries(status);

-- Financial Transactions
CREATE INDEX idx_financial_trans_type ON financial_transactions(type);
CREATE INDEX idx_financial_trans_date ON financial_transactions(transaction_date);
CREATE INDEX idx_financial_trans_category ON financial_transactions(category);
CREATE INDEX idx_financial_trans_reference ON financial_transactions(reference_id, reference_type);
CREATE INDEX idx_financial_trans_created_by ON financial_transactions(created_by);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_batches_updated_at BEFORE UPDATE ON production_batches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_batch_ingredients_updated_at BEFORE UPDATE ON production_batch_ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- BUSINESS LOGIC FUNCTIONS
-- =============================================

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    sequence_num INTEGER;
BEGIN
    -- Get current year suffix (last 2 digits)
    year_suffix := EXTRACT(YEAR FROM NOW())::TEXT;
    year_suffix := RIGHT(year_suffix, 2);
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(order_number FROM 4) AS INTEGER)
    ), 0) + 1 
    INTO sequence_num
    FROM orders 
    WHERE order_number LIKE 'ORD' || year_suffix || '%';
    
    -- Return formatted order number: ORD25001, ORD25002, etc.
    RETURN 'ORD' || year_suffix || LPAD(sequence_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to calculate order total from items
CREATE OR REPLACE FUNCTION calculate_order_total(order_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(line_total), 0)
    INTO total
    FROM order_items
    WHERE order_id = order_uuid;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE orders IS 'Customer orders with status tracking and payment information';
COMMENT ON TABLE order_items IS 'Individual product items within each order';
COMMENT ON TABLE production_batches IS 'Production runs for manufacturing products';
COMMENT ON TABLE production_batch_ingredients IS 'Actual ingredient consumption per production batch';
COMMENT ON TABLE deliveries IS 'Delivery scheduling and tracking for orders';
COMMENT ON TABLE financial_transactions IS 'All financial movements (income and expenses)';

COMMENT ON COLUMN orders.whatsapp_reference IS 'Reference to original WhatsApp conversation or message';
COMMENT ON COLUMN deliveries.payment_collected IS 'Amount collected during delivery';
COMMENT ON COLUMN financial_transactions.reference_id IS 'UUID reference to related entity (order, delivery, etc.)';