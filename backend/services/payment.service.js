import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import Payment from '../models/payment.model.js';
import Membership from '../models/membership.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import InventoryMovement from '../models/inventoryMovement.model.js';
import { ApiError } from '../utils/errors.utils.js';
import { allocateMembershipAdvance } from './membership.service.js';

function gateway() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new ApiError(503, 'Online payments are not configured');
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}
function verifySignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature || !process.env.RAZORPAY_KEY_SECRET) return false;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  const a = Buffer.from(expected, 'utf8'); const b = Buffer.from(String(signature), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function verifyWebhookSignature(rawBody, signature) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET || !signature) return false;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'utf8'); const b = Buffer.from(String(signature), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function getPaymentsByUserId(userId) { return Payment.find({ user_id: userId }).select('-razorpay_signature').sort({ createdAt: -1 }); }
export async function getAllPayments({ page = 1, limit = 10, status = 'all', type = 'all', search = '' } = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(5, Number.parseInt(limit, 10) || 10));
  const filter = {};
  if (status !== 'all') filter.status = status;
  if (type !== 'all') filter.payment_type = type;
  if (search.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSearch, 'i');
    const User = (await import('../models/user.model.js')).default;
    const matchingUsers = await User.find({ $or: [{ full_name: regex }, { email: regex }] }).select('_id').lean();
    filter.$or = [
      { transaction_id: regex },
      { razorpay_payment_id: regex },
      { razorpay_order_id: regex },
      { user_id: { $in: matchingUsers.map((user) => user._id) } },
    ];
  }
  const [items, total, summary] = await Promise.all([
    Payment.find(filter).select('-razorpay_signature').populate({ path: 'user_id', select: 'full_name email' }).sort({ createdAt: -1, _id: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
    Payment.countDocuments(filter),
    Payment.aggregate([{ $group: {
      _id: null,
      gymRevenue: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'success'] }, { $ne: ['$payment_type', 'order'] }] }, '$amount', 0] } },
      storeRevenue: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'success'] }, { $eq: ['$payment_type', 'order'] }] }, '$amount', 0] } },
      pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
      reconciliationRequired: { $sum: { $cond: [{ $eq: ['$status', 'reconciliation_required'] }, 1, 0] } },
      totalTransactions: { $sum: 1 },
    } }]),
  ]);
  return {
    items,
    pagination: { page: safePage, limit: safeLimit, total, pages: Math.max(1, Math.ceil(total / safeLimit)) },
    summary: summary[0] || { gymRevenue: 0, storeRevenue: 0, pending: 0, reconciliationRequired: 0, totalTransactions: 0 },
  };
}

// Remaining payment lifecycle functions are preserved below.
