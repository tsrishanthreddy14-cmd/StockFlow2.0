import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Boxes,
  ExternalLink
} from 'lucide-react';

export default function Suppliers({
  suppliers = [],
  onOpenAddSupplierModal,
  onOpenEditSupplierModal,
  onDeleteSupplier
}) {
  const [selectedSupplierForCatalog, setSelectedSupplierForCatalog] = useState(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            Supplier & Vendor Network
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor vendor reliability scores, average lead times, and linked manufacturing catalog components
          </p>
        </div>

        <button
          onClick={onOpenAddSupplierModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{s.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Contact: {s.contact_name || 'Primary Representative'}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  s.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                }`}>
                  {s.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-850/80 border border-slate-800/80 mb-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{s.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Rating</span>
                </div>
                <div className="border-x border-slate-800">
                  <div className="text-emerald-400 font-bold text-xs">
                    {s.reliability_score || 95}%
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Reliability</span>
                </div>
                <div>
                  <div className="text-blue-400 font-bold text-xs flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{s.lead_time_days || 7}d</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Lead Time</span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 text-xs text-slate-300">
                {s.email && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.email}</span>
                  </div>
                )}
                {s.phone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.phone}</span>
                  </div>
                )}
                {s.address && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Connected Products & Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedSupplierForCatalog(s)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>{s.products_count || 0} Products Supplied</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenEditSupplierModal(s)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Edit Supplier"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteSupplier(s.id, s.name)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 transition-colors"
                  title="Delete Supplier"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Catalog Preview Modal */}
      {selectedSupplierForCatalog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm">{selectedSupplierForCatalog.name}</h3>
                <p className="text-xs text-slate-400">Connected Catalog Parts & Components</p>
              </div>
              <button
                onClick={() => setSelectedSupplierForCatalog(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-72 overflow-y-auto">
              {(!selectedSupplierForCatalog.catalog_products || selectedSupplierForCatalog.catalog_products.length === 0) ? (
                <p className="text-xs text-slate-400 py-6 text-center">No products currently assigned to this supplier.</p>
              ) : (
                selectedSupplierForCatalog.catalog_products.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-emerald-400 font-mono">{p.sku}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-300">
                      {p.stock} units in stock
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSupplierForCatalog(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
