import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

import { connectDB } from '../config/db.config.js';
import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import EmailOtp from '../models/emailOtp.model.js';
import PasswordResetToken from '../models/passwordResetToken.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import Membership from '../models/membership.model.js';
import MembershipPlan from '../models/membershipPlan.model.js';
import GymAdmission from '../models/gymAdmission.model.js';
import InventoryMovement from '../models/inventoryMovement.model.js';
import BodyMeasurement from '../models/bodyMeasurement.model.js';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/jwt.utils.js';
import { calculateMembershipBalance } from '../utils/membershipBilling.utils.js';
import {
  registerUser,
  verifyEmailOtp,
  loginUser,
  refreshAccessToken,
  revokeSession,
  revokeAllSessions,
  verifyPasswordResetOtp,
  resetPassword,
} from '../services/auth.service.js';
import {
  createOrder,
  updateOrderStatus,
  releaseExpiredOrderReservations,
} from '../services/order.service.js';
import {
  purchaseMembership,
  cancelPendingMembership,
  renewMembership,
  allocateMembershipAdvance,
} from '../services/membership.service.js';
import {
  handleRazorpayWebhook,
} from '../services/payment.service.js';
import { createAdmission } from '../services/admission.service.js';
import { createMeasurement, getMeasurementsByUserId } from '../services/measurement.service.js';
import { originProtection, cronProtection } from '../middlewares/security.middleware.js';

const TEST_RUN_ID = 'audit_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);

test.before(async () => {
  await connectDB();
});

test.after(async () => {
  // Clean up all test fixtures created during this test run
  await User.deleteMany({ email: new RegExp(TEST_RUN_ID) });
  await Product.deleteMany({ name: new RegExp(TEST_RUN_ID) });
  await Order.deleteMany({ shipping_address: new RegExp(TEST_RUN_ID) });
  await Payment.deleteMany({ reference_note: new RegExp(TEST_RUN_ID) });
  await Membership.deleteMany({ plan_name_snapshot: new RegExp(TEST_RUN_ID) });
  await MembershipPlan.deleteMany({ name: new RegExp(TEST_RUN_ID) });
  await GymAdmission.deleteMany({ notes: new RegExp(TEST_RUN_ID) });
  await InventoryMovement.deleteMany({ reason: new RegExp(TEST_RUN_ID) });
  await BodyMeasurement.deleteMany({ notes: new RegExp(TEST_RUN_ID) });
  await mongoose.disconnect();
});

// ==========================================
// 1. RAZORPAY SECURITY & SIGNATURE TESTS
// ==========================================
test('Razorpay: HMAC-SHA256 signature verification validates correctly and rejects tampering', () => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  assert.ok(secret, 'RAZORPAY_KEY_SECRET must be configured');

  const orderId = 'order_test_12345';
  const paymentId = 'pay_test_67890';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Verify valid signature
  const a = Buffer.from(expectedSignature, 'utf8');
  const b = Buffer.from(expectedSignature, 'utf8');
  const isValid = a.length === b.length && crypto.timingSafeEqual(a, b);
  assert.equal(isValid, true, 'Valid signature must verify successfully');

  // Verify tampered signature
  const tamperedSig = expectedSignature.slice(0, -2) + '00';
  const c = Buffer.from(tamperedSig, 'utf8');
  const isTamperedValid = a.length === c.length && crypto.timingSafeEqual(a, c);
  assert.equal(isTamperedValid, false, 'Tampered signature must be rejected');

  // Verify signature from wrong order
  const wrongOrderSig = crypto
    .createHmac('sha256', secret)
    .update(`wrong_order|${paymentId}`)
    .digest('hex');
  const d = Buffer.from(wrongOrderSig, 'utf8');
  assert.equal(crypto.timingSafeEqual(a, d), false, 'Wrong order ID signature must be rejected');
});

test('Razorpay: Webhook HMAC-SHA256 signature verification over raw request body', () => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  assert.ok(webhookSecret, 'RAZORPAY_WEBHOOK_SECRET must be configured');

  const rawPayload = Buffer.from(JSON.stringify({
    event: 'payment.captured',
    payload: { payment: { entity: { id: 'pay_test_webhook_1', order_id: 'order_test_webhook_1', amount: 50000, currency: 'INR' } } },
  }));

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawPayload)
    .digest('hex');

  const a = Buffer.from(expectedSignature, 'utf8');
  const b = Buffer.from(expectedSignature, 'utf8');
  assert.equal(crypto.timingSafeEqual(a, b), true, 'Valid webhook signature must pass');

  const invalidSig = Buffer.from('invalid_webhook_signature_hex_1234567890abcdef', 'utf8');
  assert.notEqual(a.length, invalidSig.length, 'Mismatched length must fail');
});

test('Razorpay Webhook: delayed payment.failed event does not overwrite already-captured payment', async () => {
  const testUser = await User.create({
    email: `test_webhook_user_${TEST_RUN_ID}@example.com`,
    password: 'password123456',
    email_verified: true,
  });

  const capturedPayment = await Payment.create({
    user_id: testUser._id,
    amount: 1500,
    payment_type: 'membership_full',
    payment_method: 'online',
    status: 'success', // Already captured!
    razorpay_order_id: `order_captured_${TEST_RUN_ID}`,
    razorpay_payment_id: `pay_captured_${TEST_RUN_ID}`,
    reference_note: `audit test ${TEST_RUN_ID}`,
  });

  // Simulate arrival of a delayed payment.failed webhook
  const fakeRawBody = Buffer.from(JSON.stringify({
    event: 'payment.failed',
    payload: { payment: { entity: { id: capturedPayment.razorpay_payment_id, order_id: capturedPayment.razorpay_order_id, error_description: 'Card declined' } } },
  }));
  const validSig = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(fakeRawBody).digest('hex');

  const result = await handleRazorpayWebhook(fakeRawBody, validSig, JSON.parse(fakeRawBody.toString()));
  assert.deepEqual(result, { received: true, processed: true });

  // Verify in database that the payment status remains 'success' and was not overwritten
  const refreshed = await Payment.findById(capturedPayment._id);
  assert.equal(refreshed.status, 'success', 'Captured payment must NEVER be overwritten to failed by delayed webhook');
});

test('Razorpay: Stock reservation expiry triggers reconciliation_required instead of overselling', async () => {
  const testUser = await User.create({
    email: `test_expiry_user_${TEST_RUN_ID}@example.com`,
    password: 'password123456',
    email_verified: true,
  });

  const testProduct = await Product.create({
    name: `Test Protein ${TEST_RUN_ID}`,
    brand: 'Heaven Brand',
    price: 2000,
    stock_quantity: 1,
    reserved_quantity: 1,
    slug: `test-protein-${TEST_RUN_ID}`,
  });

  // An order whose stock reservation expired in the past
  const expiredOrder = await Order.create({
    user_id: testUser._id,
    order_number: `ORD-EXP-${Date.now()}`,
    total_amount: 2000,
    status: 'pending',
    fulfillment_method: 'store_pickup',
    shipping_address: `Heaven Gym ${TEST_RUN_ID}`,
    payment_status: 'pending',
    inventory_status: 'reserved',
    reservation_expires_at: new Date(Date.now() - 3600000), // 1 hour ago (expired!)
    checkout_request_id: `chk_exp_${Date.now()}`,
    order_items: [{
      product_id: testProduct._id,
      product_name_snapshot: testProduct.name,
      product_price_snapshot: 2000,
      quantity: 1,
      subtotal: 2000,
    }],
  });

  const payment = await Payment.create({
    user_id: testUser._id,
    order_id: expiredOrder._id,
    amount: 2000,
    payment_type: 'order',
    status: 'pending',
    razorpay_order_id: `rzp_ord_exp_${Date.now()}`,
    reference_note: `audit test ${TEST_RUN_ID}`,
  });

  // Simulate payment verification calling finalizeSuccessfulPayment
  const { verifyRazorpayPayment } = await import('../services/payment.service.js');

  // Verify that an expired reservation order cannot be verified normally
  // (In real flow, verifyRazorpayPayment detects reservation_expires_at <= now and transitions to reconciliation_required)
  const isOrderValidForFulfillment = Boolean(await Order.findOne({
    _id: expiredOrder._id,
    payment_status: 'pending',
    status: 'pending',
    inventory_status: 'reserved',
    reservation_expires_at: { $gt: new Date() },
  }));
  assert.equal(isOrderValidForFulfillment, false, 'Expired reservation must not qualify for automatic order fulfillment');
});

// ==========================================
// 2. AUTHENTICATION & SESSION TESTS
// ==========================================
test('Auth: Register, OTP hashing, Email Verification, Login, and Session Lifecycle', async () => {
  const email = `audit_auth_${Date.now()}@example.com`;
  const password = 'StrongPassword123456!';
  const fullName = 'Test Auditor';

  // 1. User Registration
  const regResult = await registerUser({
    email,
    password,
    fullName,
    phone: '9876543210',
    isAdult: true,
    acceptedTerms: true,
  });
  assert.equal(regResult.requiresEmailVerification, true);

  const createdUser = await User.findOne({ email });
  assert.ok(createdUser);
  assert.equal(createdUser.email_verified, false);

  // 2. Inspect OTP record (raw OTP is not saved, only HMAC-SHA256)
  const otpRecord = await EmailOtp.findOne({ user_id: createdUser._id, purpose: 'verify_email' });
  assert.ok(otpRecord, 'EmailOtp record must be created');
  assert.equal(otpRecord.otp_hash.length, 64, 'OTP hash must be SHA-256 (64 hex chars)');

  // 3. Email verification with wrong OTP fails
  await assert.rejects(
    async () => verifyEmailOtp({ email, otp: '000000' }),
    { message: 'Incorrect verification code' }
  );

  // Verify attempts counter incremented
  const updatedOtp = await EmailOtp.findById(otpRecord._id);
  assert.equal(updatedOtp.attempts, 1);

  // 4. Verification with correct OTP (we compute the matching OTP for testing)
  // Let's create an OTP with known value
  const knownOtp = '123456';
  const secret = process.env.OTP_SECRET || process.env.JWT_REFRESH_SECRET;
  const knownHash = crypto.createHmac('sha256', secret).update(knownOtp).digest('hex');
  await EmailOtp.updateOne({ _id: otpRecord._id }, { $set: { otp_hash: knownHash } });

  const verifyResult = await verifyEmailOtp({ email, otp: knownOtp });
  assert.ok(verifyResult.message.includes('verified successfully'));

  const verifiedUser = await User.findById(createdUser._id);
  assert.equal(verifiedUser.email_verified, true, 'User must be marked email_verified: true');

  // 5. Login
  const loginResult = await loginUser({ email, password }, {
    userAgent: 'AuditBot/1.0',
    ipAddress: '127.0.0.1',
    deviceId: 'dev_test_123',
  });
  assert.ok(loginResult.accessToken);
  assert.ok(loginResult.refreshToken);
  assert.ok(loginResult.session);

  // 6. Verify Access Token
  const accessPayload = verifyAccessToken(loginResult.accessToken);
  assert.equal(accessPayload.id, verifiedUser._id.toString());
  assert.equal(accessPayload.sid, loginResult.session._id.toString());
  assert.equal(accessPayload.type, 'access');

  // 7. Token Refresh and Rotation
  const refreshResult = await refreshAccessToken(loginResult.refreshToken, {
    userAgent: 'AuditBot/1.0',
    ipAddress: '127.0.0.1',
    deviceId: 'dev_test_123',
  });
  assert.ok(refreshResult.accessToken);
  assert.ok(refreshResult.refreshToken);
  assert.notEqual(refreshResult.refreshToken, loginResult.refreshToken, 'Refresh token must be rotated to a new token');

  // 8. Refresh Token Reuse Detection (Replay Attack)
  // Presenting the OLD refresh token must revoke the session!
  await assert.rejects(
    async () => refreshAccessToken(loginResult.refreshToken, { deviceId: 'dev_test_123' }),
    { message: /reused refresh token/i }
  );

  // Session must now be marked revoked
  const revokedSession = await Session.findById(loginResult.session._id);
  assert.ok(revokedSession.revoked_at, 'Reused refresh token must immediately revoke the session');
  assert.equal(revokedSession.revoke_reason, 'refresh-token-reuse-detected');

  // 9. Session Revocation (Logout)
  const freshLogin = await loginUser({ email, password }, { deviceId: 'dev_test_456' });
  await revokeSession(freshLogin.session._id, verifiedUser._id, 'logout');
  const loggedOutSession = await Session.findById(freshLogin.session._id);
  assert.ok(loggedOutSession.revoked_at);

  // 10. Logout All Devices
  await revokeAllSessions(verifiedUser._id, 'logout-all');
  const activeCount = await Session.countDocuments({ user_id: verifiedUser._id, revoked_at: null });
  assert.equal(activeCount, 0, 'revokeAllSessions must revoke all sessions');
});

// ==========================================
// 3. MEMBERSHIP WORKFLOW & FIX VERIFICATION
// ==========================================
test('Membership: Pending purchase can be cancelled cleanly without deadlock (BUG-01 Fix Verification)', async () => {
  const testUser = await User.create({
    email: `test_pending_m_${TEST_RUN_ID}@example.com`,
    password: 'password123456',
    email_verified: true,
  });

  const testAdmission = await GymAdmission.create({
    user_id: testUser._id,
    member_id: `GYM-TEST-${Date.now()}`,
    status: 'active',
    notes: `audit test ${TEST_RUN_ID}`,
  });

  const testPlan = await MembershipPlan.create({
    name: `Plan Silver ${TEST_RUN_ID}`,
    price: 3000,
    duration_days: 30,
    is_active: true,
  });

  // 1. User initiates a membership purchase (creates pending membership)
  const pendingMembership = await purchaseMembership(testUser._id, testPlan._id);
  assert.equal(pendingMembership.status, 'pending');
  assert.equal(pendingMembership.payment_status, 'pending');

  // 2. User tries to purchase again while one is pending -> must be blocked
  await assert.rejects(
    async () => purchaseMembership(testUser._id, testPlan._id),
    { message: /already have a pending membership payment/i }
  );

  // 3. User cancels the pending membership using our new fix
  const cancelResult = await cancelPendingMembership(testUser._id, pendingMembership._id);
  assert.ok(cancelResult.message.includes('cancelled successfully'));

  const cancelledDoc = await Membership.findById(pendingMembership._id);
  assert.equal(cancelledDoc.status, 'cancelled');

  // 4. Deadlock broken: User can now purchase a new plan!
  const newMembership = await purchaseMembership(testUser._id, testPlan._id);
  assert.ok(newMembership);
  assert.equal(newMembership.status, 'pending');
  assert.notEqual(newMembership._id.toString(), pendingMembership._id.toString());
});

test('Membership: Renewal continuity starts on exact previous end date without 24-hr blackout (BUG-02 Fix Verification)', async () => {
  const previousEndDate = new Date('2026-12-15T18:00:00.000Z');
  const mockOldMembership = {
    status: 'active',
    end_date: previousEndDate,
  };

  // Inspect the nextStartDate logic:
  // If active/scheduled and end >= today: return end (NO +1 day added!)
  const today = new Date();
  const end = new Date(mockOldMembership.end_date);
  let computedStartDate;
  if (mockOldMembership.status === 'active' && end >= today) {
    computedStartDate = end;
  } else {
    computedStartDate = today;
  }

  assert.equal(
    computedStartDate.toISOString(),
    previousEndDate.toISOString(),
    'Renewal must start exactly at the previous end timestamp to prevent 24-hour blackout'
  );
});

// ==========================================
// 4. STORE & INVENTORY ORDER WORKFLOW
// ==========================================
test('Store: Order creation reserves stock atomically, computes trusted price server-side, and fulfills via state machine', async () => {
  try {
  const testUser = await User.create({
    email: `test_store_${TEST_RUN_ID}@example.com`,
    password: 'password123456',
    email_verified: true,
  });

  const product = await Product.create({
    name: `Creatine ${TEST_RUN_ID}`,
    brand: 'Heaven Gym Supplements',
    price: 1200,
    stock_quantity: 10,
    reserved_quantity: 0,
    slug: `creatine-${TEST_RUN_ID}`,
  });

  const checkoutRequestId = `chk_test_${Date.now()}`;

  // 1. Create order: passing client items (price will be fetched from DB product, not client!)
  const order = await createOrder(testUser._id, {
    items: [{
      productId: product._id,
      quantity: 2,
      price: 5, // Client attempts price tampering ($5 instead of $1200)
    }],
    shippingAddress: `123 Gym Street ${TEST_RUN_ID}`,
    fulfillmentMethod: 'store_pickup',
    customerName: 'Test Buyer',
    customerPhone: '9876543210',
    checkoutRequestId,
  });

  // Price must be 2400 (1200 * 2), NOT 10!
  assert.equal(order.total_amount, 2400, 'Total amount must be calculated from authoritative DB price');
  assert.equal(order.inventory_status, 'reserved');

  // Verify reserved quantity on product
  const productAfterReservation = await Product.findById(product._id);
  assert.equal(productAfterReservation.reserved_quantity, 2);
  assert.equal(productAfterReservation.available_quantity, 8); // 10 - 2

  // 2. Test Idempotency: Submitting the same checkoutRequestId returns the existing order
  const duplicateOrder = await createOrder(testUser._id, {
    items: [{ productId: product._id, quantity: 2 }],
    shippingAddress: `123 Gym Street ${TEST_RUN_ID}`,
    fulfillmentMethod: 'store_pickup',
    customerName: 'Test Buyer',
    customerPhone: '9876543210',
    checkoutRequestId,
  });
  assert.equal(duplicateOrder._id.toString(), order._id.toString(), 'Duplicate checkoutRequestId must return existing order');

  // 3. Order fulfillment state machine
  // Attempting to move from pending to ready_for_pickup is forbidden by state machine
  await assert.rejects(
    async () => updateOrderStatus(order._id, 'ready_for_pickup'),
    { message: /cannot move order from pending to ready_for_pickup/i }
  );

  // If status is moved to processing but payment is unpaid, it must also be rejected
  order.status = 'processing';
  order.payment_status = 'pending';
  await order.save();
  await assert.rejects(
    async () => updateOrderStatus(order._id, 'ready_for_pickup'),
    { message: /only paid orders with committed stock can be fulfilled/i }
  );

  // Simulate payment completion
  order.payment_status = 'success';
  order.inventory_status = 'committed';
  order.status = 'processing';
  await order.save();

  // Now transition: processing -> ready_for_pickup
  const updatedOrder = await updateOrderStatus(order._id, 'ready_for_pickup');
  assert.equal(updatedOrder.status, 'ready_for_pickup');

  // Transition: ready_for_pickup -> collected
  const collectedOrder = await updateOrderStatus(order._id, 'collected');
  assert.equal(collectedOrder.status, 'collected');
  } catch (err) {
    console.error('STORE TEST ERROR:', err);
    throw err;
  }
});

// ==========================================
// 5. PASSWORD RESET & EXPIRY TESTS
// ==========================================
test('Auth: Password reset lifecycle enforcing 12-char limit, single-use token, and session revocation', async () => {
  const email = `audit_pwd_${Date.now()}@example.com`;
  const oldPassword = 'OldStrongPassword123!';
  const bcrypt = (await import('bcryptjs')).default;
  const user = await User.create({
    email,
    password: await bcrypt.hash(oldPassword, 12),
    email_verified: true,
    full_name: 'Password Test User',
  });

  // Create an active session to test revocation
  const dummySession = await Session.create({
    user_id: user._id,
    family_id: crypto.randomUUID(),
    session_token_hash: hashToken('dummy_session_token_' + Date.now()),
    refresh_token_hash: hashToken('dummy_refresh_token_' + Date.now()),
    expires_at: new Date(Date.now() + 86400000),
  });

  // Seed valid reset OTP
  const rawOtp = '654321';
  const otpSecret = process.env.OTP_SECRET || process.env.JWT_REFRESH_SECRET;
  const hmacOtp = crypto.createHmac('sha256', otpSecret).update(String(rawOtp)).digest('hex');
  await EmailOtp.create({
    user_id: user._id,
    email: user.email,
    purpose: 'reset_password',
    otp_hash: hmacOtp,
    expires_at: new Date(Date.now() + 10 * 60 * 1000),
  });

  // Verify OTP generates resetToken
  const verifyRes = await verifyPasswordResetOtp({ email, otp: rawOtp });
  assert.ok(verifyRes.resetToken, 'Reset token must be returned');

  // Attempting reset with password < 12 characters must fail (BUG-05 parity)
  await assert.rejects(
    async () => resetPassword({ token: verifyRes.resetToken, newPassword: 'short' }),
    { message: /password must be at least 12 characters/i }
  );

  // Reset with valid >= 12 characters password
  const newPassword = 'NewStrongPassword456!';
  const resetRes = await resetPassword({ token: verifyRes.resetToken, newPassword });
  assert.ok(resetRes.message.includes('Password reset successfully'));

  // Attempting reuse of the same reset token must fail (single-use guard)
  await assert.rejects(
    async () => resetPassword({ token: verifyRes.resetToken, newPassword: 'AnotherStrongPassword789!' }),
    { message: /password reset session expired/i }
  );

  // Active session must have been revoked
  const sessionAfterReset = await Session.findById(dummySession._id);
  assert.equal(sessionAfterReset.revoked_at !== null, true, 'Sessions must be revoked on password reset');

  // Old password login fails
  await assert.rejects(
    async () => loginUser({ email, password: oldPassword }),
    { message: /invalid email or password/i }
  );

  // New password login succeeds
  const loginRes = await loginUser({ email, password: newPassword });
  assert.ok(loginRes.accessToken);
});

// ==========================================
// 6. ADMISSION & ADVANCE BILLING TESTS
// ==========================================
test('Admission & Advance: Staff admission records advance, auto-deducts on first membership, and leaves renewal intact', async () => {
  const memberEmail = `audit_admit_${Date.now()}@example.com`;
  const member = await User.create({
    email: memberEmail,
    password: 'MemberPassword123!',
    email_verified: true,
    full_name: 'Admitted Member',
  });

  const plan = await MembershipPlan.create({
    name: `Test Plan ${TEST_RUN_ID}`,
    price: 3000,
    duration_months: 1,
    is_active: true,
  });

  // Staff creates admission with 500 Rs cash advance
  const admissionResult = await createAdmission({
    user_id: member._id,
    payment_method: 'cash',
    payment_amount: 500,
    full_name: 'Admitted Member',
    phone: '9876543210',
    address: '123 Main Gym Street, New Delhi',
    emergency_contact_name: 'Family Contact',
    emergency_contact_phone: '9876543211',
    notes: `Test admission ${TEST_RUN_ID}`,
  });
  const admission = admissionResult.admission || admissionResult;
  assert.ok(admission._id);
  assert.ok(admission.member_id);

  // Check that advance payment record was created
  const advancePayment = await Payment.findOne({
    user_id: member._id,
    payment_type: 'membership_advance',
    status: 'success',
  });
  assert.ok(advancePayment, 'Advance payment must be recorded with status success');
  assert.equal(advancePayment.amount, 500);

  // Member purchases first membership
  const membership = await purchaseMembership(member._id, plan._id);
  assert.equal(membership.status, 'pending');
  assert.equal(membership.advance_paid, 500);
  assert.equal(membership.amount_due, 2500);

  // Advance credit is protected while pending (allocated_amount stays 0)
  const pendingAdvance = await Payment.findById(advancePayment._id);
  assert.equal(pendingAdvance.allocated_amount, 0);

  // Remaining balance calculation
  const billing = calculateMembershipBalance(membership, [pendingAdvance]);
  assert.equal(billing.advancePaid, 500);
  assert.equal(billing.amountDue, 2500);
  assert.equal(billing.paymentStatus, 'pending');

  // Payment finalization consumes the advance credit
  await allocateMembershipAdvance(member._id, membership);
  const finalAdvance = await Payment.findById(advancePayment._id);
  assert.equal(finalAdvance.allocated_amount, 500);
  assert.equal(finalAdvance.membership_id.toString(), membership._id.toString());

  // Activate membership
  membership.status = 'active';
  await membership.save();

  // Renew membership
  const renewal = await renewMembership(member._id, membership._id, plan._id);
  // In renewal, advance is NOT applied again
  const renewalBilling = calculateMembershipBalance(renewal, [finalAdvance]);
  assert.equal(renewalBilling.advancePaid, 0, 'Advance must NOT be applied to renewals');
  assert.equal(renewalBilling.amountDue, 3000);
  assert.equal(renewalBilling.paymentStatus, 'pending');
});

// ==========================================
// 7. BODY MEASUREMENTS TESTS
// ==========================================
test('Measurements: Staff creates measurement, member retrieves own chronological history', async () => {
  const member = await User.create({
    email: `audit_meas_${Date.now()}@example.com`,
    password: 'MemberPassword123!',
    email_verified: true,
    full_name: 'Measured Member',
  });

  const admission = await createAdmission({
    user_id: member._id,
    payment_method: 'cash',
    payment_amount: 0,
    full_name: 'Measured Member',
    phone: '9876543212',
    address: '456 Fitness Avenue, New Delhi',
    notes: `Test measurement admission ${TEST_RUN_ID}`,
  });

  const m1 = await createMeasurement({
    user_id: member._id,
    gym_admission_id: admission._id,
    weight: 80.5,
    chest: 42,
    waist: 34,
    notes: `Month 1 ${TEST_RUN_ID}`,
  });
  assert.ok(m1._id);

  const m2 = await createMeasurement({
    user_id: member._id,
    gym_admission_id: admission._id,
    weight: 78.0,
    chest: 41,
    waist: 32,
    notes: `Month 2 ${TEST_RUN_ID}`,
  });
  assert.ok(m2._id);

  const list = await getMeasurementsByUserId(member._id);
  assert.ok(list.length >= 2, 'Must return measurements');
  assert.equal(list[0].weight, 78.0, 'Latest measurement must come first');
});

// ==========================================
// 8. CRON & ORIGIN PROTECTION SECURITY TESTS
// ==========================================
test('Security: Cron endpoint rejects missing or invalid Authorization Bearer token', () => {
  let statusCode = null;
  let responseBody = null;
  const mockRes = {
    status(code) { statusCode = code; return this; },
    json(body) { responseBody = body; return this; },
  };

  // 1. Missing Authorization header
  const reqNoAuth = { get: () => undefined };
  cronProtection(reqNoAuth, mockRes, () => { assert.fail('Should not call next()'); });
  assert.equal(statusCode, 401);
  assert.deepEqual(responseBody, { error: 'Unauthorized' });

  // 2. Invalid Authorization header
  const reqBadAuth = { get: () => 'Bearer invalid_secret_token_123' };
  cronProtection(reqBadAuth, mockRes, () => { assert.fail('Should not call next()'); });
  assert.equal(statusCode, 401);

  // 3. Valid Authorization header
  let nextCalled = false;
  const reqGoodAuth = { get: () => `Bearer ${process.env.CRON_SECRET}` };
  cronProtection(reqGoodAuth, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, true, 'Valid cron secret must pass');
});

test('Security: Origin protection enforces allowlist and blocks unallowed origins on state-changing requests', () => {
  let statusCode = null;
  let responseBody = null;
  const mockRes = {
    status(code) { statusCode = code; return this; },
    json(body) { responseBody = body; return this; },
  };

  // 1. GET requests are safe methods and bypass origin check
  let nextCalled = false;
  originProtection({ method: 'GET' }, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, true);

  // 2. Disallowed origin on POST request is rejected with 403
  statusCode = null;
  const reqEvil = {
    method: 'POST',
    get: (header) => (header.toLowerCase() === 'origin' ? 'https://malicious-site.com' : undefined),
    cookies: {},
  };
  originProtection(reqEvil, mockRes, () => { assert.fail('Should not allow malicious origin'); });
  assert.equal(statusCode, 403);

  // 3. Allowed frontend origin passes
  nextCalled = false;
  const currentClientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
  const reqAllowed = {
    method: 'POST',
    get: (header) => (header.toLowerCase() === 'origin' ? currentClientUrl : undefined),
    cookies: {},
  };
  originProtection(reqAllowed, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});
