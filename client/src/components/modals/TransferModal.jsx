import React, { useState } from 'react';
import { X, ArrowRightLeft, Warehouse, Boxes, MapPin } from 'lucide-react';

export default function TransferModal({
  isOpen,
  onClose,
  onTransfer,
  products = [],
  warehouses = []
}) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [fromWarehouseId, setFromWarehouseId] = useState(warehouses[0]?.id || '');
  const [toWarehouseId, setToWarehouseId] = useState(warehouses[1]?.id || warehouses[0]?.id || '');
  const [quantity, setQuantity] = useState(10);
  const [toRack, setToRack] = useState('Aisle 2 - Rack B04');
  const [reason, setReason] = useState('Stock balancing between regional fulfillment hubs');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromWarehouseId === toWarehouseId) {
      setError('Source and Destination warehouses must be different.');
      return;
    }
    const qty = parseInt(quantity) || 0;
    if (qty <= 0) {
      setError('Transfer quantity must be at least 1 unit.');
      return;
    }
    if (currentProduct && currentProduct.stock_quantity < qty) {
      setError(`Cannot transfer ${qty} units. Current stock is ${currentProduct.stock_quantity}.`);
      return;
    }

    onTransfer({
      product_id: selectedProductId,
      from_warehouse_id: fromWarehouseId,
      to_warehouse_id: toWarehouseId,
      quantity: qty,
      to_rack_location: toRack,
      reason
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Inter-Facility Stock Transfer</h3>
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
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Select Product to Move</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const p = products.find(x => x.id === e.target.value);
                if (p && p.warehouse_id) setFromWarehouseId(p.warehouse_id);
              }}
              className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.name} ({p.sku}) — {p.stock_quantity} units available
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Source Facility</label>
              <select
                value={fromWarehouseId}
                onChange={(e) => setFromWarehouseId(e.target.value)}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id} className="bg-slate-900">{w.name} ({w.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Destination Facility</label>
              <select
                value={toWarehouseId}
                onChange={(e) => setToWarehouseId(e.target.value)}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id} className="bg-slate-900">{w.name} ({w.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Transfer Quantity</label>
              <input
                type="number"
                min="1"
                max={currentProduct?.stock_quantity || 100}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Rack Location</label>
              <input
                type="text"
                value={toRack}
                onChange={(e) => setToRack(e.target.value)}
                placeholder="e.g. Aisle 3 - Rack C04"
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Transfer Reason / Audit Note</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Regional stock rebalance for upcoming production run"
              className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
              Authorize Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
