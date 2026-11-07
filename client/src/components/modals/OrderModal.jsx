import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Trash2, Package, User, DollarSign } from 'lucide-react';

export default function OrderModal({
  isOpen,
  onClose,
  onSave,
  products = [],
  prefillItem = null,
  currencySymbol = '$'
}) {
  const [orderType, setOrderType] = useState('sales');
  const [partnerName, setPartnerName] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prefillItem) {
      setOrderType('purchase');
      setPartnerName('Preferred Fast Supplier');
      setNotes(`Automated replenishment PO based on AI reorder recommendation`);
      setItems([
        {
          product_id: prefillItem.product_id || prefillItem.id,
          quantity: prefillItem.recommended_order_qty || 25,
          unit_price: prefillItem.cost_price || 50.0
        }
      ]);
    } else {
      setOrderType('sales');
      setPartnerName('');
      setNotes('');
      if (products.length > 0) {
        setItems([
          {
            product_id: products[0].id,
            quantity: 5,
            unit_price: products[0].selling_price || 100.0
          }
        ]);
      }
    }
    setError(null);
  }, [prefillItem, isOpen, products]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (products.length === 0) return;
    const prod = products[0];
    setItems([
      ...items,
      {
        product_id: prod.id,
        quantity: 1,
        unit_price: orderType === 'sales' ? prod.selling_price : prod.cost_price
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'product_id') {
      const prod = products.find(p => p.id === value);
      if (prod) {
        updated[index].unit_price = orderType === 'sales' ? prod.selling_price : prod.cost_price;
      }
    }
    setItems(updated);
  };

  const calculatedTotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    return sum + (qty * price);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!partnerName.trim()) {
      setError('Please provide a customer or supplier company name.');
      return;
    }
    if (items.length === 0) {
      setError('An order must have at least one product item.');
      return;
    }

    // Validate quantities
    for (const itm of items) {
      const prod = products.find(p => p.id === itm.product_id);
      if (!prod) continue;
      const qty = parseInt(itm.quantity) || 0;
      if (qty <= 0) {
        setError(`Quantity for ${prod.name} must be greater than zero.`);
        return;
      }
      if (orderType === 'sales' && prod.stock_quantity < qty) {
        setError(`Insufficient inventory for ${prod.name}. Stored: ${prod.stock_quantity}, requested: ${qty}.`);
        return;
      }
    }

    onSave({
      type: orderType,
      customer_or_supplier_name: partnerName.trim(),
      notes: notes.trim(),
      items: items.map(itm => ({
        product_id: itm.product_id,
        quantity: parseInt(itm.quantity) || 1,
        unit_price: parseFloat(itm.unit_price) || 0
      }))
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Create New Order</h3>
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
          {/* Order Type Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setOrderType('sales');
                // adjust prices
                setItems(items.map(itm => {
                  const p = products.find(x => x.id === itm.product_id);
                  return { ...itm, unit_price: p ? p.selling_price : itm.unit_price };
                }));
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                orderType === 'sales'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-850 text-slate-400 border-slate-750 hover:bg-slate-800'
              }`}
            >
              Sales Order (Customer Outbound)
            </button>

            <button
              type="button"
              onClick={() => {
                setOrderType('purchase');
                // adjust prices
                setItems(items.map(itm => {
                  const p = products.find(x => x.id === itm.product_id);
                  return { ...itm, unit_price: p ? p.cost_price : itm.unit_price };
                }));
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                orderType === 'purchase'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                  : 'bg-slate-850 text-slate-400 border-slate-750 hover:bg-slate-800'
              }`}
            >
              Purchase Order (Supplier Restock)
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {orderType === 'sales' ? 'Customer Account Name *' : 'Supplier / Vendor Name *'}
            </label>
            <input
              type="text"
              required
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder={orderType === 'sales' ? 'e.g. Tesla Gigafactory or Siemens AG' : 'e.g. Apex Dynamics Robotics'}
              className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Line items */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Line Items
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, index) => {
                const prod = products.find(p => p.id === item.product_id);
                const sub = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);

                return (
                  <div key={index} className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center gap-3">
                    <div className="flex-1 min-w-[180px]">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                        className="w-full bg-slate-900 text-xs text-slate-200 px-2 py-1.5 rounded border border-slate-700 focus:outline-none"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku}) - {p.stock_quantity} in stock
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        placeholder="Qty"
                        className="w-full bg-slate-900 text-xs text-slate-200 px-2 py-1.5 rounded border border-slate-700 focus:outline-none text-center"
                      />
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                        placeholder="Price"
                        className="w-full bg-slate-900 text-xs text-slate-200 px-2 py-1.5 rounded border border-slate-700 focus:outline-none text-right"
                      />
                    </div>

                    <div className="w-24 text-right font-bold text-xs text-slate-200 shrink-0">
                      {currencySymbol}{sub.toFixed(2)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Fulfillment Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Priority dispatch, dock receipt 4"
              className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Total Order Amount</span>
              <div className="text-lg font-black text-emerald-400">
                {currencySymbol}{calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex items-center gap-2">
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
                Confirm & Submit Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
