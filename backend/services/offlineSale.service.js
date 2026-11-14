import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import OfflineSale from '../models/offlineSale.model.js';
import InventoryMovement from '../models/inventoryMovement.model.js';
import { ApiError } from '../utils/errors.utils.js';

function createBillNumber() {
  const stamp = Date.now().toString().slice(-8);
  const random = String(Math.floor(Math.random() * 900) + 100);
  return `HG-OFF-${stamp}-${random}`;
}

export async function listOfflineSales({ search = '', page = 1, limit = 20, from = '', to = '' } = {}) {
  const safePage = Math.max(1, Math.floor(Number(page) || 1));
  const safeLimit = Math.min(100, Math.max(1, Math.floor(Number(limit) || 20)));
  const filter = {};
  const term = String(search).trim().slice(0, 100);
  if (term) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { bill_number: { $regex: escaped, $options: 'i' } },
      { customer_name: { $regex: escaped, $options: 'i' } },
      { customer_phone: { $regex: escaped, $options: 'i' } },
    ];
  }
  if (from || to) {
    filter.createdAt = {};
    if (from && !Number.isNaN(Date.parse(from))) filter.createdAt.$gte = new Date(from);
    if (to && !Number.isNaN(Date.parse(to))) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
    if (!Object.keys(filter.createdAt).length) delete filter.createdAt;
  }
  const [rows, total, totals] = await Promise.all([
    OfflineSale.find(filter).select('bill_number customer_name customer_phone payment_method total_amount sold_by createdAt').populate('sold_by', 'full_name').sort({ createdAt: -1, _id: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
    OfflineSale.countDocuments(filter),
    OfflineSale.aggregate([{ $match: filter }, { $group: { _id: null, revenue: { $sum: '$total_amount' }, count: { $sum: 1 } } }]),
  ]);
  return { rows, total, page: safePage, limit: safeLimit, pages: Math.max(1, Math.ceil(total / safeLimit)), summary: totals[0] || { revenue: 0, count: 0 } };
}

export async function getOfflineSaleById(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'Bill not found');
  const sale = await OfflineSale.findById(id).populate('sold_by', 'full_name');
  if (!sale) throw new ApiError(404, 'Bill not found');
  return sale;
}

export async function createOfflineSale({ items, customerName = '', customerPhone = '', paymentMethod = 'cash', performedBy }) {
  if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, 'Select at least one supplement');
  if (!['cash', 'upi', 'card', 'other'].includes(paymentMethod)) throw new ApiError(400, 'Choose a valid payment method');
  const quantities = new Map();
  for (const item of items) {
    const productId = String(item.productId || item.product_id || '');
    const quantity = Number(item.quantity);
    if (!mongoose.isValidObjectId(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) throw new ApiError(400, 'Each selected supplement must have a valid quantity');
    quantities.set(productId, (quantities.get(productId) || 0) + quantity);
  }
  const session = await mongoose.startSession();
  let createdSale;
  try {
    await session.withTransaction(async () => {
      const saleItems = [];
      const movements = [];
      let totalAmount = 0;
      for (const [productId, quantity] of quantities) {
        const product = await Product.findOneAndUpdate({ _id: productId, is_active: true, is_deleted: { $ne: true }, $expr: { $gte: [{ $subtract: ['$stock_quantity', '$reserved_quantity'] }, quantity] } }, { $inc: { stock_quantity: -quantity } }, { new: false, session });
        if (!product) throw new ApiError(409, 'A selected supplement is unavailable or has insufficient stock. Refresh the store and try again.');
        const subtotal = Number(product.price) * quantity;
        totalAmount += subtotal;
        saleItems.push({ product_id: product._id, product_name_snapshot: product.name, product_sku_snapshot: product.sku || '', product_price_snapshot: product.price, quantity, subtotal });
        movements.push({ product_id: product._id, movement_type: 'offline_sale', quantity: -quantity, stock_before: product.stock_quantity, stock_after: product.stock_quantity - quantity, reserved_before: product.reserved_quantity, reserved_after: product.reserved_quantity, reason: 'Offline counter sale', performed_by: performedBy || null });
      }
      const [sale] = await OfflineSale.create([{ bill_number: createBillNumber(), customer_name: String(customerName).trim().slice(0, 120), customer_phone: String(customerPhone).trim().slice(0, 20), payment_method: paymentMethod, items: saleItems, total_amount: totalAmount, sold_by: performedBy || null }], { session });
      for (const movement of movements) { movement.reason = `Offline counter sale ${sale.bill_number}`; movement.reference_id = sale._id; }
      await InventoryMovement.insertMany(movements, { session });
      createdSale = sale;
    });
    return createdSale;
  } finally { await session.endSession(); }
}
