import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { connectDB } from '../config/db.config.js';
import User from '../models/user.model.js';
import GymAdmission from '../models/gymAdmission.model.js';
import Membership from '../models/membership.model.js';
import MembershipPlan from '../models/membershipPlan.model.js';
import Payment from '../models/payment.model.js';
import Notification from '../models/notification.model.js';

import {
  purchaseMembership,
  cancelPendingMembership,
  renewMembership,
  getMembershipsByUserId,
  getActivePlans,
  allocateMembershipAdvance,
} from '../services/membership.service.js';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  getAllPayments,
} from '../services/payment.service.js';
import { createAdmission, getMemberOverview } from '../services/admission.service.js';
import { runMembershipExpiry } from '../jobs/membershipExpiry.job.js';
import { cronProtection } from '../middlewares/security.middleware.js';
import { calculateMembershipBalance } from '../utils/membershipBilling.utils.js';

const RUN_ID = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

async function createIsolatedUser(name = 'Audit Test User', role = 'user') {
  return await User.create({
    email: `${RUN_ID}_${Math.random().toString(36).slice(2, 7)}@example.com`,
    password: '$2a$12$e80yq7Kj4Gz/gL91qj0Veuo59.v0R7Yc5f7o2iN2oF0.bI8JzK2Cq', // bcrypt for 'TestPassword@123'
    full_name: name,
    phone: '9876543210',
    role,
    email_verified: true,
    email_verified_at: new Date(),
    is_18_plus: true,
  });
}

async function createAdmissionForUser(user, options = {}) {
  const result = await createAdmission({
    user_id: user._id.toString(),
    full_name: user.full_name || 'Audit Test User',
    phone: '9876543210',
    address: '123 Heaven Gym Lane, South Delhi',
    payment_amount: options.payment_amount || 0,
    payment_method: options.payment_method || (options.payment_amount > 0 ? 'cash' : undefined),
    notes: options.notes || `${RUN_ID} admission`,
  });
  return result.admission;
}

async function getOrCreateStandard5000Plan() {
  let plan = await MembershipPlan.findOne({ name: 'normal plan', price: 5000, is_active: true });
  if (!plan) {
    plan = await MembershipPlan.create({
      name: `Standard 5000 ${RUN_ID}`,
      price: 5000,
      duration_days: 30,
      is_active: true,
      description: 'Test ₹5,000 Plan for Advance Testing',
    });
  }
  return plan;
}

test.before(async () => {
  await connectDB();
});

test.after(async () => {
  await User.deleteMany({ email: new RegExp(RUN_ID) });
  await MembershipPlan.deleteMany({ name: new RegExp(RUN_ID) });
  await Membership.deleteMany({ plan_name_snapshot: new RegExp(RUN_ID) });
  await Payment.deleteMany({ reference_note: new RegExp(RUN_ID) });
  await GymAdmission.deleteMany({ notes: new RegExp(RUN_ID) });
  await Notification.deleteMany({ message: new RegExp(RUN_ID) });
  await mongoose.disconnect();
});

test('Section 3.1: Cancelled checkout marks membership cancelled without activating', async () => {
  const user = await createIsolatedUser('Cancel Member');
  const plan = await getOrCreateStandard5000Plan();
  await createAdmissionForUser(user);
  const pendingMembership = await purchaseMembership(user._id, plan._id);
  assert.equal(pendingMembership.status, 'pending');

  await cancelPendingMembership(user._id, pendingMembership._id);
  const updated = await Membership.findById(pendingMembership._id);
  assert.equal(updated.status, 'cancelled');
});

test('Section 3.2: Failed payment preserves pending status and does not activate membership', async () => {
  const user = await createIsolatedUser('Failed Payment Member');
  const plan = await getOrCreateStandard5000Plan();
  await createAdmissionForUser(user);
  const pendingMembership = await purchaseMembership(user._id, plan._id);

  const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  const payment = await Payment.create({
    user_id: user._id,
    membership_id: pendingMembership._id,
    amount: plan.price,
    payment_type: 'membership_full',
    payment_method: 'online',
    status: 'pending',
    razorpay_order_id: mockOrderId,
  });

  const webhookPayload = {
    event: 'payment.failed',
    payload: {
      payment: {
        entity: {
          id: `pay_${crypto.randomBytes(8).toString('hex')}`,
          order_id: mockOrderId,
          amount: plan.price * 100,
          currency: 'INR',
          error_description: 'Customer cancelled transaction at bank page',
        },
      },
    },
  };
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_razorpay_webhook_secret';
  const rawBody = JSON.stringify(webhookPayload);
  const validWebhookSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

  const webhookRes = await handleRazorpayWebhook(rawBody, validWebhookSig, webhookPayload);
  assert.equal(webhookRes.processed, true);

  const updatedPayment = await Payment.findById(payment._id);
  const updatedMembership = await Membership.findById(pendingMembership._id);
  assert.equal(updatedPayment.status, 'failed');
  assert.equal(updatedMembership.status, 'pending');
  assert.equal(updatedMembership.payment_status, 'pending');
});

test('Section 3.3: Invalid signature rejected with HTTP 400', async () => {
  const user = await createIsolatedUser('Tamper Member');
  let caughtError = null;
  try {
    await verifyRazorpayPayment(user._id, {
      razorpay_order_id: 'order_fake_12345',
      razorpay_payment_id: 'pay_fake_67890',
      razorpay_signature: 'tampered_bad_signature_hex_code_12345',
    });
  } catch (err) {
    caughtError = err;
  }
  assert.ok(caughtError);
  assert.equal(caughtError.statusCode || caughtError.status, 400);
});

test('Section 3.4: Duplicate webhook is strictly idempotent and does not extend duration', async () => {
  const user = await createIsolatedUser('Duplicate Webhook Member');
  const plan = await getOrCreateStandard5000Plan();
  await createAdmissionForUser(user);
  const pendingMembership = await purchaseMembership(user._id, plan._id);

  const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  const mockPayId = `pay_${crypto.randomBytes(8).toString('hex')}`;
  await Payment.create({
    user_id: user._id,
    membership_id: pendingMembership._id,
    amount: plan.price,
    payment_type: 'membership_full',
    payment_method: 'online',
    status: 'pending',
    razorpay_order_id: mockOrderId,
  });

  const capturedWebhookPayload = {
    event: 'payment.captured',
    payload: { payment: { entity: { id: mockPayId, order_id: mockOrderId, amount: plan.price * 100, currency: 'INR' } } },
  };
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_razorpay_webhook_secret';
  const rawBody = JSON.stringify(capturedWebhookPayload);
  const validWebhookSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

  const res1 = await handleRazorpayWebhook(rawBody, validWebhookSig, capturedWebhookPayload);
  assert.equal(res1.processed, true);
  const memAfterFirst = await Membership.findById(pendingMembership._id);
  assert.equal(memAfterFirst.status, 'active');

  const res2 = await handleRazorpayWebhook(rawBody, validWebhookSig, capturedWebhookPayload);
  assert.equal(res2.processed, true);
  const memAfterSecond = await Membership.findById(pendingMembership._id);
  const totalPayments = await Payment.countDocuments({ membership_id: pendingMembership._id });
  assert.equal(totalPayments, 1);
  assert.equal(memAfterSecond.end_date.getTime(), memAfterFirst.end_date.getTime());
});

test('Section 5.1: Renewal before expiry seamlessly continues validity with zero gap', async () => {
  const user = await createIsolatedUser('Early Renewal Member');
  const plan = await getOrCreateStandard5000Plan();
  await createAdmissionForUser(user);

  const activeStart = new Date();
  const activeEnd = new Date(activeStart);
  activeEnd.setDate(activeEnd.getDate() + 10);

  const initialMembership = await Membership.create({
    user_id: user._id,
    plan_id: plan._id,
    plan_name_snapshot: plan.name,
    plan_price_snapshot: plan.price,
    membership_type: 'initial',
    duration_days: 30,
    start_date: activeStart,
    end_date: activeEnd,
    status: 'active',
    payment_status: 'paid',
    amount_due: 0,
  });

  const renewalPending = await renewMembership(user._id, initialMembership._id);
  assert.equal(renewalPending.membership_type, 'renewal');
  assert.equal(renewalPending.start_date.getTime(), activeEnd.getTime());

  const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  const mockPayId = `pay_${crypto.randomBytes(8).toString('hex')}`;
  await Payment.create({
    user_id: user._id,
    membership_id: renewalPending._id,
    amount: plan.price,
    payment_type: 'membership_full',
    payment_method: 'online',
    status: 'pending',
    razorpay_order_id: mockOrderId,
  });

  const webhookPayload = {
    event: 'payment.captured',
    payload: { payment: { entity: { id: mockPayId, order_id: mockOrderId, amount: plan.price * 100, currency: 'INR' } } },
  };
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_razorpay_webhook_secret';
  const rawBody = JSON.stringify(webhookPayload);
  const sig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

  await handleRazorpayWebhook(rawBody, sig, webhookPayload);

  const renewalActivated = await Membership.findById(renewalPending._id);
  assert.equal(renewalActivated.status, 'scheduled');
  assert.equal(renewalActivated.payment_status, 'paid');
  assert.equal(renewalActivated.start_date.getTime(), activeEnd.getTime());

  const expectedRenewalEnd = new Date(activeEnd);
  expectedRenewalEnd.setDate(expectedRenewalEnd.getDate() + 30);
  assert.equal(renewalActivated.end_date.getTime(), expectedRenewalEnd.getTime());
});

test('Section 5.2: Renewal after expiry begins fresh from today', async () => {
  const user = await createIsolatedUser('Expired Renewal Member');
  const plan = await getOrCreateStandard5000Plan();
  await createAdmissionForUser(user);

  const expiredStart = new Date(Date.now() - 35 * 86400000);
  const expiredEnd = new Date(Date.now() - 5 * 86400000);

  const expiredMembership = await Membership.create({
    user_id: user._id,
    plan_id: plan._id,
    plan_name_snapshot: plan.name,
    plan_price_snapshot: plan.price,
    membership_type: 'initial',
    duration_days: 30,
    start_date: expiredStart,
    end_date: expiredEnd,
    status: 'expired',
    payment_status: 'paid',
    amount_due: 0,
  });

  const renewalPending = await renewMembership(user._id, expiredMembership._id);
  assert.equal(renewalPending.membership_type, 'renewal');
  const diffFromToday = Math.abs(renewalPending.start_date.getTime() - Date.now());
  assert.ok(diffFromToday < 60000);
});

test('Section 5.3: Repeated renewal request is blocked with 409', async () => {
  const user = await createIsolatedUser('Repeated Renewal Member');
  const plan = await getOrCreateStandard5000Plan();
  await createAdmissionForUser(user);

  const initialMembership = await Membership.create({
    user_id: user._id,
    plan_id: plan._id,
    plan_name_snapshot: plan.name,
    plan_price_snapshot: plan.price,
    membership_type: 'initial',
    duration_days: 30,
    start_date: new Date(),
    end_date: new Date(Date.now() + 10 * 86400000),
    status: 'active',
    payment_status: 'paid',
    amount_due: 0,
  });

  await renewMembership(user._id, initialMembership._id);
  let duplicateError = null;
  try {
    await renewMembership(user._id, initialMembership._id);
  } catch (e) {
    duplicateError = e;
  }
  assert.ok(duplicateError);
  assert.equal(duplicateError.statusCode || duplicateError.status, 409);
});

test('Section 6: Advance Payment: Plan ₹5000, Advance ₹2000, First payable ₹3000, Renewal ₹5000', async () => {
  const user = await createIsolatedUser('Advance Test Member');
  const plan = await getOrCreateStandard5000Plan();

  // 1. Admission with ₹2,000 advance
  const admission = await createAdmissionForUser(user, { payment_amount: 2000 });
  assert.ok(admission._id);

  const advancePayment = await Payment.findOne({ user_id: user._id, payment_type: 'membership_advance' });
  assert.ok(advancePayment);
  assert.equal(advancePayment.amount, 2000);
  assert.equal(advancePayment.allocated_amount, 0);

  // 2. Query available plans: Plan ₹5,000 - Advance ₹2,000 = Payable ₹3,000
  const availablePlans = await getActivePlans(user._id);
  const planItem = availablePlans.find((p) => String(p._id) === String(plan._id));
  assert.equal(planItem.price, 5000);
  assert.equal(planItem.advance_credit, 2000);
  assert.equal(planItem.payable_price, 3000);

  // 3. Member purchases plan
  const pendingPurchase = await purchaseMembership(user._id, plan._id);
  assert.equal(pendingPurchase.plan_price_snapshot, 5000);
  assert.equal(pendingPurchase.advance_paid, 2000);
  assert.equal(pendingPurchase.amount_due, 3000);
  assert.equal(pendingPurchase.payment_status, 'pending');

  // Verify advance not prematurely allocated
  const checkAdvancePending = await Payment.findById(advancePayment._id);
  assert.equal(checkAdvancePending.allocated_amount, 0);

  // 4. Pay remaining ₹3,000
  const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  const mockPayId = `pay_${crypto.randomBytes(8).toString('hex')}`;
  await Payment.create({
    user_id: user._id,
    membership_id: pendingPurchase._id,
    amount: 3000,
    payment_type: 'membership_installment',
    payment_method: 'online',
    status: 'pending',
    razorpay_order_id: mockOrderId,
  });

  const webhookPayload = {
    event: 'payment.captured',
    payload: { payment: { entity: { id: mockPayId, order_id: mockOrderId, amount: 3000 * 100, currency: 'INR' } } },
  };
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_razorpay_webhook_secret';
  const rawBody = JSON.stringify(webhookPayload);
  const sig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

  await handleRazorpayWebhook(rawBody, sig, webhookPayload);

  // 5. Verify membership activated, advance marked applied
  const activatedMembership = await Membership.findById(pendingPurchase._id);
  assert.equal(activatedMembership.status, 'active');
  assert.equal(activatedMembership.payment_status, 'paid');
  assert.equal(activatedMembership.advance_paid, 2000);
  assert.equal(activatedMembership.amount_due, 0);

  const checkAdvancePaid = await Payment.findById(advancePayment._id);
  assert.equal(checkAdvancePaid.allocated_amount, 2000);

  // 6. Renewal does not reuse advance
  const plansAfterFirst = await getActivePlans(user._id);
  const planItemAfter = plansAfterFirst.find((p) => String(p._id) === String(plan._id));
  assert.equal(planItemAfter.advance_credit, 0);
  assert.equal(planItemAfter.payable_price, 5000);

  const renewalMembership = await renewMembership(user._id, activatedMembership._id);
  assert.equal(renewalMembership.advance_paid, 0);
  assert.equal(renewalMembership.amount_due, 5000);
});

test('Section 6.2: Failed payment does not consume advance credit', async () => {
  const user = await createIsolatedUser('Failed Advance Member');
  const plan = await getOrCreateStandard5000Plan();
  await createAdmissionForUser(user, { payment_amount: 2000 });
  const advanceRecord = await Payment.findOne({ user_id: user._id, payment_type: 'membership_advance' });
  assert.equal(advanceRecord.allocated_amount, 0);

  const pendingPurchase = await purchaseMembership(user._id, plan._id);
  assert.equal(pendingPurchase.amount_due, 3000);

  await cancelPendingMembership(user._id, pendingPurchase._id);

  const recheckAdvance = await Payment.findById(advanceRecord._id);
  assert.equal(recheckAdvance.allocated_amount, 0);

  const plansRecheck = await getActivePlans(user._id);
  const planRechecked = plansRecheck.find((p) => String(p._id) === String(plan._id));
  assert.equal(planRechecked.advance_credit, 2000);
});

test('Section 7: Admin Workflow: Admission, overview, payments, revenue statistics', async () => {
  const memberUser = await createIsolatedUser('Admin Managed Member', 'user');
  const admission = await createAdmissionForUser(memberUser, { payment_amount: 1500 });
  assert.ok(admission._id);
  assert.equal(admission.member_id.startsWith('GYM-'), true);

  const overview = await getMemberOverview(memberUser._id.toString());
  assert.equal(overview.user.email, memberUser.email);
  assert.equal(overview.admission.member_id, admission.member_id);
  assert.equal(overview.payments.length, 1);

  const adminPayments = await getAllPayments({ page: 1, limit: 10 });
  assert.ok(adminPayments.summary);
  assert.ok(typeof adminPayments.summary.gymRevenue === 'number');
  assert.ok(typeof adminPayments.summary.totalTransactions === 'number');
});

test('Section 8: Database Consistency: Exactly one activation, zero duplicate active records, zero orphan transactions', async () => {
  const user = await createIsolatedUser('Consistency Member');
  const plan = await getOrCreateStandard5000Plan();
  await createAdmissionForUser(user);

  const membership = await purchaseMembership(user._id, plan._id);
  const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  const mockPayId = `pay_${crypto.randomBytes(8).toString('hex')}`;

  const payment = await Payment.create({
    user_id: user._id,
    membership_id: membership._id,
    amount: plan.price,
    payment_type: 'membership_full',
    payment_method: 'online',
    status: 'pending',
    razorpay_order_id: mockOrderId,
  });

  const webhookPayload = {
    event: 'payment.captured',
    payload: { payment: { entity: { id: mockPayId, order_id: mockOrderId, amount: plan.price * 100, currency: 'INR' } } },
  };
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_razorpay_webhook_secret';
  const rawBody = JSON.stringify(webhookPayload);
  const sig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

  await handleRazorpayWebhook(rawBody, sig, webhookPayload);

  const activeCount = await Membership.countDocuments({ user_id: user._id, status: 'active' });
  assert.equal(activeCount, 1);

  const paymentCount = await Payment.countDocuments({ razorpay_order_id: mockOrderId });
  assert.equal(paymentCount, 1);

  const savedPayment = await Payment.findById(payment._id);
  assert.equal(savedPayment.status, 'success');
  assert.equal(savedPayment.razorpay_payment_id, mockPayId);
  assert.equal(String(savedPayment.membership_id), String(membership._id));
});

test('Section 9: Cron Authentication and Membership Expiry execution', async () => {
  const cronSecret = process.env.CRON_SECRET;
  assert.ok(cronSecret && cronSecret.length >= 16);

  let statusMissing = null;
  let statusInvalid = null;
  let acceptedValid = false;

  const mockResMissing = { status: (code) => { statusMissing = code; return { json: () => {} }; } };
  cronProtection({ headers: {}, get: () => undefined }, mockResMissing, () => {});
  assert.equal(statusMissing, 401);

  const mockResInvalid = { status: (code) => { statusInvalid = code; return { json: () => {} }; } };
  cronProtection({ headers: { authorization: 'Bearer invalid_secret' }, get: () => 'Bearer invalid_secret' }, mockResInvalid, () => {});
  assert.equal(statusInvalid, 401);

  const mockResValid = { status: () => ({ json: () => {} }) };
  cronProtection({ headers: { authorization: `Bearer ${cronSecret}` }, get: () => `Bearer ${cronSecret}` }, mockResValid, () => {
    acceptedValid = true;
  });
  assert.ok(acceptedValid);

  const expiryResult = await runMembershipExpiry();
  assert.ok(expiryResult);
  assert.ok(typeof expiryResult.expired === 'number');
  assert.ok(typeof expiryResult.activated === 'number');
  assert.ok(typeof expiryResult.released === 'number');
});
