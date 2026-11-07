import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  Package,
  Calendar,
  Eye,
  Trash2,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';

export default function Orders({
  orders = [],
  onOpenCreateOrderModal,
  onUpdateOrderStatus,
  onDeleteOrder,
  currencySymbol = '$'
}) {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeOrderDetail, setActiveOrderDetail] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const matchesType = selectedType === 'all' || o.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">Shipped</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Processing</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/60 text-slate-300 border border-slate-600">Pending</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            Order Management System
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Process outbound customer sales dispatches and inbound supplier purchase replenishment orders
          </p>
        </div>

        <button
          onClick={onOpenCreateOrderModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750 text-xs text-slate-300">
            <span className="text-slate-400 font-semibold">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Orders</option>
              <option value="sales" className="bg-slate-900">Sales Orders (Outbound)</option>
              <option value="purchase" className="bg-slate-900">Purchase Orders (Inbound)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending" className="bg-slate-900">Pending</option>
              <option value="processing" className="bg-slate-900">Processing</option>
              <option value="shipped" className="bg-slate-900">Shipped</option>
              <option value="delivered" className="bg-slate-900">Delivered</option>
              <option value="cancelled" className="bg-slate-900">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-slate-200">{filteredOrders.length}</span> of {orders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-bold">Order Number</th>
                <th className="py-3.5 px-4 font-bold">Type</th>
                <th className="py-3.5 px-4 font-bold">Customer / Supplier</th>
                <th className="py-3.5 px-4 font-bold">Items Count</th>
                <th className="py-3.5 px-4 font-bold">Total Amount</th>
                <th className="py-3.5 px-4 font-bold">Order Date</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ShoppingCart className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-semibold">No orders recorded</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Create New Order" to initiate a sales or purchase order</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Order Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100 text-xs">
                      {ord.order_number}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ord.type === 'sales'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {ord.type}
                      </span>
                    </td>

                    {/* Customer or Supplier */}
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ord.customer_or_supplier_name}</span>
                      </div>
                      {ord.notes && (
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">{ord.notes}</p>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="font-semibold text-slate-200">
                        {ord.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 1} units
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({ord.items?.length || 1} line item{ord.items?.length === 1 ? '' : 's'})
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-bold text-slate-100 text-xs">
                      {currencySymbol}{ord.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Order Date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(ord.order_date || ord.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Status with quick change dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                        className="bg-slate-800 text-[11px] font-semibold text-slate-200 px-2 py-1 rounded border border-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveOrderDetail(ord)}
                          title="View Order Details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder(ord.id, ord.order_number)}
                          title="Delete Order"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-white">{activeOrderDetail.order_number}</span>
                  {getStatusBadge(activeOrderDetail.status)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Type: <span className="uppercase font-semibold text-slate-200">{activeOrderDetail.type}</span> • {new Date(activeOrderDetail.order_date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setActiveOrderDetail(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800">
                <p className="text-xs text-slate-400">Recipient / Partner</p>
                <p className="text-sm font-bold text-white">{activeOrderDetail.customer_or_supplier_name}</p>
                {activeOrderDetail.notes && (
                  <p className="text-xs text-slate-300 mt-1 italic">"{activeOrderDetail.notes}"</p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Order Line Items</h4>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-850/50">
                  {activeOrderDetail.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">{item.product_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">SKU: {item.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">
                          {item.quantity} × {currencySymbol}{item.unit_price?.toFixed(2)} = {currencySymbol}{item.subtotal?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-sm font-bold text-slate-300">Grand Total</span>
                <span className="text-lg font-black text-emerald-400">
                  {currencySymbol}{activeOrderDetail.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveOrderDetail(null)}
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
