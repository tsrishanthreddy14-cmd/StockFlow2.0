# StockFlow 2.0 – Intelligent Inventory Ecosystem

**Project Organization:** BeeEngage  
**Platform:** Modern AI-Powered Enterprise Inventory & Warehouse Management Platform  
**Status:** Production Ready  

---

## 1. Problem Statement & Solution

Traditional inventory tracking methods suffer from major inefficiencies:
- **Overstocking:** Incurs exorbitant storage costs, depreciation, and tied-up operating capital.
- **Understocking:** Leads to critical stockouts, stalled assembly lines, and lost revenue.
- **Manual Errors:** Spreadsheets fail to provide unified multi-warehouse visibility.
- **Unpredictable Demand:** Difficulty predicting upcoming seasonal demand surges or supplier lead-time fluctuations.
- **Poor Warehouse Utilization:** Lack of rack-coordinate visibility leading to congested storage bays.

### The StockFlow 2.0 Solution
StockFlow 2.0 is an intelligent, full-stack inventory ecosystem integrating real-time telemetry, automated purchase/sales order processing, visual 2D warehouse rack optimization, and an embedded **Python Scikit-Learn** demand forecasting engine.

---

## 2. Core Modules

| # | Module | Core Functionality |
|---|---|---|
| **1** | **Admin Dashboard** | High-level KPI summary cards, inventory asset cost valuation, gross margin spread, category allocation bar charts, live activity logs, and real-time stock status breakdown. |
| **2** | **Inventory Management** | Full CRUD operations for product catalog items, SKU/barcode lookup, rack coordinate assignments, stock threshold monitoring, category filtering, and status badges (In Stock, Low Stock Alert, Out of Stock). |
| **3** | **Order Management** | Multi-item Sales (customer outbound) and Purchase (supplier inbound replenishment) order processing. Automatically adjusts warehouse stock levels and generates immutable movement audit trails. |
| **4** | **Supplier Management** | Vendor performance tracking, reliability ratings (1-5 stars & % score), average lead times in days, contact directories, and connected catalog component mapping. |
| **5** | **AI Inventory Forecasting** | Scikit-Learn Ridge regression model computing 30-day demand trajectories, 95% service level safety stocks ($Z = 1.65$), Reorder Points ($ROP$), stockout risk radar, overstock warnings, and one-click Purchase Order generation. |
| **6** | **Warehouse Management** | Multi-facility tracking (Midwest Regional Hub, Rotterdam Gateway, Pacific Hub), visual 2D aisle and rack bin heatmap matrix, capacity utilization metrics, temperature zone monitoring, and inter-facility stock transfers. |
| **7** | **Reports & Analytics** | ABC Pareto inventory stratification ($80/20$ rule), monthly sales revenue vs replenishment expense curves, stock velocity turnover ratios, and instant CSV report export. |
| **8** | **Settings & Ecosystem** | Live Supabase PostgreSQL connection tester and configuration panel, global currency selector (`$`, `€`, `£`, `₹`), safety lead-time buffer adjustments, and one-click demo data reset. |

---

## 3. Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide React Icons, Recharts, Vite
- **Backend:** Node.js, Express.js REST API
- **Database:** Supabase (PostgreSQL with Row-Level Security) + Resilient Local Store Fallback
- **AI / Machine Learning:** Python 3.11, Pandas, NumPy, Scikit-learn (Ridge Regression, Lagged Time-Series Features)
- **Deployment:** Vercel

---

## 4. Machine Learning & Forecasting Methodology

The AI engine executes a regression pipeline for demand prediction:
1. **Feature Engineering:** Computes 7-day and 14-day rolling moving averages, day-of-week seasonality, and trend indicators.
2. **Model Training:** Fits a Scikit-Learn `Ridge` regressor to avoid overfitting on noisy purchase spikes.
3. **Safety Stock Formula ($SS$):**
   $$SS = Z \times \sigma_D \times \sqrt{L}$$
   Where $Z = 1.65$ (95% service level), $\sigma_D$ is daily demand standard deviation, and $L$ is supplier lead time in days.
4. **Reorder Point ($ROP$):**
   $$ROP = (\mu_D \times L) + SS$$
5. **Stockout Risk Probability:** Calculated by evaluating remaining days of stock ($CurrentStock / \mu_D$) against supplier delivery latency.

---

## 5. Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+) with `pandas`, `numpy`, `scikit-learn` installed in `ml_service/venv`

### Installation
```bash
# Clone the repository
git clone https://github.com/BeeEngage/stockflow-2.0.git
cd "stock flow 2.0"

# Install server dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd client && npm install && cd ..
```

### Running the Application

**Option A: Unified Server (Frontend + Backend + ML on port 5000)**
```bash
# 1. Build the React frontend
npm run build:client

# 2. Start the unified production server
npm start
# Open http://localhost:5000 in your browser
```

**Option B: Development Mode (Vite Hot-Reload)**
```bash
# Terminal 1: Start Backend API
npm run server

# Terminal 2: Start Vite Dev Server
npm run client
# Open http://localhost:3000
```

---

## 6. Supabase Database Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository and run it to create all tables (`products`, `categories`, `orders`, `order_items`, `suppliers`, `warehouses`, `stock_movements`, `inventory_forecasts`).
4. (Optional) Run `supabase/seed.sql` to populate initial enterprise demonstration data.
5. In StockFlow 2.0, open the **Settings** tab, paste your **Supabase URL** and **API Key**, and click **Test & Save Connection**.

---

## 7. Vercel Deployment

The repository includes a ready `vercel.json` and `api/index.js` serverless configuration:
1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Set build command to `npm run build` and output directory to `client/dist`.
4. Add environment variables `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
5. Deploy!

---

*Engineered with precision for the BeeEngage Enterprise Ecosystem.*
