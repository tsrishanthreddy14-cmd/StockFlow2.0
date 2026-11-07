import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Suppliers from './components/Suppliers';
import AIForecasting from './components/AIForecasting';
import Warehouse from './components/Warehouse';
import Reports from './components/Reports';
import Settings from './components/Settings';

import ProductModal from './components/modals/ProductModal';
import OrderModal from './components/modals/OrderModal';
import SupplierModal from './components/modals/SupplierModal';
import TransferModal from './components/modals/TransferModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('$');
  const [leadTimeBuffer, setLeadTimeBuffer] = useState(7);

  // Core Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stats, setStats] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [prefillOrderItem, setPrefillOrderItem] = useState(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      const [
        prodsRes,
        catsRes,
        ordersRes,
        suppsRes,
        whsRes,
        statsRes,
        statusRes,
        forecastRes,
        reportsRes
      ] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getSuppliers(),
        api.getWarehouses(),
        api.getDashboardStats(),
        api.getStatus(),
        api.getForecast(),
        api.getReportsAnalytics()
      ]);

      setProducts(prodsRes);
      setCategories(catsRes);
      setOrders(ordersRes);
      setSuppliers(suppsRes);
      setWarehouses(whsRes);
      setStats(statsRes);
      setSystemStatus(statusRes);
      setForecastData(forecastRes);
      setReportsData(reportsRes);
    } catch (err) {
      console.error('Data load error:', err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------------------------------------------------------------
  // Product Operations
  // -------------------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
      } else {
        await api.createProduct(formData);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      await loadData();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // Order Operations
  // -------------------------------------------------------------
  const handleOpenCreateOrder = () => {
    setPrefillOrderItem(null);
    setIsOrderModalOpen(true);
  };

  const handleTriggerReorderPO = (forecastItem) => {
    setPrefillOrderItem(forecastItem);
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = async (orderPayload) => {
    try {
      await api.createOrder(orderPayload);
      setIsOrderModalOpen(false);
      setPrefillOrderItem(null);
      await loadData();
    } catch (err) {
      alert(`Order error: ${err.message}`);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      await loadData();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (id, orderNumber) => {
    if (!window.confirm(`Delete order ${orderNumber}?`)) return;
    try {
      await api.deleteOrder(id);
      await loadData();
    } catch (err) {
      alert(`Failed to delete order: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // Supplier Operations
  // -------------------------------------------------------------
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setIsSupplierModalOpen(true);
  };

  const handleOpenEditSupplier = (sup) => {
    setEditingSupplier(sup);
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplier = async (supData) => {
    try {
      if (editingSupplier) {
        await api.updateSupplier(editingSupplier.id, supData);
      } else {
        await api.createSupplier(supData);
      }
      setIsSupplierModalOpen(false);
      setEditingSupplier(null);
      await loadData();
    } catch (err) {
      alert(`Supplier save error: ${err.message}`);
    }
  };

  const handleDeleteSupplier = async (id, name) => {
    if (!window.confirm(`Delete supplier partner "${name}"?`)) return;
    try {
      await api.deleteSupplier(id);
      await loadData();
    } catch (err) {
      alert(`Supplier delete error: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // Warehouse & Transfer Operations
  // -------------------------------------------------------------
  const handleTransferStock = async (transferData) => {
    try {
      await api.transferWarehouseStock(transferData);
      setIsTransferModalOpen(false);
      await loadData();
      alert('Inter-facility transfer completed and recorded in stock movements log.');
    } catch (err) {
      alert(`Transfer error: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // AI Forecasting
  // -------------------------------------------------------------
  const handleRefreshForecast = async (days = 30) => {
    setIsLoadingForecast(true);
    try {
      const res = await api.generateForecast(days);
      setForecastData(res);
    } catch (err) {
      console.warn('Error running forecast simulation, falling back to fresh calculation:', err);
      try {
        const fallback = await api.getForecast(true, days);
        setForecastData(fallback);
      } catch (e) {
        alert(`Forecasting error: ${e.message}`);
      }
    } finally {
      setIsLoadingForecast(false);
    }
  };

  // -------------------------------------------------------------
  // Settings & DB Config
  // -------------------------------------------------------------
  const handleConfigureSupabase = async (url, key) => {
    const res = await api.configureSupabase(url, key);
    await loadData();
    return res;
  };

  const handleResetDemoData = async () => {
    await api.resetDemoData();
    await loadData();
  };

  const lowStockItems = products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        forecastSummary={forecastData?.summary}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenProductModal={handleOpenAddProduct}
          onOpenOrderModal={handleOpenCreateOrder}
          systemStatus={systemStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          lowStockItems={lowStockItems}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              onNavigate={setActiveTab}
              onOpenProductModal={handleOpenAddProduct}
              onOpenOrderModal={handleOpenCreateOrder}
              currencySymbol={currency}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              products={products}
              categories={categories}
              onOpenAddModal={handleOpenAddProduct}
              onOpenEditModal={handleOpenEditProduct}
              onDeleteProduct={handleDeleteProduct}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currencySymbol={currency}
            />
          )}

          {activeTab === 'orders' && (
            <Orders
              orders={orders}
              onOpenCreateOrderModal={handleOpenCreateOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
              currencySymbol={currency}
            />
          )}

          {activeTab === 'suppliers' && (
            <Suppliers
              suppliers={suppliers}
              onOpenAddSupplierModal={handleOpenAddSupplier}
              onOpenEditSupplierModal={handleOpenEditSupplier}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

          {activeTab === 'forecasting' && (
            <AIForecasting
              forecastData={forecastData}
              isLoadingForecast={isLoadingForecast}
              onRefreshForecast={handleRefreshForecast}
              onTriggerReorderPO={handleTriggerReorderPO}
              currencySymbol={currency}
            />
          )}

          {activeTab === 'warehouse' && (
            <Warehouse
              warehouses={warehouses}
              products={products}
              onOpenTransferModal={() => setIsTransferModalOpen(true)}
              currencySymbol={currency}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              reportsData={reportsData}
              products={products}
              currencySymbol={currency}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              systemStatus={systemStatus}
              onConfigureSupabase={handleConfigureSupabase}
              onResetDemoData={handleResetDemoData}
              currency={currency}
              setCurrency={setCurrency}
              leadTimeBuffer={leadTimeBuffer}
              setLeadTimeBuffer={setLeadTimeBuffer}
            />
          )}
        </main>
      </div>

      {/* Global Action Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        suppliers={suppliers}
        warehouses={warehouses}
        currencySymbol={currency}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setPrefillOrderItem(null);
        }}
        onSave={handleSaveOrder}
        products={products}
        prefillItem={prefillOrderItem}
        currencySymbol={currency}
      />

      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        supplier={editingSupplier}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransfer={handleTransferStock}
        products={products}
        warehouses={warehouses}
      />
    </div>
  );
}
