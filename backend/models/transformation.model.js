import mongoose from 'mongoose';

const transformationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, trim: true, maxlength: 100, default: 'Body Transformation' },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    duration: { type: String, trim: true, maxlength: 100, default: '' },
    achievement: { type: String, trim: true, maxlength: 2000, default: '' },
    story: { type: String, trim: true, maxlength: 4000, default: '' },
    before_image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    after_image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    member_consent_obtained: { type: Boolean, default: false, index: true },
    consent_confirmed_at: { type: Date, default: null },
    consent_notes: { type: String, trim: true, maxlength: 500, default: '' },
    is_published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

transformationSchema.pre('save', function (next) {
  if (!this.member_consent_obtained) {
    this.is_published = false;
    this.consent_confirmed_at = null;
  }
  if (typeof next === 'function') next();
});

transformationSchema.index({ is_published: 1, createdAt: -1 });

export default mongoose.model('Transformation', transformationSchema);
