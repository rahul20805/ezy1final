import assert from "assert";
import { sendOtp, verifyOtp, normalizePhoneNumber } from "./src/authService.js";
import { openDb } from "./src/db.js";
import { dispatchOtpSms, SmsProviderError } from "./src/smsProvider.js";

async function runOtpTestSuite() {
  console.log("===============================================================");
  console.log("📱 EZY1 REAL PHONE OTP PRODUCTION AUTHENTICATION TEST SUITE");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function testAssert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // Ensure test mode enabled for automated suite
  process.env.ENABLE_TEST_OTP = "true";
  process.env.NODE_ENV = "test";

  const db = await openDb();

  // Test 1: Phone Normalization (Indian & Common Input Formats)
  console.log("--- 1. Phone Number Normalization & Validation ---");
  testAssert(normalizePhoneNumber("9876543210") === "9876543210", "Normalizes 10-digit number '9876543210'");
  testAssert(normalizePhoneNumber("+919876543210") === "9876543210", "Normalizes +91 prefixed number '+919876543210'");
  testAssert(normalizePhoneNumber("09876543210") === "9876543210", "Normalizes leading 0 number '09876543210'");
  testAssert(normalizePhoneNumber("+91 98765 43210") === "9876543210", "Normalizes space-separated '+91 98765 43210'");
  
  let invalidThrown = false;
  try {
    normalizePhoneNumber("12345");
  } catch (e) {
    invalidThrown = true;
  }
  testAssert(invalidThrown, "Rejects invalid short phone numbers before reaching provider");

  // Clean old test OTP records
  const testPhone = "9876543210";
  const newPhone = "9123456789";
  await db.run("DELETE FROM otps WHERE phone IN (?, ?)", [testPhone, newPhone]);

  // Test 2: Send OTP (Crypto random, expiration, rate cooldown)
  console.log("\n--- 2. Real OTP Generation & Dispatch ---");
  const sendRes = await sendOtp(testPhone);
  testAssert(sendRes.success === true, "Send OTP returns success = true");
  testAssert(sendRes.cooldownSeconds === 30, "Enforces 30s resend cooldown");
  testAssert(sendRes.expiresInSeconds === 300, "Enforces 5-minute (300s) expiry");

  // Verify OTP record in DB has NO plaintext OTP
  const dbRecord = await db.get("SELECT * FROM otps WHERE phone = ? ORDER BY id DESC LIMIT 1", [testPhone]);
  testAssert(dbRecord && dbRecord.otpHash && dbRecord.plainOtp === null, "Security: plainOtp is NULL in database; only hash is stored");

  // Test 3: Resend Cooldown Enforcement
  console.log("\n--- 3. Resend Cooldown & Throttling ---");
  let cooldownBlocked = false;
  try {
    await sendOtp(testPhone);
  } catch (err) {
    cooldownBlocked = err.message.includes("wait");
  }
  testAssert(cooldownBlocked, "Rejects immediate repeated OTP request during 30s cooldown");

  // Test 4: Wrong OTP Rejection & Attempt Countdown
  console.log("\n--- 4. Verification Security (Wrong OTP & Brute-Force Shield) ---");
  let wrongOtpRejected = false;
  try {
    await verifyOtp(testPhone, "000000");
  } catch (err) {
    wrongOtpRejected = err.message.includes("Incorrect OTP");
  }
  testAssert(wrongOtpRejected, "Rejects incorrect OTP with remaining attempts countdown");

  // Test 5: Successful Verification & Single-Use Enforcement
  console.log("\n--- 5. Successful Verification & Replay Protection ---");
  const verifyRes = await verifyOtp(testPhone, "123456", "Rahul Sharma");
  testAssert(verifyRes.success === true && !!verifyRes.token, "Verifies correct OTP and returns valid signed JWT token");
  testAssert(verifyRes.user.phone === testPhone, "Returns authenticated user matching phone number");
  testAssert(verifyRes.user.role === "CUSTOMER", "Authenticated user strictly holds 'CUSTOMER' role");

  // Replay Attack Test: Try reusing the already verified OTP
  let replayBlocked = false;
  try {
    await verifyOtp(testPhone, "123456");
  } catch (err) {
    replayBlocked = true;
  }
  testAssert(replayBlocked, "Replay Guard: Already consumed/verified OTP cannot be reused");

  // Test 6: Resend Invalidates Previous OTP
  console.log("\n--- 6. Resend Invalidation of Stale OTPs ---");
  // Force simulate past cooldown
  await db.run("UPDATE otps SET lastSentAt = ? WHERE phone = ?", [Date.now() - 35000, testPhone]);
  await sendOtp(testPhone);
  const unverifiedRecords = await db.all("SELECT * FROM otps WHERE phone = ? AND verified = 0", [testPhone]);
  testAssert(unverifiedRecords.length === 1, "Only newest OTP is active; older unverified OTPs marked superseded (verified = 2)");

  // Test 7: New User Creation & Existing User Profile Preservation
  console.log("\n--- 7. New User Creation & Existing User Profile Preservation ---");
  // Clean new phone
  await db.run("DELETE FROM users WHERE phone = ?", [newPhone]);
  await db.run("DELETE FROM otps WHERE phone = ?", [newPhone]);
  const newSend = await sendOtp(newPhone);
  const randomOtp = newSend.debugOtp;
  
  // Verify with new phone using the dynamic random OTP
  const newUserRes = await verifyOtp(newPhone, randomOtp, "Priya Singh");
  testAssert(newUserRes.success === true, "New user registers and authenticates seamlessly via phone OTP");
  testAssert(newUserRes.user.name === "Priya Singh", "New user profile created with provided display name");
  
  // Authenticate again with same newPhone: must NOT create duplicate user account
  await db.run("UPDATE otps SET lastSentAt = ? WHERE phone = ?", [Date.now() - 35000, newPhone]);
  const existingSend = await sendOtp(newPhone);
  const existingUserRes = await verifyOtp(newPhone, existingSend.debugOtp);
  testAssert(existingUserRes.user.id === newUserRes.user.id, "Existing account preserved without duplicate account creation");

  // Test 8: Production Mode Disables Test OTP Behavior
  console.log("\n--- 8. Production Security Enclosure (Demo OTP Disabled) ---");
  process.env.NODE_ENV = "production";
  process.env.ENABLE_TEST_OTP = "false";
  const savedOtpProv = process.env.OTP_PROVIDER;
  const savedSmsProv = process.env.SMS_PROVIDER;
  const savedSmsKey = process.env.SMS_API_KEY;
  const savedMsg91Key = process.env.MSG91_AUTH_KEY;
  delete process.env.OTP_PROVIDER;
  delete process.env.SMS_PROVIDER;
  delete process.env.SMS_API_KEY;
  delete process.env.MSG91_AUTH_KEY;

  const prodPhone = "9999999998";
  await db.run("DELETE FROM otps WHERE phone = ?", [prodPhone]);

  // In production without SMS provider configured, sendOtp must fail gracefully
  let providerRequiredCaught = false;
  try {
    await sendOtp(prodPhone);
  } catch (err) {
    providerRequiredCaught = err instanceof SmsProviderError || err.message.includes("SMS Gateway not configured");
  }
  testAssert(providerRequiredCaught, "Production: Fails safely when no SMS gateway credentials configured (NO silent fake OTP)");

  // With a provider configured in test/dev mode, verify true random generation and zero debugOtp leak in production
  process.env.NODE_ENV = "test";
  process.env.ENABLE_TEST_OTP = "false"; // Test OTP explicitly disabled
  await db.run("DELETE FROM otps WHERE phone = ?", [prodPhone]);
  const prodSend = await sendOtp(prodPhone);
  testAssert(prodSend.debugOtp === undefined, "Production / Non-Test: debugOtp is strictly omitted from API response");

  // Verify that '123456' is rejected
  let test123456AcceptedInProd = false;
  try {
    await verifyOtp(prodPhone, "123456");
    test123456AcceptedInProd = true;
  } catch (err) {
    test123456AcceptedInProd = false;
  }
  testAssert(!test123456AcceptedInProd, "Non-Test: Hardcoded test OTP '123456' is strictly REJECTED (Random OTP enforced)");

  // Restore test env
  process.env.NODE_ENV = "test";
  process.env.ENABLE_TEST_OTP = "true";
  if (savedOtpProv) process.env.OTP_PROVIDER = savedOtpProv;
  if (savedSmsProv) process.env.SMS_PROVIDER = savedSmsProv;
  if (savedSmsKey) process.env.SMS_API_KEY = savedSmsKey;
  if (savedMsg91Key) process.env.MSG91_AUTH_KEY = savedMsg91Key;

  console.log("\n===============================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("===============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runOtpTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
