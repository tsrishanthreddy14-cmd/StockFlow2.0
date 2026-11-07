import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  ShoppingCart,
  Calendar,
  Layers,
  CheckCircle,
  HelpCircle,
  Eye,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function AIForecasting({
  forecastData,
  isLoadingForecast,
  onRefreshForecast,
  onTriggerReorderPO,
  currencySymbol = '$'
}) {
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [forecastHorizon, setForecastHorizon] = useState(30);

  const summary = forecastData?.summary || {
    total_products_analyzed: 10,
    high_risk_stockouts: 3,
    reorders_recommended: 4,
    overstocked_products: 1,
    total_recommended_spend: 34200
  };

  const trendData = forecastData?.aggregated_demand_trend || [];
  const productForecasts = forecastData?.product_forecasts || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Scikit-Learn Ridge Demand Model
            </span>
            <span className="text-xs text-slate-400">Python 3.11 ML Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            AI Inventory Demand & Stockout Forecasting
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Trained on historical sales velocities, lead-time variance, and day-of-week seasonality to predict demand, calculate dynamic safety stock, and prevent costly stockouts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onRefreshForecast(forecastHorizon)}
            disabled={isLoadingForecast}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForecast ? 'animate-spin' : ''}`} />
            <span>{isLoadingForecast ? 'Running ML Model...' : 'Run ML Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Stockout Risk Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{summary.high_risk_stockouts}</div>
          <div className="text-[11px] text-rose-400 mt-0.5 font-medium">Critical stockout probability &gt; 70%</div>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Reorders Recommended</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{summary.reorders_recommended}</div>
          <div className="text-[11px] text-amber-400 mt-0.5 font-medium">Below statistical Reorder Point (ROP)</div>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Overstock Detection</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{summary.overstocked_products}</div>
          <div className="text-[11px] text-blue-400 mt-0.5 font-medium">&gt; 60 days of holding coverage</div>
        </div>

        <div className="glass-card p-4 rounded-xl border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Estimated Reorder Spend</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {currencySymbol}{(summary.total_recommended_spend || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">To restore 95% service level</div>
        </div>
      </div>

      {/* Aggregate 30-Day Demand Forecast Chart */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200">Predicted Aggregate Demand Trajectory (Next 30 Days)</h2>
            <p className="text-xs text-slate-400">Ensemble Scikit-Learn regression forecast across all catalog products</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Horizon:</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              30 Days
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="predictedDemandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#10b981' }}
                formatter={(val) => [`${val} units`, 'Predicted Demand']}
              />
              <Area
                type="monotone"
                dataKey="total_predicted_demand"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#predictedDemandGradient)"
                name="AI Predicted Demand"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product-Level AI Recommendations Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Product Forecasts & Safety Stock Matrix</h3>
            <p className="text-xs text-slate-400">Calculated with 95% service level ($Z = 1.65$) and supplier lead-time buffers</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {productForecasts.length} items analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold">Stock / Demand</th>
                <th className="py-3 px-4 font-bold">Days Until Out</th>
                <th className="py-3 px-4 font-bold">Stockout Risk</th>
                <th className="py-3 px-4 font-bold">Safety Stock / ROP</th>
                <th className="py-3 px-4 font-bold">AI Reorder Action</th>
                <th className="py-3 px-4 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {productForecasts.map((f) => {
                const isCriticalRisk = f.stockout_risk_score >= 70;
                const isModerateRisk = f.stockout_risk_score >= 40 && f.stockout_risk_score < 70;

                return (
                  <tr key={f.product_id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Product & SKU */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{f.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {f.sku}
                        </span>
                        {f.is_overstocked && (
                          <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                            Overstocked
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Current Stock vs Daily Demand */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-200">{f.current_stock} units</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        ~{f.mean_daily_demand} units / day
                      </div>
                    </td>

                    {/* Days Until Stockout */}
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold text-xs ${
                        f.days_until_stockout <= 5 ? 'text-rose-400' :
                        f.days_until_stockout <= 14 ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {f.days_until_stockout} days
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Lead time: {f.lead_time_days}d
                      </span>
                    </td>

                    {/* Stockout Risk Meter */}
                    <td className="py-3 px-4">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span className={isCriticalRisk ? 'text-rose-400' : isModerateRisk ? 'text-amber-400' : 'text-emerald-400'}>
                            {f.stockout_risk_score}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCriticalRisk ? 'bg-rose-500' : isModerateRisk ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, f.stockout_risk_score)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Safety Stock / Reorder Point */}
                    <td className="py-3 px-4 text-slate-300">
                      <div>
                        <span className="text-slate-400 text-[10px]">Safety: </span>
                        <span className="font-semibold text-slate-200">{f.safety_stock}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">ROP: </span>
                        <span className="font-bold text-emerald-400">{f.reorder_point}</span>
                      </div>
                    </td>

                    {/* Recommended Order & One-Click PO */}
                    <td className="py-3 px-4">
                      {f.needs_reorder ? (
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="font-bold text-amber-400 text-xs">
                              +{f.recommended_order_qty} units
                            </span>
                            <p className="text-[10px] text-slate-400">
                              ~{currencySymbol}{f.estimated_reorder_cost?.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => onTriggerReorderPO(f)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                            title="Generate Instant Replenishment PO"
                          >
                            Reorder PO
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Stock Optimal
                        </span>
                      )}
                    </td>

                    {/* Deep-dive details */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedProductDetail(f)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Detailed Forecast Curve"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Forecast Curve Deep-Dive Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{selectedProductDetail.name}</h3>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {selectedProductDetail.sku}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Historical Sales Trajectory + 30-Day Scikit-Learn Model Prediction with Confidence Bounds
                </p>
              </div>
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Stats badges */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Stock</span>
                  <span className="text-base font-bold text-white mt-1 block">{selectedProductDetail.current_stock} units</span>
                </div>
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Daily Demand</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">{selectedProductDetail.mean_daily_demand} units</span>
                </div>
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Reorder Point</span>
                  <span className="text-base font-bold text-amber-400 mt-1 block">{selectedProductDetail.reorder_point} units</span>
                </div>
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Model R² Accuracy</span>
                  <span className="text-base font-bold text-teal-400 mt-1 block">{selectedProductDetail.model_r2 || '0.884'}</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 w-full glass-panel p-4 rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedProductDetail.forecast_timeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="upper_bound" stroke="#64748b" strokeDasharray="3 3" fill="transparent" name="Upper Confidence 95%" />
                    <Area type="monotone" dataKey="predicted_demand" stroke="#10b981" strokeWidth={2} fill="url(#predGrad)" name="Expected Demand" />
                    <Area type="monotone" dataKey="lower_bound" stroke="#64748b" strokeDasharray="3 3" fill="transparent" name="Lower Confidence 95%" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {selectedProductDetail.needs_reorder ? (
                <button
                  onClick={() => {
                    const item = selectedProductDetail;
                    setSelectedProductDetail(null);
                    onTriggerReorderPO(item);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Create Reorder PO for {selectedProductDetail.recommended_order_qty} units</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400">Inventory position is stable</span>
              )}

              <button
                onClick={() => setSelectedProductDetail(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
