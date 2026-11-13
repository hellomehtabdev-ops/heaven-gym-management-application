import GymEquipment from '../models/gymEquipment.model.js';

const PUBLIC_EQUIPMENT_PROJECTION = '_id name slug sku brand category price compare_at_price price_label offer_label description availability images.url images.alt_text is_featured';

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
