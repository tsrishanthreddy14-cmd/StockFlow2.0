import React, { useState, useEffect } from 'react';
import { X, Truck, Mail, Phone, MapPin, Clock, Star } from 'lucide-react';

export default function SupplierModal({
  isOpen,
  onClose,
  onSave,
  supplier = null
}) {
  const isEditing = !!supplier;

  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    lead_time_days: 7,
    rating: 4.8,
    reliability_score: 95
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contact_name: supplier.contact_name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        lead_time_days: supplier.lead_time_days ?? 7,
        rating: supplier.rating ?? 4.5,
        reliability_score: supplier.reliability_score ?? 90
      });
    } else {
      setFormData({
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        lead_time_days: 7,
        rating: 4.8,
        reliability_score: 95
      });
    }
    setError(null);
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Supplier Company Name is required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">
              {isEditing ? 'Edit Supplier Profile' : 'Add New Supplier Partner'}
            </h3>
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
            <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Apex Robotics Corp"
              className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Representative</label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="e.g. Marcus Vance"
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="orders@vendor.com"
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 0192"
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Lead Time (Days)</label>
              <input
                type="number"
                min="1"
                value={formData.lead_time_days}
                onChange={(e) => setFormData({ ...formData, lead_time_days: parseInt(e.target.value) || 7 })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Vendor Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Reliability Score (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={formData.reliability_score}
                onChange={(e) => setFormData({ ...formData, reliability_score: parseInt(e.target.value) || 90 })}
                className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Facility Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 104 Innovation Way, Austin, TX"
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
              {isEditing ? 'Save Changes' : 'Create Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
