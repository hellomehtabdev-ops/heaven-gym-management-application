import { randomBytes } from 'node:crypto';
import GymEquipment from '../models/gymEquipment.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.utils.js';
import { ApiError } from '../utils/errors.utils.js';

const slugify = (value) => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bool = (value) => value === true || value === 'true';

async function generateUniqueSku(category) {
  const categoryCode = slugify(category).split('-').map((part) => part[0]).join('').toUpperCase().slice(0, 5) || 'EQ';
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const sku = `HG-${categoryCode}-${randomBytes(3).toString('hex').toUpperCase()}`;
    if (!await GymEquipment.exists({ sku })) return sku;
  }
  throw new ApiError(500, 'Could not generate a unique equipment SKU. Please try again.');
}

function normalizeBody(body = {}) {
  const price = body.price === '' || body.price == null ? null : Number(body.price);
  if (price !== null && (!Number.isFinite(price) || price < 0)) throw new ApiError(400, 'Enter a valid product price');
  const name = String(body.name || '').trim();
  if (!name) throw new ApiError(400, 'Product name is required');
  return {
    name, brand: String(body.brand || '').trim(), category: String(body.category || 'Strength Equipment').trim(),
    price, price_label: String(body.price_label || '').trim(),
    description: String(body.description || '').trim(),
    availability: ['Available', 'Made to order', 'Enquire for availability'].includes(body.availability) ? body.availability : 'Available',
    is_featured: bool(body.is_featured), is_published: bool(body.is_published),
  };
}

export async function listPublicEquipment(req, res, next) {
  try {
    const { search = '', category = 'all', page = 1, limit = 12 } = req.query;
    const filter = { is_published: true };
    if (category !== 'all') filter.category = category;
    if (String(search).trim()) filter.$text = { $search: String(search).trim() };
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(24, Math.max(1, Number(limit) || 12));
    const [rows, total, categories] = await Promise.all([
      GymEquipment.find(filter).sort({ is_featured: -1, createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
      GymEquipment.countDocuments(filter),
      GymEquipment.distinct('category', { is_published: true }),
    ]);
    res.json({ rows, total, page: safePage, pages: Math.max(1, Math.ceil(total / safeLimit)), categories });
  } catch (error) { next(error); }
}

export async function getPublicEquipmentBySlug(req, res, next) {
  try {
    const product = await GymEquipment.findOne({ slug: req.params.slug, is_published: true }).lean();
    if (!product) return res.status(404).json({ error: 'Equipment not found' });
    res.json(product);
  } catch (error) { next(error); }
}

export async function listAdminEquipment(req, res, next) {
  try {
    const rows = await GymEquipment.find().sort({ createdAt: -1 }).lean();
    res.json({ rows, total: rows.length });
  } catch (error) { next(error); }
}

export async function createEquipment(req, res, next) {
  const uploaded = [];
  try {
    for (const file of req.files || []) uploaded.push(await uploadToCloudinary(file.buffer, 'heaven-gym/equipment'));
    const values = normalizeBody(req.body);
    const slug = `${slugify(values.name) || 'equipment'}-${Date.now().toString(36)}`;
    const sku = await generateUniqueSku(values.category);
    const product = await GymEquipment.create({ ...values, slug, sku, images: uploaded.map((image, index) => ({
      url: image.secure_url, public_id: image.public_id, alt_text: values.name + (index ? ` image ${index + 1}` : ''),
    })) });
    res.status(201).json(product);
  } catch (error) {
    await Promise.all(uploaded.map((image) => deleteFromCloudinary(image.public_id).catch(() => {})));
    next(error);
  }
}

export async function updateEquipment(req, res, next) {
  const uploaded = [];
  try {
    const product = await GymEquipment.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Equipment not found');
    for (const file of req.files || []) uploaded.push(await uploadToCloudinary(file.buffer, 'heaven-gym/equipment'));
    const values = normalizeBody({ ...product.toObject(), ...req.body });
    Object.assign(product, values);
    if (!product.sku) product.sku = await generateUniqueSku(values.category);
    if (uploaded.length) product.images.push(...uploaded.map((image) => ({ url: image.secure_url, public_id: image.public_id, alt_text: values.name })));
    if (req.body.remove_image_ids) {
      const removeIds = String(req.body.remove_image_ids).split(',').filter(Boolean);
      const removed = product.images.filter((image) => removeIds.includes(String(image._id)));
      product.images = product.images.filter((image) => !removeIds.includes(String(image._id)));
      await Promise.all(removed.map((image) => deleteFromCloudinary(image.public_id).catch(() => {})));
    }
    if (product.images.length > 5) throw new ApiError(400, 'A maximum of 5 product photos is allowed');
    await product.save();
    res.json(product);
  } catch (error) {
    await Promise.all(uploaded.map((image) => deleteFromCloudinary(image.public_id).catch(() => {})));
    next(error);
  }
}

export async function deleteEquipment(req, res, next) {
  try {
    const product = await GymEquipment.findByIdAndDelete(req.params.id);
    if (!product) throw new ApiError(404, 'Equipment not found');
    await Promise.all(product.images.map((image) => deleteFromCloudinary(image.public_id).catch(() => {})));
    res.json({ message: 'Equipment removed from catalogue' });
  } catch (error) { next(error); }
}
