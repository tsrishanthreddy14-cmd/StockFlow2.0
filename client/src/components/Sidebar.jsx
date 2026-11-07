import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Truck,
  Sparkles,
  Warehouse as WarehouseIcon,
  BarChart3,
  Settings as SettingsIcon,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, stats, forecastSummary }) {
  const lowStockCount = stats?.summary?.low_stock_products || 0;
  const reordersNeeded = forecastSummary?.reorders_recommended || 0;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} alert` : null, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'forecasting', label: 'AI Forecasting', icon: Sparkles, badge: reordersNeeded > 0 ? `${reordersNeeded} action` : 'ML Active', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'warehouse', label: 'Warehouse', icon: WarehouseIcon },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30 backdrop-blur-md">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">StockFlow</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-500/30">2.0</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">Intelligent Inventory Ecosystem</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity ${isActive ? 'opacity-80 text-emerald-400' : ''}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Organization Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-xl p-3 bg-slate-850/80 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 truncate">BeeEngage</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">Enterprise Connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
