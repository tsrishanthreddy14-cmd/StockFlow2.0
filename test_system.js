/**
 * StockFlow 2.0 - Comprehensive End-to-End Test Suite
 * Tests all backend routes, data layer, calculations, and AI Forecasting integration
 */

const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (_) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting StockFlow 2.0 Comprehensive Test Suite ---');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}:`, e.message);
      failed++;
    }
  }

  // 1. Status Check
  await test('GET /api/status returns valid system info', async () => {
    const res = await request('/api/status');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.data.project !== 'StockFlow 2.0 – Intelligent Inventory Ecosystem') throw new Error('Invalid project name');
    if (res.data.organization !== 'BeeEngage') throw new Error('Invalid organization');
  });

  // 2. Dashboard KPIs
  await test('GET /api/dashboard/stats computes valid analytics', async () => {
    const res = await request('/api/dashboard/stats');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.data.summary || typeof res.data.summary.total_products !== 'number') throw new Error('Missing total_products');
    if (typeof res.data.summary.inventory_valuation !== 'number') throw new Error('Missing inventory_valuation');
  });

  // 3. Products
  await test('GET /api/products returns catalog', async () => {
    const res = await request('/api/products');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.data) || res.data.length === 0) throw new Error('Expected product list array');
  });

  // 4. Orders
  await test('GET /api/orders returns orders', async () => {
    const res = await request('/api/orders');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.data)) throw new Error('Expected orders array');
  });

  // 5. Suppliers
  await test('GET /api/suppliers returns suppliers', async () => {
    const res = await request('/api/suppliers');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.data)) throw new Error('Expected suppliers array');
  });

  // 6. Warehouses
  await test('GET /api/warehouses returns warehouses with capacity', async () => {
    const res = await request('/api/warehouses');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.data) || res.data.length === 0) throw new Error('Expected warehouses array');
  });

  // 7. AI Forecasting
  await test('GET /api/forecast returns AI demand predictions & ROP', async () => {
    const res = await request('/api/forecast');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.data.summary || typeof res.data.summary.high_risk_stockouts !== 'number') throw new Error('Missing forecast summary');
    if (!Array.isArray(res.data.product_forecasts)) throw new Error('Missing product_forecasts array');
  });

  // 8. Reports & ABC Analysis
  await test('GET /api/reports/analytics computes Pareto stratification', async () => {
    const res = await request('/api/reports/analytics');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.data.abc_analysis || !Array.isArray(res.data.abc_analysis.items)) throw new Error('Missing ABC analysis items');
  });

  // 9. Root HTML Serving
  await test('GET / serves production index.html', async () => {
    const res = await request('/');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.raw || !res.raw.includes('StockFlow 2.0')) throw new Error('Missing HTML title');
  });

  console.log(`\n========================================`);
  console.log(` Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests();
