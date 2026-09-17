// Test Suite for Super-App Ecosystem Routes & Public Guest Accessibility
const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:3000/api';

const PUBLIC_ROUTES = [
  '/',
  '/search',
  '/category/grocery',
  '/category/fruits',
  '/category/vegetables',
  '/category/restaurants',
  '/category/cafe',
  '/category/books',
  '/category/electronics',
  '/category/fashion',
  '/category/pharmacy',
  '/category/sexual-wellness',
  '/category/paan',
  '/hospitals',
  '/doctors',
  '/diagnostics',
  '/parcel',
  '/famous',
  '/dashboard/commerce',
  '/dashboard/healthcare',
  '/dashboard/transport',
  '/stays',
  '/hotels',
  '/travel',
  '/explore',
  '/bus',
  '/buses',
  '/share-ride',
  '/home-healthcare',
  '/doctor-at-home',
];

async function checkRoute(route) {
  try {
    const res = await fetch(`${FRONTEND_URL}${route}`);
    return { status: res.status, ok: res.ok };
  } catch (e) {
    return { status: 0, error: e.message };
  }
}

async function runTests() {
  console.log('===========================================================');
  console.log('🌐 EZY1 SUPER-APP ECOSYSTEM PUBLIC ACCESSIBILITY TEST');
  console.log('===========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Verify Backend Health
  try {
    const health = await fetch(`${BACKEND_URL}/health`).then(r => r.json());
    assert(health.status === 'ok', 'Backend API is running and healthy');
  } catch (err) {
    assert(false, `Backend API check failed: ${err.message}`);
  }

  // 2. Verify all Public Super-App Routes load without forced login
  console.log('\n--- 2. Verifying Guest Accessibility on Super-App Routes ---');
  for (const route of PUBLIC_ROUTES) {
    const res = await checkRoute(route);
    assert(res.status === 200, `Route "${route}" accessible to unauthenticated guests (HTTP 200)`);
  }

  console.log('\n===========================================================');
  console.log(`TOTAL ROUTE CHECKS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('===========================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
