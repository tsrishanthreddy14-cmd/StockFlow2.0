import React, { useState, useEffect } from 'react';
import { X, Boxes, Tag, Truck, Warehouse, MapPin, DollarSign, Clock } from 'lucide-react';

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product = null,
  categories = [],
  suppliers = [],
  warehouses = [],
  currencySymbol = '$'
}) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category_id: categories[0]?.id || '',
    supplier_id: suppliers[0]?.id || '',
    warehouse_id: warehouses[0]?.id || '',
    stock_quantity: 20,
    min_stock_level: 15,
    cost_price: 50.0,
    selling_price: 90.0,
    rack_location: 'Aisle 1 - Rack A01',
    lead_time_days: 7
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category_id: product.category_id || categories[0]?.id || '',
        supplier_id: product.supplier_id || suppliers[0]?.id || '',
        warehouse_id: product.warehouse_id || warehouses[0]?.id || '',
        stock_quantity: product.stock_quantity ?? 0,
        min_stock_level: product.min_stock_level ?? 10,
        cost_price: product.cost_price ?? 0.0,
        selling_price: product.selling_price ?? 0.0,
        rack_location: product.rack_location || 'Aisle 1 - Rack A01',
        lead_time_days: product.lead_time_days ?? 7
      });
    } else {
      setFormData({
        name: '',
        sku: `SF-${Math.floor(100 + Math.random() * 900)}`,
        barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
        category_id: categories[0]?.id || '',
        supplier_id: suppliers[0]?.id || '',
        warehouse_id: warehouses[0]?.id || '',
        stock_quantity: 25,
        min_stock_level: 15,
        cost_price: 45.0,
        selling_price: 85.0,
        rack_location: 'Aisle 1 - Rack A01',
        lead_time_days: 7
      });
    }
    setError(null);
  }, [product, isOpen, categories, suppliers, warehouses]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) {
      setError('Product Name and SKU are required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">
              {isEditing ? 'Edit Product Details' : 'Add New Inventory Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Servo Motor 24V"
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. SF-ROB-001"
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none uppercase font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Supplier</label>
              <select
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned Warehouse</label>
              <select
                value={formData.warehouse_id}
                onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id} className="bg-slate-900">{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Stock Qty</label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Min Alert Level</label>
              <input
                type="number"
                min="1"
                value={formData.min_stock_level}
                onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt(e.target.value) || 10 })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Cost Price ({currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Selling Price ({currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Rack Location Coordinate</label>
              <input
                type="text"
                value={formData.rack_location}
                onChange={(e) => setFormData({ ...formData, rack_location: e.target.value })}
                placeholder="e.g. Aisle 1 - Rack A04"
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Supplier Lead Time (Days)</label>
              <input
                type="number"
                min="1"
                value={formData.lead_time_days}
                onChange={(e) => setFormData({ ...formData, lead_time_days: parseInt(e.target.value) || 7 })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-lg shadow-emerald-950"
            >
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
