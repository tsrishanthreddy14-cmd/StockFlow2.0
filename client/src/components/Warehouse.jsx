import React, { useState } from 'react';
import {
  Warehouse as WarehouseIcon,
  MapPin,
  ArrowRightLeft,
  Gauge,
  Thermometer,
  Layers,
  CheckCircle,
  Plus,
  Box,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function Warehouse({
  warehouses = [],
  products = [],
  onOpenTransferModal,
  currencySymbol = '$'
}) {
  const [activeWarehouseId, setActiveWarehouseId] = useState(warehouses[0]?.id || 'w1000000-0000-0000-0000-000000000001');

  const currentWarehouse = warehouses.find(w => w.id === activeWarehouseId) || warehouses[0] || {};
  const currentWarehouseProducts = products.filter(p => p.warehouse_id === currentWarehouse.id || p.warehouse_name === currentWarehouse.name);

  // Generate a representative 2D rack grid representation (Aisles A, B, C, D)
  const aisles = [
    { name: 'Aisle 1 (Robotics & High Velocity)', code: 'A', racks: ['A01', 'A02', 'A03', 'A04', 'A08', 'A11'] },
    { name: 'Aisle 2 (Mechanical & Ball Screws)', code: 'B', racks: ['B01', 'B02', 'B05', 'B08', 'B12'] },
    { name: 'Aisle 3 (Hydraulics & Heavy Fluid)', code: 'C', racks: ['C01', 'C02', 'C05', 'C08', 'C10'] },
    { name: 'Aisle 4 (Power & Battery Storage)', code: 'D', racks: ['D01', 'D02', 'D05', 'D09'] }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <WarehouseIcon className="w-5 h-5 text-emerald-400" />
            Warehouse Management & Space Optimization
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time visual rack mapping, bin utilization metrics, and inter-facility stock transfers
          </p>
        </div>

        <button
          onClick={onOpenTransferModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all shrink-0 cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Inter-Facility Stock Transfer</span>
        </button>
      </div>

      {/* Warehouse Facility Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouses.map((wh) => {
          const isSelected = wh.id === activeWarehouseId;
          return (
            <div
              key={wh.id}
              onClick={() => setActiveWarehouseId(wh.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-slate-850 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {wh.code}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-1.5">{wh.name}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{wh.location}</span>
                  </p>
                </div>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </div>

              {/* Utilization progress bar */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 font-medium">Bin Capacity Utilization</span>
                  <span className="font-bold text-slate-200">{wh.utilization_rate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      wh.utilization_rate > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, wh.utilization_rate)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{wh.occupied_bins} of {wh.total_bins} bins occupied</span>
                  <span>{wh.total_capacity_sqft?.toLocaleString()} sq ft</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Warehouse Operational Status */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{currentWarehouse.name} ({currentWarehouse.code})</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active Operations
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Facility Manager: <span className="text-slate-200 font-semibold">{currentWarehouse.manager_name}</span> • Phone: <span className="text-slate-200">{currentWarehouse.contact_phone}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-2 text-xs">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 font-medium">{currentWarehouse.temperature_zone || 'Ambient (21°C)'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-2 text-xs">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">{currentWarehouse.utilization_rate}% Space Efficiency</span>
            </div>
          </div>
        </div>

        {/* 2D Aisle & Rack Visualization Matrix */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Interactive 2D Aisle & Rack Bin Matrix
            </h3>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/60 inline-block"></span>
                Occupied & Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/60 inline-block"></span>
                Low Stock Rack
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block"></span>
                Available Bin
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aisles.map((aisle) => (
              <div key={aisle.code} className="p-4 rounded-xl bg-slate-850/60 border border-slate-800">
                <div className="text-xs font-bold text-slate-200 pb-2 border-b border-slate-800 mb-3 truncate">
                  {aisle.name}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {aisle.racks.map((rackCode) => {
                    const assignedProd = currentWarehouseProducts.find(
                      p => p.rack_location?.includes(rackCode)
                    );
                    const isOccupied = !!assignedProd;
                    const isLow = assignedProd && assignedProd.stock_quantity <= assignedProd.min_stock_level;

                    return (
                      <div
                        key={rackCode}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isLow
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                            : isOccupied
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                          <span>Rack {rackCode}</span>
                          {isOccupied && <Box className="w-3 h-3 text-emerald-400" />}
                        </div>
                        {isOccupied ? (
                          <div className="mt-1">
                            <p className="text-[10px] font-semibold truncate text-slate-200">{assignedProd.name}</p>
                            <p className="text-[9px] font-bold mt-0.5 text-emerald-400">
                              {assignedProd.stock_quantity} units
                            </p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 mt-1 italic">Empty Slot</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Products at this Warehouse */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Inventory Stored at {currentWarehouse.name} ({currentWarehouseProducts.length} items)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Rack Coordinate</th>
                  <th className="py-2.5 px-3">Units Stored</th>
                  <th className="py-2.5 px-3">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentWarehouseProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No products currently mapped to this warehouse. Use the Transfer tool to rebalance inventory here.
                    </td>
                  </tr>
                ) : (
                  currentWarehouseProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{p.name}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 text-[11px]">{p.sku}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{p.rack_location || 'Zone A-01-1'}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{p.stock_quantity}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.status === 'in_stock' ? 'bg-emerald-500/20 text-emerald-400' :
                          p.status === 'low_stock' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
