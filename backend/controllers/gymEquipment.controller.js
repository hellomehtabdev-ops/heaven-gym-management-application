import mongoose from 'mongoose';
import GymEquipment from '../models/gymEquipment.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.utils.js';
import { ApiError } from '../utils/errors.utils.js';

const PUBLIC_EQUIPMENT_PROJECTION = '_id name slug sku brand category price compare_at_price price_label offer_label description availability images.url images.alt_text is_featured';

const slugify = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const asBoolean = (value) => value === true || value === 'true';

export async function listPublicEquipment(req, res, next) {
  try {
    const { search = '', category = 'all', page = 1, limit = 12 } = req.query;
    const filter = { is_published: true };
    if (category !== 'all') filter.category = category;
    const normalizedSearch = String(search).trim().slice(0, 100);
    if (normalizedSearch) filter.$text = { $search: normalizedSearch };
    const requestedPage = Number(page);
    const requestedLimit = Number(limit);
    const safePage = Number.isFinite(requestedPage) ? Math.max(1, Math.floor(requestedPage)) : 1;
    const safeLimit = Number.isFinite(requestedLimit) ? Math.min(24, Math.max(1, Math.floor(requestedLimit))) : 12;
    const [rows, total, categories] = await Promise.all([
      GymEquipment.find(filter).select(PUBLIC_EQUIPMENT_PROJECTION).sort({ is_featured: -1, createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
      GymEquipment.countDocuments(filter),
      GymEquipment.distinct('category', { is_published: true }),
    ]);
    res.json({ rows, total, page: safePage, pages: Math.max(1, Math.ceil(total / safeLimit)), categories });
  } catch (error) { next(error); }
}

export async function getPublicEquipmentBySlug(req, res, next) {
  try {
    const product = await GymEquipment.findOne({ slug: req.params.slug, is_published: true }).select(PUBLIC_EQUIPMENT_PROJECTION).lean();
    if (!product) return res.status(404).json({ error: 'Equipment not found' });
    res.json(product);
  } catch (error) { next(error); }
}

export async function listAdminEquipment(req, res, next) {
  try {
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Math.floor(Number(req.query.limit) || 20)));
    const filter = {};
    if (req.query.status === 'published') filter.is_published = true;
    if (req.query.status === 'draft') filter.is_published = false;
    const search = String(req.query.search || '').trim().slice(0, 100);
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = ['name', 'brand', 'sku', 'category'].map((field) => ({ [field]: { $regex: escaped, $options: 'i' } }));
    }
    const [rows, total] = await Promise.all([
      GymEquipment.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      GymEquipment.countDocuments(filter),
    ]);
    res.json({ rows, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) { next(error); }
}

function parseEquipment(body) {
  const name = String(body.name || '').trim();
  const sku = String(body.sku || '').trim().toUpperCase();
  if (!name || !sku) throw new ApiError(400, 'Equipment name and SKU are required');
  const price = body.price === '' || body.price == null ? null : Number(body.price);
  const compareAt = body.compare_at_price === '' || body.compare_at_price == null ? null : Number(body.compare_at_price);
  if (price !== null && (!Number.isFinite(price) || price < 0)) throw new ApiError(400, 'Enter a valid price');
  if (compareAt !== null && (!Number.isFinite(compareAt) || compareAt < 0)) throw new ApiError(400, 'Enter a valid comparison price');
  if (price !== null && compareAt !== null && compareAt < price) throw new ApiError(400, 'Compare-at price must be equal to or higher than price');
  return {
    name, sku, slug: slugify(body.slug || name),
    brand: String(body.brand || '').trim(), category: String(body.category || 'Strength Equipment').trim(),
    price, compare_at_price: compareAt, price_label: String(body.price_label || '').trim(),
    offer_label: String(body.offer_label || '').trim(), description: String(body.description || '').trim(),
    availability: ['Available', 'Made to order', 'Enquire for availability'].includes(body.availability) ? body.availability : 'Available',
    is_featured: asBoolean(body.is_featured), is_published: asBoolean(body.is_published),
  };
}

export async function createAdminEquipment(req, res, next) {
  const uploaded = [];
  try {
    const data = parseEquipment(req.body);
    if (!data.slug) throw new ApiError(400, 'Enter a valid equipment name or slug');
    for (const file of req.files || []) uploaded.push(await uploadToCloudinary(file.buffer, 'heaven-gym/equipment'));
    data.images = uploaded.map((image, index) => ({ url: image.secure_url, public_id: image.public_id, alt_text: String(req.body.name || '').trim() }));
    const created = await GymEquipment.create(data);
    res.status(201).json(created);
  } catch (error) {
    await Promise.all(uploaded.map((image) => deleteFromCloudinary(image.public_id).catch(() => {})));
    if (error?.code === 11000) return next(new ApiError(409, 'Equipment slug or SKU already exists'));
    next(error);
  }
}

export async function updateAdminEquipment(req, res, next) {
  const uploaded = [];
  try {
    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Equipment not found');
    const existing = await GymEquipment.findById(req.params.id);
    if (!existing) throw new ApiError(404, 'Equipment not found');
    const data = parseEquipment(req.body);
    for (const file of req.files || []) uploaded.push(await uploadToCloudinary(file.buffer, 'heaven-gym/equipment'));
    if (uploaded.length) {
      data.images = [...existing.images, ...uploaded.map((image) => ({ url: image.secure_url, public_id: image.public_id, alt_text: data.name }))];
    }
    Object.assign(existing, data);
    await existing.save();
    res.json(existing);
  } catch (error) {
    await Promise.all(uploaded.map((image) => deleteFromCloudinary(image.public_id).catch(() => {})));
    if (error?.code === 11000) return next(new ApiError(409, 'Equipment slug or SKU already exists'));
    next(error);
  }
}

export async function deleteAdminEquipment(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Equipment not found');
    const equipment = await GymEquipment.findByIdAndDelete(req.params.id);
    if (!equipment) throw new ApiError(404, 'Equipment not found');
    await Promise.all((equipment.images || []).map((image) => deleteFromCloudinary(image.public_id).catch(() => {})));
    res.json({ message: 'Equipment deleted' });
  } catch (error) { next(error); }
}
