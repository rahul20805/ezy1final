import { authService } from "../backend/dist/services/auth.service.js";
import { query, queryOne, execute } from "../backend/dist/repositories/database.adapter.js";
import { verifyPassword } from "../backend/dist/utils/crypto.utils.js";

async function runRealAuthTest() {
  console.log("\n========================================================");
  console.log("   EZY1 COMPREHENSIVE PRODUCTION AUTH & RECOVERY TEST");
  console.log("========================================================\n");

  const testEmail = `qa_test_${Date.now()}@ezy1.site`;
  const testUsername = `user_${Date.now().toString().slice(-6)}`;
  const testPassword = "Password@2026!";
  const newPassword = "NewSecurePassword@2026!";

  try {
    // 1. SIGNUP TEST
    console.log(`[TEST 1] Registering persistent user (${testEmail})...`);
    const signupRes = await authService.registerUser(
      "QA Test Customer",
      testUsername,
      testPassword,
      `9876${Date.now().toString().slice(-6)}`,
      testEmail
    );

    if (!signupRes.success || !signupRes.user?.id) {
      throw new Error(`Signup failed: ${JSON.stringify(signupRes)}`);
    }
    const createdUserId = signupRes.user.id;
    console.log(`✅ [PASS] User created with ID: ${createdUserId}, Email: ${signupRes.user.email}`);

    // Verify DB user record
    const dbUserBefore = await queryOne("SELECT * FROM users WHERE id = ?", [createdUserId]);
    if (!dbUserBefore || dbUserBefore.email !== testEmail) {
      throw new Error("User record not found in PostgreSQL/Database!");
    }
    console.log(`✅ [PASS] User record verified in database.`);

    // 2. DUPLICATE ACCOUNT PREVENTION
    console.log(`[TEST 2] Verifying duplicate email rejection...`);
    let duplicateRejected = false;
    try {
      await authService.registerUser(
        "Duplicate Attempter",
        `dup_${Date.now().toString().slice(-4)}`,
        "AnotherPassword123!",
        "9876543210",
        testEmail
      );
    } catch (err) {
      duplicateRejected = true;
      console.log(`✅ [PASS] Duplicate registration rejected: "${err.message}"`);
    }
    if (!duplicateRejected) throw new Error("Duplicate email was NOT rejected!");

    // 3. EMAIL VERIFICATION TEST
    console.log(`[TEST 3] Verifying email verification OTP...`);
    const verifOtpRecord = await queryOne(
      "SELECT * FROM otps WHERE email = ? AND purpose = 'EMAIL_VERIFICATION' ORDER BY id DESC LIMIT 1",
      [testEmail]
    );

    if (!verifOtpRecord) throw new Error("No EMAIL_VERIFICATION OTP found in database!");
    console.log(`   OTP generated: ${verifOtpRecord.plainOtp || "Hashed"} (expires: ${new Date(Number(verifOtpRecord.expiresAt)).toISOString()})`);

    // Test Wrong OTP rejection
    let wrongOtpRejected = false;
    try {
      await authService.verifyEmailOtp(testEmail, "999999");
    } catch (e) {
      wrongOtpRejected = true;
      console.log(`✅ [PASS] Wrong OTP correctly rejected: "${e.message}"`);
    }
    if (!wrongOtpRejected) throw new Error("Wrong OTP was accepted!");

    // Verify with Real OTP
    const verifyEmailRes = await authService.verifyEmailOtp(testEmail, verifOtpRecord.plainOtp);
    if (!verifyEmailRes.success) throw new Error("Email OTP verification failed!");
    console.log(`✅ [PASS] Email verified successfully. Session returned: ${Boolean(verifyEmailRes.token)}`);

    // 4. LOGIN TEST (RETURNING USER)
    console.log(`[TEST 4] Testing Returning User Login with correct credentials...`);
    const loginRes = await authService.loginWithPassword(testEmail, testPassword);
    if (!loginRes.success || loginRes.user.id !== createdUserId) {
      throw new Error("Login failed or returned wrong user ID!");
    }
    console.log(`✅ [PASS] Login successful with existing account ID: ${loginRes.user.id}`);

    // Test wrong password
    let wrongPwRejected = false;
    try {
      await authService.loginWithPassword(testEmail, "WrongPassword123!");
    } catch (e) {
      wrongPwRejected = true;
      console.log(`✅ [PASS] Wrong password rejected: "${e.message}"`);
    }
    if (!wrongPwRejected) throw new Error("Wrong password was accepted!");

    // 5. FORGOT PASSWORD FLOW
    console.log(`[TEST 5] Testing Forgot Password flow...`);
    const forgotRes = await authService.forgotPassword(testEmail);
    console.log(`   Response: "${forgotRes.message}"`);

    const resetOtpRecord = await queryOne(
      "SELECT * FROM otps WHERE email = ? AND purpose = 'PASSWORD_RESET' ORDER BY id DESC LIMIT 1",
      [testEmail]
    );
    if (!resetOtpRecord) throw new Error("No PASSWORD_RESET OTP record found in database!");
    console.log(`   Reset OTP generated: ${resetOtpRecord.plainOtp || "Hashed"}`);

    // Verify Reset OTP
    const verifyResetRes = await authService.verifyResetOtp(testEmail, resetOtpRecord.plainOtp);
    if (!verifyResetRes.success) throw new Error("verifyResetOtp failed!");
    console.log(`✅ [PASS] Reset OTP code verified.`);

    // 6. RESET PASSWORD ON EXISTING USER RECORD
    console.log(`[TEST 6] Updating password on existing user...`);
    const resetPwRes = await authService.resetPassword(testEmail, resetOtpRecord.plainOtp, newPassword);
    if (!resetPwRes.success) throw new Error("Password reset failed!");
    console.log(`✅ [PASS] Password updated successfully.`);

    // Verify user ID and details remain unchanged in DB
    const dbUserAfter = await queryOne("SELECT * FROM users WHERE id = ?", [createdUserId]);
    if (!dbUserAfter || dbUserAfter.id !== createdUserId) {
      throw new Error("User record mutated or deleted during password reset!");
    }
    const isNewPwValid = verifyPassword(newPassword, dbUserAfter.passwordHash);
    const isOldPwInvalid = !verifyPassword(testPassword, dbUserAfter.passwordHash);
    if (!isNewPwValid || !isOldPwInvalid) {
      throw new Error("Password hash verification failed!");
    }
    console.log(`✅ [PASS] Existing user ID ${createdUserId} preserved. Old password rejected. New password accepted.`);

    // 7. LOGIN WITH NEW PASSWORD
    console.log(`[TEST 7] Logging in with NEW password...`);
    const newLoginRes = await authService.loginWithPassword(testEmail, newPassword);
    if (!newLoginRes.success || newLoginRes.user.id !== createdUserId) {
      throw new Error("Login with new password failed!");
    }
    console.log(`✅ [PASS] Login successful with new password for user ${newLoginRes.user.name}.`);

    // Clean up test record
    await execute("DELETE FROM users WHERE id = ?", [createdUserId]);
    await execute("DELETE FROM otps WHERE email = ?", [testEmail]);
    console.log(`\n🎉 ALL 7 AUTHENTICATION & RECOVERY TESTS PASSED WITH ZERO ERRORS!\n`);
  } catch (error) {
    console.error(`\n❌ [TEST FAILED]:`, error.message);
    process.exit(1);
  }
}

runRealAuthTest();
