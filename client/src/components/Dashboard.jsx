import React from 'react';
import {
  Boxes,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Warehouse,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

export default function Dashboard({ stats, onNavigate, onOpenProductModal, onOpenOrderModal, currencySymbol = '$' }) {
  const summary = stats?.summary || {
    total_products: 10,
    total_stock_quantity: 580,
    total_orders: 6,
    low_stock_products: 4,
    out_of_stock_products: 1,
    inventory_valuation: 78500,
    retail_valuation: 132400,
    potential_gross_margin: 53900,
    total_sales_revenue: 29500
  };

  const categoryData = stats?.category_distribution || [];
  const warehouseData = stats?.warehouse_distribution || [];
  const recentOrders = stats?.recent_orders || [];
  const recentMovements = stats?.recent_movements || [];

  // Monthly demand trend sample data
  const trendData = [
    { period: 'Week 1', demand: 140, fulfilled: 135 },
    { period: 'Week 2', demand: 185, fulfilled: 180 },
    { period: 'Week 3', demand: 220, fulfilled: 210 },
    { period: 'Week 4', demand: 290, fulfilled: 275 },
    { period: 'Current', demand: 340, fulfilled: 320 },
  ];

  const kpis = [
    {
      title: 'Total Products',
      value: summary.total_products,
      subtext: 'Catalog items active',
      icon: Boxes,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Total Stock Quantity',
      value: (summary.total_stock_quantity || 0).toLocaleString(),
      subtext: 'Total physical units',
      icon: Warehouse,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Total Orders',
      value: summary.total_orders,
      subtext: 'Sales & purchase POs',
      icon: ShoppingCart,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Low Stock Alerts',
      value: summary.low_stock_products,
      subtext: `${summary.out_of_stock_products || 0} critically out of stock`,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Inventory Valuation',
      value: `${currencySymbol}${(summary.inventory_valuation || 0).toLocaleString()}`,
      subtext: 'Asset cost valuation',
      icon: DollarSign,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20'
    },
    {
      title: 'Potential Gross Margin',
      value: `${currencySymbol}${(summary.potential_gross_margin || 0).toLocaleString()}`,
      subtext: `Retail: ${currencySymbol}${(summary.retail_valuation || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick AI Insight */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Predictive Intelligence
              </span>
              <span className="text-xs text-slate-400">BeeEngage Ecosystem</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              StockFlow 2.0 Management Hub
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time multi-warehouse inventory automation, machine learning sales demand predictions, and instant reorder recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('forecasting')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run AI Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="glass-card p-4 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xl font-bold text-white tracking-tight">{kpi.value}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{kpi.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inventory Valuation by Category */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Inventory Valuation by Category</h2>
              <p className="text-xs text-slate-400">Total cost capital allocated across categories</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Live Assets
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(val) => `${currencySymbol}${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, 'Inventory Value']}
                />
                <Bar dataKey="total_value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Velocity & Demand Curve */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Stock Velocity & Order Fulfillment</h2>
              <p className="text-xs text-slate-400">Demand units vs fulfilled units</p>
            </div>
            <span className="text-xs text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
              +18.4% MoM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFulfilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="demand" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" name="Market Demand" />
                <Area type="monotone" dataKey="fulfilled" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFulfilled)" name="Fulfilled Orders" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column: Recent Orders & Recent Stock Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-200">Recent Customer & Supplier Orders</h2>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Order #</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Partner</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-mono font-medium text-slate-200">{ord.order_number}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ord.type === 'sales' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {ord.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-medium truncate max-w-[140px]">
                      {ord.customer_or_supplier_name}
                    </td>
                    <td className="py-3 font-bold text-slate-200">
                      {currencySymbol}{ord.total_amount?.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                        ord.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                        ord.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-700/50 text-slate-300'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Inventory Movements Audit Log */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-bold text-slate-200">Inventory Activity Log</h2>
            </div>
            <span className="text-[11px] text-slate-400">Live movements</span>
          </div>

          <div className="space-y-3">
            {recentMovements.map((m) => {
              const isPositive = m.type === 'IN' || (m.type === 'ADJUSTMENT' && m.quantity > 0);
              return (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      m.type === 'IN' ? 'bg-emerald-500/20 text-emerald-400' :
                      m.type === 'OUT' ? 'bg-rose-500/20 text-rose-400' :
                      m.type === 'TRANSFER' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {m.type === 'IN' ? <ArrowDownRight className="w-3.5 h-3.5" /> :
                       m.type === 'OUT' ? <ArrowUpRight className="w-3.5 h-3.5" /> :
                       <TrendingUp className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{m.product_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{m.reason || `${m.from_location} → ${m.to_location}`}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold ${
                      isPositive ? 'text-emerald-400' : m.type === 'OUT' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity} units
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{m.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
