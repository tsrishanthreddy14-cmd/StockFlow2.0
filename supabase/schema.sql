-- ==============================================================================
-- STOCKFLOW 2.0 – INTELLIGENT INVENTORY ECOSYSTEM
-- Database Schema for Supabase / PostgreSQL
-- Organization: BeeEngage
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Package',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(50),
    address TEXT,
    lead_time_days INT DEFAULT 7,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    reliability_score INT DEFAULT 92,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WAREHOUSES TABLE
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    location VARCHAR(200),
    total_capacity_sqft NUMERIC(10, 2) DEFAULT 25000.00,
    total_bins INT DEFAULT 500,
    occupied_bins INT DEFAULT 320,
    utilization_rate NUMERIC(5, 2) DEFAULT 64.0,
    temperature_zone VARCHAR(50) DEFAULT 'Ambient (20°C - 24°C)',
    manager_name VARCHAR(100),
    contact_phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    barcode VARCHAR(100),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 10,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rack_location VARCHAR(50) DEFAULT 'Zone A-01-1',
    lead_time_days INT DEFAULT 7,
    status VARCHAR(30) DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('sales', 'purchase')),
    customer_or_supplier_name VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STOCK_MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER')),
    quantity INT NOT NULL,
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    reason TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY_FORECASTS TABLE
CREATE TABLE IF NOT EXISTS inventory_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    predicted_demand NUMERIC(10, 2) NOT NULL,
    lower_bound NUMERIC(10, 2),
    upper_bound NUMERIC(10, 2),
    safety_stock INT DEFAULT 0,
    reorder_point INT DEFAULT 0,
    recommended_order_qty INT DEFAULT 0,
    stockout_risk_score NUMERIC(5, 2) DEFAULT 0.00,
    is_overstocked BOOLEAN DEFAULT FALSE,
    model_mae NUMERIC(8, 3) DEFAULT 0.000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(type);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_product ON inventory_forecasts(product_id);

-- Row Level Security (RLS) - Allow public access for demonstration / API key access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_forecasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for public access categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for public access suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for public access warehouses" ON warehouses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for public access products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for public access orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for public access order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for public access stock_movements" ON stock_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for public access inventory_forecasts" ON inventory_forecasts FOR ALL USING (true) WITH CHECK (true);
