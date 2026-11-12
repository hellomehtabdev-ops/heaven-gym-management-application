import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  alt_text: { type: String, trim: true, maxlength: 160, default: '' },
}, { _id: true });

const gymEquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true, trim: true },
  brand: { type: String, trim: true, maxlength: 100, default: '' },
  category: { type: String, trim: true, maxlength: 100, default: 'Strength Equipment' },
  sku: { type: String, trim: true, uppercase: true, maxlength: 60, default: '' },
  price: { type: Number, min: 0, default: null },
  price_label: { type: String, trim: true, maxlength: 80, default: '' },
  description: { type: String, trim: true, maxlength: 6000, default: '' },
  specifications: { type: Map, of: String, default: {} },
  warranty: { type: String, trim: true, maxlength: 120, default: '' },
  availability: { type: String, enum: ['Available', 'Made to order', 'Enquire for availability'], default: 'Available' },
  images: { type: [imageSchema], default: [] },
  is_featured: { type: Boolean, default: false },
  is_published: { type: Boolean, default: false },
}, { timestamps: true });

gymEquipmentSchema.index({ is_published: 1, is_featured: -1, createdAt: -1 });
gymEquipmentSchema.index({ name: 'text', brand: 'text', category: 'text', description: 'text' });

export default mongoose.model('GymEquipment', gymEquipmentSchema);
