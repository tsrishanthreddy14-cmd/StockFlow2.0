-- ==============================================================================
-- STOCKFLOW 2.0 – INTELLIGENT INVENTORY ECOSYSTEM
-- Enterprise Demo Seed Data for Supabase
-- Organization: BeeEngage
-- ==============================================================================

-- Clear existing data cleanly
TRUNCATE TABLE inventory_forecasts, stock_movements, order_items, orders, products, warehouses, suppliers, categories CASCADE;

-- Insert Categories
INSERT INTO categories (id, name, description, icon) VALUES
('c1000000-0000-0000-0000-000000000001', 'Robotics & Automation', 'Servos, controllers, sensors and automated actuators', 'Cpu'),
('c1000000-0000-0000-0000-000000000002', 'Power & Energy Storage', 'Industrial Li-ion battery packs, inverters, power supplies', 'BatteryCharging'),
('c1000000-0000-0000-0000-000000000003', 'Mechanical & Bearings', 'High-load bearings, gears, shaft couplings, linear guides', 'Cog'),
('c1000000-0000-0000-0000-000000000004', 'Hydraulics & Fluid Power', 'Pneumatic cylinders, hydraulic valves, pressure regulators', 'Gauge'),
('c1000000-0000-0000-0000-000000000005', 'Industrial Networking', 'Optical transceivers, managed Ethernet switches, fiber cables', 'Network');

-- Insert Suppliers
INSERT INTO suppliers (id, name, contact_name, email, phone, address, lead_time_days, rating, reliability_score, status) VALUES
('s1000000-0000-0000-0000-000000000001', 'Apex Dynamics Robotics', 'Marcus Vance', 'orders@apexdynamics.io', '+1 (512) 555-0192', '104 Innovation Way, Austin, TX 78701', 7, 4.90, 96, 'active'),
('s1000000-0000-0000-0000-000000000002', 'Volta Power Systems', 'Elena Rostova', 'supply@voltapower.com', '+1 (415) 555-0283', '880 CleanTech Parkway, Fremont, CA 94538', 12, 4.75, 91, 'active'),
('s1000000-0000-0000-0000-000000000003', 'Precision Bearing Werke', 'Klaus Weber', 'klaus@precisionwerke.de', '+49 711 555 4920', 'Industriestrasse 42, Stuttgart, Germany', 10, 4.85, 94, 'active'),
('s1000000-0000-0000-0000-000000000004', 'Titan Hydraulic Global', 'Kenji Sato', 'sales@titan-hydraulics.jp', '+81 6 6555 8301', '3-12 Nakanoshima, Kita-ku, Osaka, Japan', 14, 4.60, 88, 'active'),
('s1000000-0000-0000-0000-000000000005', 'OptiLink Telecommunications', 'Chloe Zhang', 'sales@optilink-global.tw', '+886 2 2555 7710', 'Science Park Rd, Hsinchu, Taiwan', 5, 4.95, 98, 'active');

-- Insert Warehouses
INSERT INTO warehouses (id, name, code, location, total_capacity_sqft, total_bins, occupied_bins, utilization_rate, temperature_zone, manager_name, contact_phone) VALUES
('w1000000-0000-0000-0000-000000000001', 'Midwest Regional Distribution Hub', 'WH-MIDWEST-01', '742 Logistics Blvd, Chicago, IL 60607', 48000.00, 850, 620, 72.94, 'Ambient (21°C)', 'Sarah Jenkins', '+1 (312) 555-8841'),
('w1000000-0000-0000-0000-000000000002', 'Rotterdam Port Gateway Facility', 'WH-EU-02', 'Havennummer 4022, Rotterdam, Netherlands', 62000.00, 1100, 740, 67.27, 'Climate Controlled (18°C)', 'Dirk Van Dijk', '+31 10 555 9302'),
('w1000000-0000-0000-0000-000000000003', 'Pacific Gateway Fulfillment Center', 'WH-PACIFIC-03', '15 Jurong Port Rd, Singapore 619111', 36000.00, 600, 510, 85.00, 'Humidity Regulated (22°C / 50% RH)', 'Mei-Ling Tan', '+65 6555 4910');

-- Insert Products
INSERT INTO products (id, name, sku, barcode, category_id, supplier_id, warehouse_id, stock_quantity, min_stock_level, cost_price, selling_price, rack_location, lead_time_days, status) VALUES
('p1000000-0000-0000-0000-000000000001', 'Precision Servo Motor 24V 400W', 'SF-ROB-SRV-24V', '890123400101', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', 'w1000000-0000-0000-0000-000000000001', 94, 30, 145.00, 240.00, 'Aisle 1 - Rack A04', 7, 'in_stock'),
('p1000000-0000-0000-0000-000000000002', 'UltraShield Ceramic Roller Bearing 6205', 'SF-MEC-BRG-6205', '890123400102', 'c1000000-0000-0000-0000-000000000003', 's1000000-0000-0000-0000-000000000003', 'w1000000-0000-0000-0000-000000000001', 18, 25, 42.50, 79.99, 'Aisle 2 - Rack B12', 10, 'low_stock'),
('p1000000-0000-0000-0000-000000000003', 'Lithium Iron Phosphate Battery 48V 50Ah', 'SF-PWR-LFP-48V', '890123400103', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000002', 'w1000000-0000-0000-0000-000000000001', 8, 15, 420.00, 680.00, 'Aisle 4 - Rack D01', 12, 'low_stock'),
('p1000000-0000-0000-0000-000000000004', 'High-Speed Optical Transceiver 100G QSFP28', 'SF-NET-OPT-100G', '890123400104', 'c1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000005', 'w1000000-0000-0000-0000-000000000003', 6, 20, 85.00, 155.00, 'Aisle 1 - Rack A01', 5, 'low_stock'),
('p1000000-0000-0000-0000-000000000005', 'Pneumatic Double-Acting Cylinder 50mm Bore', 'SF-HYD-CYL-50', '890123400105', 'c1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000004', 'w1000000-0000-0000-0000-000000000002', 310, 40, 68.00, 115.00, 'Aisle 3 - Rack C08', 14, 'in_stock'),
('p1000000-0000-0000-0000-000000000006', 'Industrial Multi-Axis Motion Controller', 'SF-ROB-CTL-MAX', '890123400106', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', 'w1000000-0000-0000-0000-000000000001', 42, 15, 310.00, 520.00, 'Aisle 1 - Rack A08', 7, 'in_stock'),
('p1000000-0000-0000-0000-000000000007', 'Pure Sine Wave Inverter 3000W 24V-230V', 'SF-PWR-INV-3KW', '890123400107', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000002', 'w1000000-0000-0000-0000-000000000002', 65, 20, 260.00, 440.00, 'Aisle 4 - Rack D05', 12, 'in_stock'),
('p1000000-0000-0000-0000-000000000008', 'Precision Ground Ball Screw Assembly 25mm', 'SF-MEC-BLS-25', '890123400108', 'c1000000-0000-0000-0000-000000000003', 's1000000-0000-0000-0000-000000000003', 'w1000000-0000-0000-0000-000000000001', 0, 10, 185.00, 310.00, 'Aisle 2 - Rack B02', 10, 'out_of_stock'),
('p1000000-0000-0000-0000-000000000009', 'Digital Hydraulic Pressure Proportional Valve', 'SF-HYD-VLV-DIG', '890123400109', 'c1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000004', 'w1000000-0000-0000-0000-000000000002', 55, 20, 195.00, 330.00, 'Aisle 3 - Rack C02', 14, 'in_stock'),
('p1000000-0000-0000-0000-000000000010', 'Layer 3 Ruggedized Industrial Switch 24-Port', 'SF-NET-SWT-24P', '890123400110', 'c1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000005', 'w1000000-0000-0000-0000-000000000003', 28, 12, 380.00, 620.00, 'Aisle 1 - Rack A11', 5, 'in_stock');

-- Insert Orders
INSERT INTO orders (id, order_number, type, customer_or_supplier_name, status, total_amount, notes, order_date) VALUES
('o1000000-0000-0000-0000-000000000001', 'ORD-2026-8801', 'sales', 'Tesla Gigafactory Texas', 'delivered', 14400.00, 'Urgent delivery for assembly cell 4', NOW() - INTERVAL '4 days'),
('o1000000-0000-0000-0000-000000000002', 'ORD-2026-8802', 'sales', 'Siemens Energy AG', 'shipped', 6800.00, 'Priority air freight dispatch', NOW() - INTERVAL '2 days'),
('o1000000-0000-0000-0000-000000000003', 'ORD-2026-8803', 'sales', 'ABB Robotics Operations', 'processing', 5200.00, 'Scheduled for dispatch tomorrow', NOW() - INTERVAL '1 day'),
('o1000000-0000-0000-0000-000000000004', 'ORD-2026-8804', 'sales', 'KUKA Automation Systems', 'pending', 3100.00, 'Awaiting customer PO confirmation', NOW()),
('o1000000-0000-0000-0000-000000000005', 'PO-2026-1044', 'purchase', 'Apex Dynamics Robotics', 'delivered', 14500.00, 'Restocking 100 units servo motors', NOW() - INTERVAL '10 days'),
('o1000000-0000-0000-0000-000000000006', 'PO-2026-1045', 'purchase', 'Precision Bearing Werke', 'processing', 8500.00, 'Replenishment for low stock bearings', NOW() - INTERVAL '3 days');

-- Insert Order Items
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal) VALUES
('i1000000-0000-0000-0000-000000000001', 'o1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 60, 240.00, 14400.00),
('i1000000-0000-0000-0000-000000000002', 'o1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000003', 10, 680.00, 6800.00),
('i1000000-0000-0000-0000-000000000003', 'o1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000006', 10, 520.00, 5200.00),
('i1000000-0000-0000-0000-000000000004', 'o1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000008', 10, 310.00, 3100.00);

-- Insert Stock Movements
INSERT INTO stock_movements (id, product_id, type, quantity, from_location, to_location, reason, reference_id, created_at) VALUES
('m1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'IN', 100, 'Supplier Dock', 'Aisle 1 - Rack A04', 'PO Inbound Receiving', 'PO-2026-1044', NOW() - INTERVAL '10 days'),
('m1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'OUT', 60, 'Aisle 1 - Rack A04', 'Outbound Shipping Dock', 'Sales Order Fulfillment', 'ORD-2026-8801', NOW() - INTERVAL '4 days'),
('m1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000003', 'OUT', 10, 'Aisle 4 - Rack D01', 'Outbound Shipping Dock', 'Sales Order Fulfillment', 'ORD-2026-8802', NOW() - INTERVAL '2 days'),
('m1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000002', 'ADJUSTMENT', -5, 'Aisle 2 - Rack B12', 'Damaged Quarantine', 'Routine QA Inspection Damage', 'ADJ-8812', NOW() - INTERVAL '1 day'),
('m1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000005', 'TRANSFER', 50, 'WH-MIDWEST-01', 'WH-EU-02', 'Inter-facility balancing transfer', 'TRF-0912', NOW() - INTERVAL '6 hours');
