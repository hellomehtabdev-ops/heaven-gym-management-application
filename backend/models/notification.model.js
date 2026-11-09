import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, default: '', trim: true, maxlength: 1000 },
  type: { type: String, default: 'general' },
  is_read: { type: Boolean, default: false },
  related_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  related_type: { type: String, default: '' },
}, { timestamps: true });

notificationSchema.index({ user_id: 1 });
notificationSchema.index(
  { user_id: 1, related_id: 1, related_type: 1 },
  { unique: true, partialFilterExpression: { related_type: 'membership_expiry', related_id: { $type: 'objectId' } } },
);

export default mongoose.model('Notification', notificationSchema);
