// E2E Test Suite: Provider-Specific Partner RBAC & Access Isolation
const BASE_URL = 'http://localhost:3000/api';

const TEST_CREDENTIALS = {
  admin: { userId: 'EZY-P-10001', password: 'Admin@2026!' },
  grocery: { userId: 'EZY-P-10002', password: 'Sharma@2026!' },
  pharmacy: { userId: 'EZY-P-10003', password: 'Nair@2026!' },
  services: { userId: 'EZY-P-10004', password: 'Suresh@2026!' },
  delivery: { userId: 'EZY-P-10005', password: 'Rajesh@2026!' },
  hospital: { userId: 'EZY-P-10006', password: 'Hospital@2026!' },
  restaurant: { userId: 'EZY-P-10007', password: 'Restaurant@2026!' },
};

async function login(userId, password) {
  const res = await fetch(`${BASE_URL}/partner/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partnerUserId: userId, password })
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function requestWithToken(url, token, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    json = null;
  }
  return { status: res.status, data: json };
}

async function runTests() {
  console.log('===========================================================');
  console.log('🛡️  EZY1 PROVIDER RBAC & ACCESS CONTROL E2E SECURITY SUITE');
  console.log('===========================================================\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, description, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${description}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${description} ${detail ? `-> ${detail}` : ''}`);
      failed++;
    }
  }

  // 1. Authenticate all providers
  console.log('--- 1. Authenticating Partner Accounts & Verifying Provider Type in Token ---');
  const tokens = {};
  for (const [key, creds] of Object.entries(TEST_CREDENTIALS)) {
    const res = await login(creds.userId, creds.password);
    assert(res.status === 200 && res.data.success && res.data.token, `Login for ${key.toUpperCase()} (${creds.userId})`);
    if (res.data?.token) {
      tokens[key] = res.data.token;
      const expectedType = key === 'services' ? 'SERVICE_PROVIDER' : key.toUpperCase();
      assert(res.data.partner.providerType.toUpperCase() === expectedType, 
        `Token claims & payload contain providerType: ${res.data.partner.providerType}`);
      assert(Array.isArray(res.data.partner.permissions) && res.data.partner.permissions.length > 0,
        `Token contains granular permission set (Count: ${res.data.partner.permissions.length})`);
    }
  }

  // 2. Test Grocery Partner
  console.log('\n--- 2. Testing GROCERY Partner Access Boundary ---');
  const groceryDashboard = await requestWithToken('/grocery/dashboard', tokens.grocery);
  assert(groceryDashboard.status === 200 && groceryDashboard.data, 'Grocery partner CAN access Grocery Dashboard (200 OK)');
  
  const groceryToHospital = await requestWithToken('/hospital/dashboard', tokens.grocery);
  assert(groceryToHospital.status === 403, `Grocery partner BLOCKED from Hospital Dashboard (403 Forbidden, got ${groceryToHospital.status})`);

  const groceryToPharmacy = await requestWithToken('/pharmacy/medicines', tokens.grocery);
  assert(groceryToPharmacy.status === 403, `Grocery partner BLOCKED from Pharmacy Medicines (403 Forbidden, got ${groceryToPharmacy.status})`);

  const groceryToDelivery = await requestWithToken('/delivery/trips', tokens.grocery);
  assert(groceryToDelivery.status === 403, `Grocery partner BLOCKED from Delivery Trips (403 Forbidden, got ${groceryToDelivery.status})`);

  const groceryToRestaurant = await requestWithToken('/restaurant/menu', tokens.grocery);
  assert(groceryToRestaurant.status === 403, `Grocery partner BLOCKED from Restaurant Menu (403 Forbidden, got ${groceryToRestaurant.status})`);

  // 3. Test Hospital Partner
  console.log('\n--- 3. Testing HOSPITAL Partner Access Boundary ---');
  const hospitalDashboard = await requestWithToken('/hospital/dashboard', tokens.hospital);
  assert(hospitalDashboard.status === 200 && hospitalDashboard.data, 'Hospital partner CAN access Hospital Dashboard (200 OK)');

  const hospitalBeds = await requestWithToken('/hospital/beds', tokens.hospital);
  assert(hospitalBeds.status === 200 && Array.isArray(hospitalBeds.data), `Hospital partner CAN view beds (Count: ${hospitalBeds.data?.length || 0})`);

  const hospitalDoctors = await requestWithToken('/hospital/doctors', tokens.hospital);
  assert(hospitalDoctors.status === 200 && Array.isArray(hospitalDoctors.data), `Hospital partner CAN view doctors (Count: ${hospitalDoctors.data?.length || 0})`);

  const hospitalToGrocery = await requestWithToken('/grocery/dashboard', tokens.hospital);
  assert(hospitalToGrocery.status === 403, `Hospital partner BLOCKED from Grocery Dashboard (403 Forbidden, got ${hospitalToGrocery.status})`);

  const hospitalToRestaurant = await requestWithToken('/restaurant/menu', tokens.hospital);
  assert(hospitalToRestaurant.status === 403, `Hospital partner BLOCKED from Restaurant Menu (403 Forbidden, got ${hospitalToRestaurant.status})`);

  // 4. Test Pharmacy Partner
  console.log('\n--- 4. Testing PHARMACY Partner Access Boundary ---');
  const pharmacyMeds = await requestWithToken('/pharmacy/medicines', tokens.pharmacy);
  assert(pharmacyMeds.status === 200 && Array.isArray(pharmacyMeds.data), `Pharmacy partner CAN access Pharmacy Medicines (Count: ${pharmacyMeds.data?.length || 0})`);

  const pharmacyToHospital = await requestWithToken('/hospital/beds', tokens.pharmacy);
  assert(pharmacyToHospital.status === 403, `Pharmacy partner BLOCKED from Hospital Beds (403 Forbidden, got ${pharmacyToHospital.status})`);

  // 5. Test Restaurant Partner
  console.log('\n--- 5. Testing RESTAURANT Partner Access Boundary ---');
  const restMenu = await requestWithToken('/restaurant/menu', tokens.restaurant);
  assert(restMenu.status === 200 && Array.isArray(restMenu.data), `Restaurant partner CAN access Restaurant Menu (Count: ${restMenu.data?.length || 0})`);

  const restToGrocery = await requestWithToken('/grocery/dashboard', tokens.restaurant);
  assert(restToGrocery.status === 403, `Restaurant partner BLOCKED from Grocery Dashboard (403 Forbidden, got ${restToGrocery.status})`);

  // 6. Test Delivery Partner
  console.log('\n--- 6. Testing DELIVERY Partner Access Boundary ---');
  const deliveryTrips = await requestWithToken('/delivery/trips', tokens.delivery);
  assert(deliveryTrips.status === 200 && deliveryTrips.data, 'Delivery partner CAN access Delivery Trips (200 OK)');

  const deliveryToPharmacy = await requestWithToken('/pharmacy/medicines', tokens.delivery);
  assert(deliveryToPharmacy.status === 403, `Delivery partner BLOCKED from Pharmacy Medicines (403 Forbidden, got ${deliveryToPharmacy.status})`);

  // 7. Test Admin Access (Cross-domain allowed)
  console.log('\n--- 7. Testing ADMIN Full Privileges ---');
  const adminGrocery = await requestWithToken('/grocery/dashboard', tokens.admin);
  assert(adminGrocery.status === 200, 'Admin CAN access Grocery Dashboard (200 OK)');

  const adminHospital = await requestWithToken('/hospital/dashboard', tokens.admin);
  assert(adminHospital.status === 200, 'Admin CAN access Hospital Dashboard (200 OK)');

  const adminPharmacy = await requestWithToken('/pharmacy/medicines', tokens.admin);
  assert(adminPharmacy.status === 200, 'Admin CAN access Pharmacy Medicines (200 OK)');

  // 8. Test Non-Admin blocked from Admin endpoints
  console.log('\n--- 8. Testing Partner Blocked from Admin APIs ---');
  const groceryToAdmin = await requestWithToken('/admin/partners', tokens.grocery);
  assert(groceryToAdmin.status === 403, `Grocery partner BLOCKED from Admin Partner Management (403 Forbidden, got ${groceryToAdmin.status})`);

  // 9. Unauthenticated Access Blocked
  console.log('\n--- 9. Testing Unauthenticated Access Blocked ---');
  const unauthGrocery = await requestWithToken('/grocery/dashboard', null);
  assert(unauthGrocery.status === 401, `Unauthenticated request returns 401 Unauthorized (Got ${unauthGrocery.status})`);

  console.log(`\n========================================`);
  console.log(`TOTAL SECURITY TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
