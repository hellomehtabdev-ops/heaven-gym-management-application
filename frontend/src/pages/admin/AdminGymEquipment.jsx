import { useEffect, useMemo, useState } from 'react';
import { Check, Edit3, Eye, EyeOff, ImagePlus, Loader2, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import { gymEquipmentService } from '@/services/gymEquipmentService';

const blank = { name: '', brand: '', category: 'Strength Equipment', price: '', compare_at_price: '', price_label: '', offer_label: '', description: '', availability: 'Available', is_featured: false, is_published: false, images: [] };
const money = (value) => value == null ? 'Quote' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function AdminGymEquipment() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const previews = useMemo(() => form.images.map((file) => ({ file, url: URL.createObjectURL(file) })), [form.images]);

  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);
  const load = () => gymEquipmentService.getAdmin().then((data) => setRows(data.rows || [])).catch(() => setError('Could not load equipment.')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const startCreate = () => { setEditing(null); setRemoveImageIds([]); setForm({ ...blank }); setError(''); setOpen(true); };
  const startEdit = (item) => { setEditing(item._id); setRemoveImageIds([]); setForm({ ...blank, ...item, images: [] }); setError(''); setOpen(true); };
  const change = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const existingImages = editing ? rows.find((item) => item._id === editing)?.images || [] : [];
  const keptImages = existingImages.filter((image) => !removeImageIds.includes(String(image._id)));

  function selectImages(fileList) {
    const files = Array.from(fileList || []);
    const valid = files.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) setError('Only JPG, PNG or WEBP images up to 5 MB each are allowed.');
    if (keptImages.length + form.images.length + valid.length > 5) { setError('You can add up to 5 photos in total.'); return; }
    change('images', [...form.images, ...valid]);
  }

  async function save(event) {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, price: form.price === '' ? null : Number(form.price), compare_at_price: form.compare_at_price === '' ? null : Number(form.compare_at_price), remove_image_ids: removeImageIds.join(',') };
      if (editing) await gymEquipmentService.update(editing, payload);
      else await gymEquipmentService.create(payload);
      setOpen(false); await load();
    } catch (err) { setError(err.response?.data?.error || err.message || 'Could not save equipment.'); }
    finally { setSaving(false); }
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.name}" from the equipment catalogue?`)) return;
    try { await gymEquipmentService.delete(item._id); await load(); }
    catch (err) { setError(err.response?.data?.error || 'Could not delete equipment.'); }
  }
  async function togglePublish(item) {
    try { await gymEquipmentService.update(item._id, { ...item, is_published: !item.is_published, images: [] }); await load(); }
    catch (err) { setError(err.response?.data?.error || 'Could not update publish status.'); }
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-500">Public B2B catalogue</p><h1 className="mt-2 text-2xl font-black text-ink-900 dark:text-white">Gym Equipment</h1><p className="mt-2 max-w-2xl text-sm text-surface-500 dark:text-slate-400">Manage equipment displayed on the public website. This catalogue is separate from member supplements and orders.</p></div><button onClick={startCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-white"><Plus size={16}/> Add equipment</button></div>
    {error && !open && <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-3">{[['Total equipment', rows.length], ['Published on website', rows.filter((item) => item.is_published).length], ['Draft / hidden', rows.filter((item) => !item.is_published).length]].map(([label, value]) => <div key={label} className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-white/10 dark:bg-[#151c27]"><p className="text-xs text-surface-500">{label}</p><p className="mt-2 text-3xl font-black text-ink-900 dark:text-white">{value}</p></div>)}</div>
    {loading ? <div className="rounded-2xl bg-white p-10 text-center"><Loader2 className="mx-auto animate-spin text-brand-500"/></div> : rows.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.map((item) => <article key={item._id} className="overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-white/10 dark:bg-[#151c27]"><div className="relative aspect-[16/9] bg-surface-100">{item.images?.[0]?.url ? <img src={item.images[0].url} alt={item.name} className="h-full w-full object-contain p-5"/> : <div className="flex h-full items-center justify-center text-sm text-surface-400">No product image</div>}<span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-bold text-white">{item.is_published ? 'Published' : 'Draft'}</span></div><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-widest text-brand-500">{item.category}</p><h2 className="mt-1 text-lg font-extrabold text-ink-900 dark:text-white">{item.name}</h2><p className="mt-2 text-sm font-semibold text-surface-600">{item.price_label || money(item.price)}</p><div className="mt-5 flex flex-wrap gap-2 border-t pt-4"><button onClick={() => startEdit(item)} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold"><Edit3 size={14}/> Edit</button><button onClick={() => togglePublish(item)} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold">{item.is_published ? <EyeOff size={14}/> : <Eye size={14}/>} {item.is_published ? 'Unpublish' : 'Publish'}</button><button onClick={() => remove(item)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"><Trash2 size={14}/> Delete</button></div></div></article>)}</div> : <div className="rounded-2xl border border-dashed py-16 text-center"><ImagePlus className="mx-auto text-surface-400" size={32}/><p className="mt-3 font-bold">No equipment added yet</p><p className="mt-1 text-sm text-surface-500">Add your first product to start the public catalogue.</p></div>}

    {open && <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:p-6"><form onSubmit={save} className="my-auto w-full max-w-3xl rounded-2xl border bg-white shadow-2xl dark:border-white/10 dark:bg-[#111923]">
      <div className="flex items-center justify-between border-b p-5"><div><h2 className="text-lg font-black">{editing ? 'Edit equipment' : 'Add gym equipment'}</h2><p className="mt-1 text-xs text-surface-500">Product details shown to public visitors</p></div><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2"><X size={18}/></button></div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {[['name', 'Product name', true], ['brand', 'Brand'], ['category', 'Category']].map(([key, label, required]) => <label key={key} className="block"><span className="mb-1.5 block text-xs font-bold">{label}</span><input required={!!required} value={form[key] ?? ''} onChange={(event) => change(key, event.target.value)} className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-brand-500"/></label>)}
        <label className="block"><span className="mb-1.5 block text-xs font-bold">Price (INR)</span><input type="number" min="0" value={form.price ?? ''} onChange={(event) => change('price', event.target.value)} className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-bold">MRP / Original price (INR) <span className="font-normal text-surface-400">(optional)</span></span><input type="number" min="0" value={form.compare_at_price ?? ''} onChange={(event) => change('compare_at_price', event.target.value)} className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-bold">Offer label <span className="font-normal text-surface-400">(optional)</span></span><input placeholder="e.g. Launch offer" value={form.offer_label || ''} onChange={(event) => change('offer_label', event.target.value)} className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-bold">Price label <span className="font-normal text-surface-400">(optional display text)</span></span><input placeholder="e.g. Starting from ₹45,000" value={form.price_label || ''} onChange={(event) => change('price_label', event.target.value)} className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm"/></label>
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-bold">Description</span><textarea rows="4" value={form.description || ''} onChange={(event) => change('description', event.target.value)} className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-bold">Availability</span><select value={form.availability} onChange={(event) => change('availability', event.target.value)} className="w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm dark:bg-[#0b111a]"><option>Available</option><option>Made to order</option><option>Enquire for availability</option></select></label>

        <div className="sm:col-span-2">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold">Product photos</span><span className="text-[11px] text-surface-400">{keptImages.length + form.images.length}/5 photos</span></div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50/70 px-5 py-7 text-center hover:border-brand-500 dark:border-white/15 dark:bg-white/[.025]">
            <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-brand-500/10 text-brand-500"><UploadCloud size={23}/></span><span className="text-sm font-bold">Click to choose product photos</span><span className="mt-1 text-xs text-surface-500">JPG, PNG or WEBP · up to 5 MB each · maximum 5 photos</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(event) => { selectImages(event.target.files); event.target.value = ''; }}/>
          </label>
          {(keptImages.length > 0 || previews.length > 0) && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {keptImages.map((image) => <div key={image._id} className="relative aspect-square overflow-hidden rounded-xl border"><img src={image.url} alt={image.alt_text || form.name} className="h-full w-full object-cover"/><button type="button" onClick={() => setRemoveImageIds((ids) => [...ids, String(image._id)])} className="absolute right-1.5 top-1.5 rounded-lg bg-black/75 p-1.5 text-white hover:bg-red-600"><X size={14}/></button></div>)}
            {previews.map(({ file, url }, index) => <div key={`${file.name}-${file.lastModified}`} className="relative aspect-square overflow-hidden rounded-xl border border-brand-500/30"><img src={url} alt={file.name} className="h-full w-full object-cover"/><button type="button" onClick={() => change('images', form.images.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-1.5 top-1.5 rounded-lg bg-black/75 p-1.5 text-white hover:bg-red-600"><X size={14}/></button></div>)}
          </div>}
        </div>
        <div className="flex flex-wrap gap-5 sm:col-span-2"><label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={!!form.is_featured} onChange={(event) => change('is_featured', event.target.checked)}/> Featured product</label><label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={!!form.is_published} onChange={(event) => change('is_published', event.target.checked)}/> Publish on public website</label></div>
        {error && <p className="rounded-lg bg-red-500/10 p-3 text-xs text-red-600 sm:col-span-2">{error}</p>}
      </div>
      <div className="flex justify-end gap-2 border-t p-5"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-4 py-2.5 text-xs font-bold">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-black text-white disabled:opacity-60">{saving ? <Loader2 size={15} className="animate-spin"/> : <Check size={15}/>} Save equipment</button></div>
    </form></div>}
  </div>;
}
