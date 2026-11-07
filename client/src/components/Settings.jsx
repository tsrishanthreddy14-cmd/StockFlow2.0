import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Database,
  Key,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCode,
  DollarSign,
  ShieldCheck,
  Cpu,
  Layers,
  Sliders
} from 'lucide-react';

export default function Settings({
  systemStatus,
  onConfigureSupabase,
  onResetDemoData,
  currency,
  setCurrency,
  leadTimeBuffer,
  setLeadTimeBuffer
}) {
  const [supabaseUrl, setSupabaseUrl] = useState(systemStatus?.database?.supabase_url !== 'Not set' ? systemStatus?.database?.supabase_url || '' : '');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseFeedback, setSupabaseFeedback] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(null);

  const handleTestAndSaveSupabase = async (e) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseKey) {
      setSupabaseFeedback({ type: 'error', message: 'Please enter both Supabase URL and Key' });
      return;
    }

    setIsTestingSupabase(true);
    setSupabaseFeedback(null);
    try {
      const res = await onConfigureSupabase(supabaseUrl.trim(), supabaseKey.trim());
      setSupabaseFeedback({
        type: res.success ? 'success' : 'warning',
        message: res.message || 'Supabase credentials processed.'
      });
    } catch (err) {
      setSupabaseFeedback({ type: 'error', message: err.message });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset database to clean StockFlow 2.0 enterprise demo data? All test records will be refreshed.')) {
      return;
    }
    setIsResetting(true);
    setResetFeedback(null);
    try {
      await onResetDemoData();
      setResetFeedback({ type: 'success', message: 'Demo dataset restored successfully!' });
    } catch (err) {
      setResetFeedback({ type: 'error', message: err.message });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-400" />
          System Settings & Ecosystem Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure Supabase PostgreSQL database connections, currency preferences, and AI threshold parameters
        </p>
      </div>

      {/* Supabase Connection Setup Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Supabase Cloud Database Integration</h2>
              <p className="text-xs text-slate-400">PostgreSQL cloud storage with Row Level Security</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              systemStatus?.database?.supabase_configured
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-teal-500/10 text-teal-300 border-teal-500/20'
            }`}>
              <span className={`w-2 h-2 rounded-full ${systemStatus?.database?.supabase_configured ? 'bg-emerald-400' : 'bg-teal-400'} animate-pulse`}></span>
              {systemStatus?.database?.supabase_configured ? 'Supabase Active' : 'Resilient File DB Active'}
            </span>
          </div>
        </div>

        <form onSubmit={handleTestAndSaveSupabase} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Supabase Project URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full bg-slate-850 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Supabase Anon / Service API Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full bg-slate-850 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {supabaseFeedback && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              supabaseFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : supabaseFeedback.type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {supabaseFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{supabaseFeedback.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-400">
              Database schema is located in <code className="text-emerald-400 bg-slate-850 px-1.5 py-0.5 rounded">supabase/schema.sql</code>. Paste into your Supabase SQL Editor.
            </p>
            <button
              type="submit"
              disabled={isTestingSupabase}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-spin' : ''}`} />
              <span>{isTestingSupabase ? 'Connecting...' : 'Test & Save Connection'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">System Currency & Planning Parameters</h2>
            <p className="text-xs text-slate-400">Global display units and automated safety buffers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Currency selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Active Currency Symbol
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="$">USD ($) - US Dollar</option>
              <option value="€">EUR (€) - Euro</option>
              <option value="£">GBP (£) - British Pound</option>
              <option value="₹">INR (₹) - Indian Rupee</option>
              <option value="¥">JPY (¥) - Japanese Yen</option>
            </select>
          </div>

          {/* Lead time buffer */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Safety Stock Lead Time Buffer (Days)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={leadTimeBuffer}
              onChange={(e) => setLeadTimeBuffer(parseInt(e.target.value) || 7)}
              className="w-full bg-slate-850 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-750 focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Added to supplier quoted lead-times during AI Reorder Point ($ROP$) calculation.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Reset & Management */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Database Seed Management</h2>
            <p className="text-xs text-slate-400">Restore default enterprise catalog, categories, suppliers, and orders</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          <div>
            <p className="text-xs text-slate-300">
              Reset database to pristine state with all sample enterprise products, orders, and warehouses.
            </p>
            {resetFeedback && (
              <p className="text-xs text-emerald-400 font-bold mt-1">{resetFeedback.message}</p>
            )}
          </div>

          <button
            onClick={handleResetData}
            disabled={isResetting}
            className="bg-slate-800 hover:bg-rose-950/40 text-slate-200 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
          >
            {isResetting ? 'Resetting...' : 'Reset Demo Dataset'}
          </button>
        </div>
      </div>

      {/* About BeeEngage & StockFlow 2.0 */}
      <div className="rounded-2xl p-5 bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">StockFlow 2.0 – Intelligent Inventory Ecosystem</h4>
            <p className="text-xs text-slate-400">Engineered for BeeEngage Enterprise Hackathon 2026</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          v2.0.0 Production
        </span>
      </div>
    </div>
  );
}
