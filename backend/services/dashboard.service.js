import User from '../models/user.model.js';
import GymAdmission from '../models/gymAdmission.model.js';
import Membership from '../models/membership.model.js';
import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import BodyMeasurement from '../models/bodyMeasurement.model.js';
import OfflineSale from '../models/offlineSale.model.js';
import { getMembershipsByUserId } from './membership.service.js';

const TIMEZONE = process.env.GYM_TIMEZONE || 'Asia/Kolkata';
function zonedDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return Object.fromEntries(parts.filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]));
}
function startOfGymDay(date = new Date()) {
  const { year, month, day } = zonedDateParts(date);
  const offset = TIMEZONE === 'Asia/Kolkata' ? '+05:30' : 'Z';
  return new Date(`${year}-${month}-${day}T00:00:00${offset}`);
}
function startOfGymMonth(date = new Date()) {
  const { year, month } = zonedDateParts(date);
  const offset = TIMEZONE === 'Asia/Kolkata' ? '+05:30' : 'Z';
  return new Date(`${year}-${month}-01T00:00:00${offset}`);
}

export async function getAdminStats() {
  const now = new Date();
  const todayStart = startOfGymDay(now);
  const monthStart = startOfGymMonth(now);
  const twoDaysFromNow = new Date(now); twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  const [totalUsers, admittedUsersAgg, activeMemberships, expiredMemberships, totalOrders, pendingOrders, totalProducts, gymRevenueAgg, storeRevenueAgg, offlineStoreRevenueAgg, todayRevenueAgg, todayOfflineRevenueAgg, monthRevenueAgg, monthOfflineRevenueAgg, expiringMemberships, lowStockProducts, recentOrders, recentPayments] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    GymAdmission.aggregate([
      { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $match: { 'user.role': 'user' } },
      { $count: 'total' },
    ]),
    Membership.countDocuments({ status: 'active' }),
    Membership.countDocuments({ status: 'expired' }),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending', payment_status: 'pending' }),
    Product.countDocuments({ is_active: true }),
    Payment.aggregate([{ $match: { status: 'success', payment_type: { $in: ['membership_full', 'membership_advance', 'membership_installment'] } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Payment.aggregate([{ $match: { status: 'success', payment_type: 'order' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    OfflineSale.aggregate([{ $group: { _id: null, total: { $sum: '$total_amount' } } }]),
    Payment.aggregate([{ $match: { status: 'success', payment_date: { $gte: todayStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    OfflineSale.aggregate([{ $match: { createdAt: { $gte: todayStart } } }, { $group: { _id: null, total: { $sum: '$total_amount' } } }]),
    Payment.aggregate([{ $match: { status: 'success', payment_date: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    OfflineSale.aggregate([{ $match: { createdAt: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: '$total_amount' } } }]),
    Membership.find({ status: 'active', end_date: { $gte: now, $lte: twoDaysFromNow } }).populate({ path: 'user_id', select: 'full_name email' }).sort({ end_date: 1 }).limit(5).lean(),
    Product.find({ is_active: true, stock_quantity: { $lte: 10 } }).select('name stock_quantity').sort({ stock_quantity: 1 }).limit(5).lean(),
    Order.find().populate({ path: 'user_id', select: 'full_name email' }).sort({ createdAt: -1 }).limit(5).lean(),
    Payment.find().select('-razorpay_signature').populate({ path: 'user_id', select: 'full_name email' }).sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  const totalAdmitted = admittedUsersAgg[0]?.total || 0;
  const gymRevenue = gymRevenueAgg[0]?.total || 0;
  const storeRevenue = (storeRevenueAgg[0]?.total || 0) + (offlineStoreRevenueAgg[0]?.total || 0);
  const todayRevenue = (todayRevenueAgg[0]?.total || 0) + (todayOfflineRevenueAgg[0]?.total || 0);
  const monthRevenue = (monthRevenueAgg[0]?.total || 0) + (monthOfflineRevenueAgg[0]?.total || 0);
  return {
    stats: { totalUsers, totalAdmitted, notAdmitted: Math.max(0, totalUsers - totalAdmitted), activeMemberships, expiredMemberships, totalOrders, pendingOrders, totalProducts, gymRevenue, storeRevenue, totalRevenue: gymRevenue + storeRevenue, todayRevenue, monthRevenue },
    expiringMemberships, lowStockProducts, recentOrders, recentPayments,
  };
}

// Revenue analytics and user dashboard functions are preserved below.
