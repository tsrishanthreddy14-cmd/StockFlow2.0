import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Database,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Package,
  X
} from 'lucide-react';

export default function Topbar({
  onOpenProductModal,
  onOpenOrderModal,
  systemStatus,
  searchQuery,
  setSearchQuery,
  lowStockItems = []
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, SKUs, racks, or orders..."
            className="w-full bg-slate-850/90 text-sm text-slate-200 pl-10 pr-4 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Top Right Controls & Indicators */}
      <div className="flex items-center gap-3">
        {/* Supabase Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-850/80 border border-slate-750 text-xs text-slate-300">
          <Database className={`w-3.5 h-3.5 ${systemStatus?.database?.supabase_configured ? 'text-emerald-400' : 'text-teal-400'}`} />
          <span className="font-medium text-[11px]">
            {systemStatus?.database?.supabase_configured ? 'Supabase Active' : 'Local DB Active'}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${systemStatus?.database?.supabase_configured ? 'bg-emerald-400' : 'bg-teal-400'} animate-pulse`}></span>
        </div>

        {/* AI Engine Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px]">Scikit-Learn ML Ready</span>
        </div>

        {/* Quick Add Buttons */}
        <button
          onClick={onOpenProductModal}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-all hover:border-slate-600"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Product</span>
        </button>

        <button
          onClick={onOpenOrderModal}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-emerald-900/50 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Order</span>
        </button>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {lowStockItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center">
                {lowStockItems.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">Inventory Action Alerts</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-2 max-h-64 overflow-y-auto space-y-2">
                {lowStockItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span>All stock levels are optimal! No urgent shortages.</span>
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-slate-850 border border-amber-500/20 flex items-start gap-2.5"
                    >
                      <Package className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{item.name}</p>
                        <p className="text-[11px] text-amber-400/90 font-medium">
                          Stock: {item.stock_quantity} units (Threshold: {item.min_stock_level})
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-inner">
            SF
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-200">BeeEngage Admin</p>
            <p className="text-[10px] text-slate-400">Logistics Director</p>
          </div>
        </div>
      </div>
    </header>
  );
}
