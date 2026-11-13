import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Check,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { transformationService } from '@/services/transformationService';
import BeforeAfterSlider from '@/components/public/BeforeAfterSlider';

const blank = {
  title: '',
  category: 'Body Transformation',
  duration: '',
  achievement: '',
  story: '',
  description: '',
  is_published: true,
};

const CATEGORIES = [
  'Body Transformation',
  'Fat Loss & Conditioning',
  'Muscle Hypertrophy',
  'Strength & Powerlifting',
  'Functional Athleticism',
  'Postural & Injury Rehabilitation',
];

export default function AdminTransformations() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(blank);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const beforePreviewUrl = useMemo(
    () => (beforeFile ? URL.createObjectURL(beforeFile) : null),
    [beforeFile]
  );
  const afterPreviewUrl = useMemo(
    () => (afterFile ? URL.createObjectURL(afterFile) : null),
    [afterFile]
  );

  useEffect(() => {
    return () => {
      if (beforePreviewUrl) URL.revokeObjectURL(beforePreviewUrl);
      if (afterPreviewUrl) URL.revokeObjectURL(afterPreviewUrl);
    };
  }, [beforePreviewUrl, afterPreviewUrl]);

  const load = () => {
    return transformationService
      .getAdminTransformations()
      .then((data) => setRows(data.rows || []))
      .catch(() => setError('Could not load transformations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm({ ...blank });
    setBeforeFile(null);
    setAfterFile(null);
    setError('');
    setOpen(true);
  };

  const startEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title || '',
      category: item.category || 'Body Transformation',
      duration: item.duration || '',
      achievement: item.achievement || '',
      story: item.story || '',
      description: item.description || '',
      is_published: !!item.is_published,
    });
    setBeforeFile(null);
    setAfterFile(null);
    setError('');
    setOpen(true);
  };

  const change = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const currentEditingItem = editing ? rows.find((r) => r._id === editing) : null;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!editing && (!beforeFile || !afterFile)) {
        throw new Error('Please select both a BEFORE image and an AFTER image.');
      }

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('duration', form.duration || '');
      formData.append('achievement', form.achievement || '');
      formData.append('story', form.story || '');
      formData.append('is_published', form.is_published ? 'true' : 'false');

      if (beforeFile) formData.append('before_image', beforeFile);
      if (afterFile) formData.append('after_image', afterFile);

      if (editing) {
        await transformationService.updateTransformation(editing, formData);
      } else {
        await transformationService.createTransformation(formData);
      }

      setOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not save transformation.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(item) {
    try {
      await transformationService.togglePublish(item._id, !item.is_published);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update publish status.');
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete transformation "${item.title}"? This cannot be undone.`)) return;
    try {
      await transformationService.deleteTransformation(item._id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete transformation.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-brand-500">
            <Sparkles size={13} />
            Showcase Management
          </div>
          <h1 className="mt-2 text-2xl font-black text-ink-900 dark:text-white">
            Transformation Management
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-surface-500 dark:text-slate-400">
            Upload BEFORE and AFTER images and publish them directly to the public Heaven Gym website.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 active:scale-95"
        >
          <Plus size={16} /> New Transformation
        </button>
      </div>

      {error && !open && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Total Transformations', rows.length],
          ['Published on Website', rows.filter((r) => r.is_published).length],
          ['Draft / Unpublished', rows.filter((r) => !r.is_published).length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-white/10 dark:bg-[#151c27]"
          >
            <p className="text-xs text-surface-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-ink-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Grid of Transformations */}
      {loading ? (
        <div className="rounded-2xl bg-white p-16 text-center dark:bg-[#151c27]">
          <Loader2 className="mx-auto animate-spin text-brand-500" size={32} />
          <p className="mt-3 text-sm font-semibold text-surface-500">Loading transformations...</p>
        </div>
      ) : rows.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((item) => (
            <article
              key={item._id}
              className="group overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#151c27]"
            >
              {/* Dual image preview thumbnail */}
              <div className="relative aspect-[16/10] bg-surface-900 overflow-hidden">
                <div className="grid grid-cols-2 h-full">
                  <div className="relative border-r border-white/10">
                    <img
                      src={item.before_image?.url}
                      alt="Before"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono font-bold text-surface-300 backdrop-blur-sm">
                      BEFORE
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={item.after_image?.url}
                      alt="After"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 rounded bg-brand-500/90 px-2 py-0.5 text-[10px] font-mono font-bold text-white backdrop-blur-sm">
                      AFTER
                    </span>
                  </div>
                </div>

                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      item.is_published
                        ? 'bg-emerald-500/90 text-white shadow-sm shadow-emerald-500/30'
                        : 'bg-black/75 text-surface-300'
                    }`}
                  >
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                  {item.duration && (
                    <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-mono font-semibold text-white backdrop-blur-md">
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Content info */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-500">
                    {item.category}
                  </span>

                </div>

                <h2 className="mt-1 text-base font-extrabold text-ink-900 dark:text-white line-clamp-1">
                  {item.title}
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-surface-500 dark:text-slate-400 line-clamp-2">
                  {item.description}
                </p>

                {item.achievement && (
                  <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 line-clamp-1">
                    ★ {item.achievement}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-surface-200 pt-4 dark:border-white/10">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-2.5 py-1.5 text-xs font-bold text-surface-700 hover:bg-surface-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    title="Interactive Slider Preview"
                  >
                    <SlidersHorizontal size={13} /> Preview
                  </button>

                  <button
                    onClick={() => startEdit(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-2.5 py-1.5 text-xs font-bold text-surface-700 hover:bg-surface-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  >
                    <Edit3 size={13} /> Edit
                  </button>

                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                      item.is_published
                        ? 'border-amber-500/30 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400'
                        : 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400'
                    }`}
                  >
                    {item.is_published ? <EyeOff size={13} /> : <Eye size={13} />}
                    {item.is_published ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/10 dark:text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-surface-300 py-16 text-center dark:border-white/15">
          <Award className="mx-auto text-surface-400" size={36} />
          <p className="mt-3 text-base font-bold text-ink-900 dark:text-white">
            No transformations added yet
          </p>
          <p className="mt-1 text-sm text-surface-500 dark:text-slate-400">
            Create your first member before & after transformation to showcase on the public website.
          </p>
          <button
            onClick={startCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
          >
            <Plus size={14} /> Add Transformation
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-6">
          <form
            onSubmit={handleSave}
            className="my-auto w-full max-w-3xl rounded-2xl border border-surface-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111923]"
          >
            <div className="flex items-center justify-between border-b border-surface-200 p-5 dark:border-white/10">
              <div>
                <h2 className="text-lg font-black text-ink-900 dark:text-white">
                  {editing ? 'Edit Transformation' : 'New Body Transformation'}
                </h2>
                <p className="mt-0.5 text-xs text-surface-500 dark:text-slate-400">
                  Both BEFORE and AFTER images are saved within the same record
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 hover:text-ink-900 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="m-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {/* Title */}
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-ink-900 dark:text-white">
                  Title / Member Name <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  placeholder="e.g. Arjun Sharma — 12-Month Physique Recomposition"
                  value={form.title}
                  onChange={(e) => change('title', e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:focus:border-brand-500 text-ink-900 dark:text-white"
                />
              </label>

              {/* Category */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-900 dark:text-white">
                  Category
                </span>
                <select
                  value={form.category}
                  onChange={(e) => change('category', e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-[#0b111a] text-ink-900 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="dark:bg-[#111923]">
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              {/* Duration */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-900 dark:text-white">
                  Duration <span className="font-normal text-surface-400">(optional)</span>
                </span>
                <input
                  placeholder="e.g. 6 Months, 14 Weeks, 1 Year"
                  value={form.duration}
                  onChange={(e) => change('duration', e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/10 text-ink-900 dark:text-white"
                />
              </label>

              {/* Achievement */}
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-ink-900 dark:text-white">
                  Key Achievement or Milestone <span className="font-normal text-surface-400">(optional)</span>
                </span>
                <input
                  placeholder="e.g. Lost 14kg body fat, gained 4kg muscle, +45kg deadlift"
                  value={form.achievement}
                  onChange={(e) => change('achievement', e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/10 text-ink-900 dark:text-white"
                />
              </label>

              {/* Description */}
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-ink-900 dark:text-white">
                  Summary / Overview <span className="text-red-500">*</span>
                </span>
                <textarea
                  required
                  rows="3"
                  placeholder="Short description of the training plan, dedication, and journey..."
                  value={form.description}
                  onChange={(e) => change('description', e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/10 text-ink-900 dark:text-white"
                />
              </label>

              {/* Detailed Story */}
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-ink-900 dark:text-white">
                  Member Story / Quote <span className="font-normal text-surface-400">(optional)</span>
                </span>
                <textarea
                  rows="2"
                  placeholder="Personal quote or testimonial from the member about their training experience..."
                  value={form.story}
                  onChange={(e) => change('story', e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/10 text-ink-900 dark:text-white"
                />
              </label>

              {/* Before Image Upload Box */}
              <div className="rounded-xl border border-surface-200 p-4 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300">
                    1. BEFORE Image {!editing && <span className="text-red-500">*</span>}
                  </span>
                  {currentEditingItem?.before_image?.url && !beforePreviewUrl && (
                    <span className="text-[10px] text-emerald-500 font-bold">Existing uploaded</span>
                  )}
                </div>

                <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-surface-100 dark:bg-black/30 border border-dashed border-surface-300 dark:border-white/15 flex flex-col items-center justify-center p-3 text-center">
                  {beforePreviewUrl ? (
                    <img
                      src={beforePreviewUrl}
                      alt="New Before Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : currentEditingItem?.before_image?.url ? (
                    <img
                      src={currentEditingItem.before_image.url}
                      alt="Current Before"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="p-3">
                      <UploadCloud className="mx-auto text-surface-400" size={28} />
                      <p className="mt-1 text-xs font-medium text-surface-500">
                        Select JPG, PNG or WEBP (Max 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required={!editing && !currentEditingItem?.before_image?.url}
                    onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {beforeFile && (
                  <p className="mt-1 text-[11px] text-brand-500 truncate">{beforeFile.name}</p>
                )}
              </div>

              {/* After Image Upload Box */}
              <div className="rounded-xl border border-surface-200 p-4 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300">
                    2. AFTER Image {!editing && <span className="text-red-500">*</span>}
                  </span>
                  {currentEditingItem?.after_image?.url && !afterPreviewUrl && (
                    <span className="text-[10px] text-emerald-500 font-bold">Existing uploaded</span>
                  )}
                </div>

                <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-surface-100 dark:bg-black/30 border border-dashed border-surface-300 dark:border-white/15 flex flex-col items-center justify-center p-3 text-center">
                  {afterPreviewUrl ? (
                    <img
                      src={afterPreviewUrl}
                      alt="New After Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : currentEditingItem?.after_image?.url ? (
                    <img
                      src={currentEditingItem.after_image.url}
                      alt="Current After"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="p-3">
                      <UploadCloud className="mx-auto text-surface-400" size={28} />
                      <p className="mt-1 text-xs font-medium text-surface-500">
                        Select JPG, PNG or WEBP (Max 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required={!editing && !currentEditingItem?.after_image?.url}
                    onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {afterFile && (
                  <p className="mt-1 text-[11px] text-brand-500 truncate">{afterFile.name}</p>
                )}
              </div>

              {/* Publish Checkbox */}
              <label className="flex items-center gap-3 sm:col-span-2 cursor-pointer p-3 rounded-xl border border-surface-200 dark:border-white/10">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => change('is_published', e.target.checked)}
                  className="h-4 w-4 rounded text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-bold text-ink-900 dark:text-white">
                    Publish immediately to public website
                  </span>
                  <p className="text-[11px] text-surface-400">
                    If unchecked, this transformation will be saved as a draft and hidden from public visitors.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-surface-200 p-5 dark:border-white/10">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-surface-200 px-4 py-2.5 text-xs font-bold text-surface-700 hover:bg-surface-100 dark:border-white/10 dark:text-surface-300 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-brand-600 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Saving...
                  </>
                ) : editing ? (
                  'Update Transformation'
                ) : (
                  'Create Transformation'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interactive Slider Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-[#0d0f14] p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="rounded bg-brand-500/20 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold text-brand-400">
                  {previewItem.category}
                </span>
                <h3 className="text-lg font-black mt-1">{previewItem.title}</h3>
                {previewItem.duration && (
                  <p className="text-xs text-surface-400 font-mono">Training Duration: {previewItem.duration}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-lg p-2 text-surface-400 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-w-xl mx-auto">
              <BeforeAfterSlider
                beforeImage={previewItem.before_image?.url}
                afterImage={previewItem.after_image?.url}
                beforeLabel="BEFORE"
                afterLabel="AFTER"
                aspectRatio="aspect-[4/5] sm:aspect-[16/11]"
              />
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs text-surface-300 leading-relaxed">{previewItem.description}</p>
              {previewItem.achievement && (
                <p className="text-xs text-amber-400 font-medium">★ {previewItem.achievement}</p>
              )}
              {previewItem.story && (
                <blockquote className="border-l-2 border-brand-500 pl-3 italic text-xs text-surface-400">
                  &ldquo;{previewItem.story}&rdquo;
                </blockquote>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
