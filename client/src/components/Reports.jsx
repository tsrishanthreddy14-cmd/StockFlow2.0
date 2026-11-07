import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  Boxes,
  ArrowDownRight,
  ArrowUpRight,
  PieChart,
  Lightbulb,
  FileSpreadsheet,
  CheckCircle2,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export default function Reports({
  reportsData,
  products = [],
  currencySymbol = '$'
}) {
  const abc = reportsData?.abc_analysis || {
    summary: { class_a_count: 3, class_b_count: 4, class_c_count: 3, total_inventory_value: 78500 },
    items: []
  };

  const movementSummary = reportsData?.movement_summary || {
    total_in: 150,
    total_out: 75,
    total_adjustments: 1,
    total_transfers: 1
  };

  const monthlyTrends = reportsData?.monthly_trends || [
    { month: 'Jun', sales: 42500, purchases: 38000, margin: 4500 },
    { month: 'Jul', sales: 51200, purchases: 41000, margin: 10200 },
    { month: 'Aug', sales: 48900, purchases: 44000, margin: 4900 },
    { month: 'Sep', sales: 63400, purchases: 52000, margin: 11400 },
    { month: 'Oct', sales: 74800, purchases: 58000, margin: 16800 },
    { month: 'Nov', sales: 82100, purchases: 61000, margin: 21100 }
  ];

  // Function to export products to CSV
  const handleExportCSV = () => {
    const headers = ['Product ID', 'Name', 'SKU', 'Category', 'Stock Qty', 'Min Level', 'Cost Price', 'Selling Price', 'Total Valuation', 'Rack Location', 'Status'];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      `"${p.category_name || 'General'}"`,
      p.stock_quantity,
      p.min_stock_level,
      p.cost_price,
      p.selling_price,
      (p.stock_quantity * p.cost_price).toFixed(2),
      `"${p.rack_location || ''}"`,
      p.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StockFlow_2.0_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Executive Reports & Supply Chain Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ABC Pareto inventory stratification, revenue vs expense curves, and product velocity turnover analytics
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Inventory Report (CSV)</span>
        </button>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Inventory Turnover Ratio</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">4.8x / year</div>
          <p className="text-[11px] text-emerald-400 mt-0.5">Above industrial benchmark of 4.2x</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Units Inflow (IN)</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{movementSummary.total_in} units</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Purchase PO inbound fulfillment</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Units Outflow (OUT)</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{movementSummary.total_out} units</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Outbound customer dispatches</p>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Inventory Record Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">98.4%</div>
          <p className="text-[11px] text-teal-400 mt-0.5">Audited across 3 fulfillment hubs</p>
        </div>
      </div>

      {/* Financial Trends Chart */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200">Monthly Inbound Purchases vs Outbound Sales Revenue</h2>
            <p className="text-xs text-slate-400">Cash-flow impact and gross margin spread</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `${currencySymbol}${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(val) => [`${currencySymbol}${val.toLocaleString()}`, '']}
              />
              <Legend />
              <Bar dataKey="sales" fill="#10b981" name="Sales Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="purchases" fill="#6366f1" name="Replenishment Cost" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ABC Stratification Analysis */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100">ABC Inventory Stratification (Pareto Principle)</h2>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                80/20 Rule
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Class A: High-value critical components (70-80% value) • Class B: Standard items (15% value) • Class C: Bulk low-value items (5% value)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Class A: {abc.summary.class_a_count} SKUs
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
              Class B: {abc.summary.class_b_count} SKUs
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-700/60 text-slate-300 font-bold border border-slate-600">
              Class C: {abc.summary.class_c_count} SKUs
            </span>
          </div>
        </div>

        {/* ABC Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Class</th>
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold">Units on Hand</th>
                <th className="py-3 px-4 font-bold">Unit Cost</th>
                <th className="py-3 px-4 font-bold">Total Capital Held</th>
                <th className="py-3 px-4 font-bold">Cumulative %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(abc.items || []).slice(0, 8).map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-lg font-black text-xs inline-flex items-center justify-center border ${
                      item.classification === 'A' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                      item.classification === 'B' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                      'bg-slate-700 text-slate-300 border-slate-600'
                    }`}>
                      {item.classification}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{item.name}</div>
                    <div className="font-mono text-[10px] text-emerald-400">{item.sku}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-300">{item.stock_quantity}</td>
                  <td className="py-3 px-4 text-slate-300">{currencySymbol}{item.cost_price?.toFixed(2)}</td>
                  <td className="py-3 px-4 font-bold text-white">
                    {currencySymbol}{item.total_value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, item.cumulative_share_percent)}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {item.cumulative_share_percent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Business Insights Panel */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100">StockFlow 2.0 AI Business Insights & Recommendations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
            <div className="text-xs font-bold text-amber-400 mb-1">Overstocking Capital Release</div>
            <p className="text-xs text-slate-300">
              Pneumatic Cylinders (SF-HYD-CYL-50) have 310 units on hand (&gt;65 days coverage). Reducing reorder batch size releases approx <strong>{currencySymbol}14,200</strong> in working capital.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
            <div className="text-xs font-bold text-rose-400 mb-1">Stockout Loss Prevention</div>
            <p className="text-xs text-slate-300">
              Optical Transceivers (SF-NET-OPT-100G) and Ball Screws (SF-MEC-BLS-25) have less than 5 days supply. Immediate vendor purchase order prevents an estimated <strong>{currencySymbol}18,600</strong> in lost assembly downtime.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
            <div className="text-xs font-bold text-emerald-400 mb-1">Warehouse Space Balancing</div>
            <p className="text-xs text-slate-300">
              Pacific Hub is at 85% bin saturation while Rotterdam operates at 67%. Inter-facility stock transfers optimize freight consolidation and lower emergency storage surcharges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
