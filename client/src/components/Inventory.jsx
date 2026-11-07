import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  Boxes,
  MapPin,
  Tag,
  DollarSign,
  Barcode,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export default function Inventory({
  products = [],
  categories = [],
  onOpenAddModal,
  onOpenEditModal,
  onDeleteProduct,
  searchQuery,
  setSearchQuery,
  currencySymbol = '$'
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.rack_location && p.rack_location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory || p.category_name === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    let factor = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'name') return factor * a.name.localeCompare(b.name);
    if (sortBy === 'stock_quantity') return factor * (a.stock_quantity - b.stock_quantity);
    if (sortBy === 'cost_price') return factor * (a.cost_price - b.cost_price);
    if (sortBy === 'selling_price') return factor * (a.selling_price - b.selling_price);
    return 0;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            Inventory & Stock Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage product SKUs, multi-rack storage locations, reorder thresholds, and active prices
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by SKU, name, rack..."
              className="w-full bg-slate-850 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750 text-xs text-slate-300">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock" className="bg-slate-900">In Stock (Healthy)</option>
              <option value="low_stock" className="bg-slate-900">Low Stock Alert</option>
              <option value="out_of_stock" className="bg-slate-900">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-slate-200">{filteredProducts.length}</span> of {products.length} products
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-bold cursor-pointer" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Product & SKU</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold cursor-pointer" onClick={() => toggleSort('stock_quantity')}>
                  <div className="flex items-center gap-1">
                    <span>Stock Level</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-bold">Warehouse & Location</th>
                <th className="py-3.5 px-4 font-bold cursor-pointer" onClick={() => toggleSort('cost_price')}>
                  <div className="flex items-center gap-1">
                    <span>Cost / Selling</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-semibold">No products found matching filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search query or category filter</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stock_quantity <= 0;
                  const isLowStock = p.stock_quantity > 0 && p.stock_quantity <= p.min_stock_level;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Product Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100 text-xs">{p.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            {p.sku}
                          </span>
                          {p.barcode && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                              <Barcode className="w-3 h-3" /> {p.barcode}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                          {p.category_name || 'General'}
                        </span>
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs ${
                            isOutOfStock ? 'text-rose-400' : isLowStock ? 'text-amber-400' : 'text-slate-100'
                          }`}>
                            {p.stock_quantity} units
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Min threshold: {p.min_stock_level}
                        </div>
                      </td>

                      {/* Warehouse & Rack Location */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-slate-300 text-xs">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="font-mono font-medium">{p.rack_location || 'Zone A'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {p.warehouse_name || 'Midwest Hub'}
                        </div>
                      </td>

                      {/* Cost / Selling Price */}
                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-semibold text-xs">
                          {currencySymbol}{p.selling_price?.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cost: {currencySymbol}{p.cost_price?.toFixed(2)}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenEditModal(p)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id, p.name)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
