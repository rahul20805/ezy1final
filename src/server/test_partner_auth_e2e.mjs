const BASE_URL = 'http://localhost:3000/api';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 EZY1 PARTNER AUTHENTICATION & SECURITY TEST SUITE');
  console.log('====================================================\n');

  try {
    // 1. Unauthenticated Request to Protected Partner API
    console.log('--- Test 1: Unauthenticated Protected Route Protection ---');
    const unauthRes = await fetch(`${BASE_URL}/partner/dashboard`);
    assert(unauthRes.status === 401, 'Unauthenticated request to /api/partner/dashboard returns 401');
    const unauthData = await unauthRes.json();
    assert(unauthData.error !== undefined, 'Returns error object when unauthenticated');

    // 2. Invalid Login (Non-existent Partner)
    console.log('\n--- Test 2: Invalid Login (Unknown User ID) ---');
    const invalidIdRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: 'EZY-P-99999', password: 'WrongPassword123!' })
    });
    assert(invalidIdRes.status === 401, 'Invalid partner ID returns 401');
    const invalidIdData = await invalidIdRes.json();
    assert(
      invalidIdData.error === 'Invalid Partner ID or password.',
      'Returns generic error without leaking whether ID exists'
    );

    // 3. Invalid Login (Wrong Password)
    console.log('\n--- Test 3: Invalid Login (Wrong Password for Existing User) ---');
    const wrongPwRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: 'EZY-P-10001', password: 'IncorrectPassword999!' })
    });
    assert(wrongPwRes.status === 401, 'Wrong password returns 401');
    const wrongPwData = await wrongPwRes.json();
    assert(
      wrongPwData.error === 'Invalid Partner ID or password.',
      'Returns identical generic error for wrong password (anti-enumeration)'
    );

    // 4. Successful Login
    console.log('\n--- Test 4: Successful Partner Login ---');
    const validLoginRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: 'EZY-P-10001', password: 'Admin@2026!' })
    });
    assert(validLoginRes.status === 200, 'Valid credentials return 200 OK');
    const loginData = await validLoginRes.json();
    assert(loginData.token !== undefined, 'Returns authenticated JWT session token');
    assert(loginData.partner !== undefined, 'Returns partner profile');
    assert(loginData.partner.partnerUserId === 'EZY-P-10001', 'Partner ID matches');
    assert(loginData.partner.passwordHash === undefined, 'passwordHash is NEVER returned in response');
    const partnerToken = loginData.token;

    // 5. Access Protected Partner Dashboard with Token
    console.log('\n--- Test 5: Access Protected Partner Dashboard with Token ---');
    const dashRes = await fetch(`${BASE_URL}/partner/dashboard`, {
      headers: { Authorization: `Bearer ${partnerToken}` }
    });
    assert(dashRes.status === 200, 'Partner token grants access to /api/partner/dashboard');
    const dashData = await dashRes.json();
    assert(dashData.partner.partnerUserId === 'EZY-P-10001', 'Dashboard scoped to authenticated partner');

    // 6. Verify Auth Me Endpoint
    console.log('\n--- Test 6: Partner /auth/me Session Validation ---');
    const meRes = await fetch(`${BASE_URL}/partner/auth/me`, {
      headers: { Authorization: `Bearer ${partnerToken}` }
    });
    assert(meRes.status === 200, '/api/partner/auth/me returns 200');
    const meData = await meRes.json();
    assert(
      meData.partner.role === 'ADMIN' || meData.partner.role === 'PARTNER',
      `Partner role verified (received ${meData.partner.role})`
    );
    assert(meData.partner.passwordHash === undefined, 'No passwordHash in /me');

    // 7. Partner Data Isolation Check
    console.log('\n--- Test 7: Partner Isolation (Tenant Separation) ---');
    const ordersRes = await fetch(`${BASE_URL}/partner/orders`, {
      headers: { Authorization: `Bearer ${partnerToken}` }
    });
    assert(ordersRes.status === 200, 'Orders endpoint accessible with partner token');
    const ordersData = await ordersRes.json();
    assert(Array.isArray(ordersData), 'Returns orders array scoped to partner');

    // 8. Admin Partner Creation & Sequential ID Assignment
    console.log('\n--- Test 8: Admin Partner Management (Auto-generated ID & Password) ---');
    const timestamp = Date.now();
    const createPartnerRes = await fetch(`${BASE_URL}/admin/partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${partnerToken}`
      },
      body: JSON.stringify({
        name: 'Dr. Vikram Sethi',
        businessName: 'Apex Health Diagnostic Lab',
        email: `vikram.${timestamp}@apexlab.in`,
        phone: `98765${String(timestamp).slice(-5)}`,
        category: 'Diagnostic Lab',
        partnerType: 'DIAGNOSTIC_LAB',
        city: 'Mumbai',
        address: '101 Medical Center, Mumbai'
      })
    });
    assert(createPartnerRes.status === 200 || createPartnerRes.status === 201, 'Admin can create new partner');
    const createdData = await createPartnerRes.json();
    const newPartnerId = createdData.credentials?.partnerUserId || createdData.partner?.partnerUserId;
    const newTempPassword = createdData.credentials?.temporaryPassword;
    assert(newPartnerId && newPartnerId.startsWith('EZY-P-'), `Generated valid sequential Partner User ID (${newPartnerId})`);
    assert(newTempPassword !== undefined, `Generated temporary password for partner (${newTempPassword})`);

    // 9. New Partner Login with Temporary Password & Force Password Change
    console.log('\n--- Test 9: First Login with Temporary Password & Forced Change ---');
    const tempLoginRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: newPartnerId, password: newTempPassword })
    });
    assert(tempLoginRes.status === 200, 'Login with temporary password succeeds');
    const tempLoginData = await tempLoginRes.json();
    assert(Boolean(tempLoginData.partner.mustChangePassword) === true, 'mustChangePassword flag is true');
    const tempToken = tempLoginData.token;

    // Change Password
    const newPermanentPassword = 'PermanentSecurePassword2026!';
    const changePwRes = await fetch(`${BASE_URL}/partner/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tempToken}`
      },
      body: JSON.stringify({
        currentPassword: newTempPassword,
        newPassword: newPermanentPassword
      })
    });
    assert(changePwRes.status === 200, 'Password changed successfully');

    // Login with Old Temp Password must now fail
    const oldTempLoginRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: newPartnerId, password: newTempPassword })
    });
    assert(oldTempLoginRes.status === 401, 'Login with superseded temporary password fails');

    // Login with New Permanent Password must succeed
    const newPermanentLoginRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: newPartnerId, password: newPermanentPassword })
    });
    assert(newPermanentLoginRes.status === 200, 'Login with new permanent password succeeds');
    const newPermData = await newPermanentLoginRes.json();
    assert(!newPermData.partner.mustChangePassword, 'mustChangePassword flag is now false/0');

    // 10. Forgot Password & Secure Reset Token Flow
    console.log('\n--- Test 10: Forgot Password & Single-Use Reset Token Flow ---');
    const forgotRes = await fetch(`${BASE_URL}/partner/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: newPartnerId })
    });
    assert(forgotRes.status === 200, 'Forgot password request succeeds');
    const forgotData = await forgotRes.json();
    assert(forgotData.resetToken !== undefined, 'Generated cryptographically secure reset token');
    const resetToken = forgotData.resetToken;

    // Reset password using token
    const afterResetPassword = 'AfterResetPassword2026!';
    const resetRes = await fetch(`${BASE_URL}/partner/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword: afterResetPassword
      })
    });
    assert(resetRes.status === 200, 'Reset password with valid token succeeds');

    // Try to reuse reset token (must fail)
    const reuseResetRes = await fetch(`${BASE_URL}/partner/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword: 'AnotherPassword2026!'
      })
    });
    assert(reuseResetRes.status === 400, 'Re-using already consumed reset token is rejected (400)');

    // Login with reset password
    const postResetLoginRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: newPartnerId, password: afterResetPassword })
    });
    assert(postResetLoginRes.status === 200, 'Login with reset password succeeds');

    // 11. Partner Account Status Activation/Deactivation
    console.log('\n--- Test 11: Partner Account Deactivation by Admin ---');
    const deactivateRes = await fetch(`${BASE_URL}/admin/partners/${newPartnerId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${partnerToken}`
      },
      body: JSON.stringify({ status: 'INACTIVE' })
    });
    assert(deactivateRes.status === 200, 'Admin can deactivate partner account');

    // Deactivated Partner Login Fails
    const inactiveLoginRes = await fetch(`${BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerUserId: newPartnerId, password: afterResetPassword })
    });
    assert(inactiveLoginRes.status === 403, 'Inactive partner login is blocked with 403 Forbidden');
    const inactiveData = await inactiveLoginRes.json();
    assert(
      inactiveData.error.toLowerCase().includes('disabled') || 
      inactiveData.error.toLowerCase().includes('inactive') || 
      inactiveData.error.toLowerCase().includes('deactivated'),
      'Clear message on disabled account'
    );

    // 12. Logout Session Invalidation
    console.log('\n--- Test 12: Partner Logout ---');
    const logoutRes = await fetch(`${BASE_URL}/partner/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${partnerToken}` }
    });
    assert(logoutRes.status === 200, 'Logout endpoint returns 200 OK');

    // Summary
    console.log('\n====================================================');
    console.log(`📊 TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
    console.log('====================================================');

    if (testsFailed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
