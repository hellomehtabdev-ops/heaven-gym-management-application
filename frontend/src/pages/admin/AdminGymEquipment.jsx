import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Dumbbell, ImagePlus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import { gymEquipmentService } from '@/services/gymEquipmentService';
import { formatCurrency } from '@/utils/formatters';

const EMPTY = { name: '', slug: '', sku: '', brand: '', category: 'Strength Equipment', price: '', compare_at_price: '', price_label: '', offer_label: '', description: '', availability: 'Available', is_featured: false, is_published: false, images: [] };

export default function AdminGymEquipment() {
  const [data, setData] = useState({ rows: [], total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await gymEquipmentService.getAdmin({ search, status, page, limit: 20 });
      setData(result);
      if (page > result.pages) setPage(result.pages || 1);
    } catch (e) { setError(e.response?.data?.error || 'Equipment could not be loaded.'); }
    finally { setLoading(false); }
  }, [search, status, page]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  function openCreate() { setEditing('new'); setForm({ ...EMPTY }); setError(''); }
  function openEdit(item) {
    setEditing(item._id);
    setForm({ ...EMPTY, ...item, price: item.price ?? '', compare_at_price: item.compare_at_price ?? '', images: [] });
    setError('');
  }
  function closeEditor() { setEditing(null); setForm(EMPTY); }
  function setField(key, value) { setForm((current) => ({ ...current, [key]: value })); }

  async function save() {
    if (!form.name.trim() || !form.sku.trim()) { setError('Equipment name and SKU are required.'); return; }
    if (form.price !== '' && (!Number.isFinite(Number(form.price)) || Number(form.price) < 0)) { setError('Enter a valid price.'); return; }
    if (form.compare_at_price !== '' && Number(form.compare_at_price) < Number(form.price || 0)) { setError('Compare-at price must be equal to or higher than price.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, price: form.price, compare_at_price: form.compare_at_price };
      if (editing === 'new') await gymEquipmentService.create(payload);
      else await gymEquipmentService.update(editing, payload);
      closeEditor(); await load();
    } catch (e) { setError(e.response?.data?.error || 'Equipment could not be saved.'); }
    finally { setSaving(false); }
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.name}" from the equipment catalogue?`)) return;
    try { await gymEquipmentService.delete(item._id); await load(); }
    catch (e) { setError(e.response?.data?.error || 'Equipment could not be deleted.'); }
  }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-brand-600">Heaven Gym · Catalogue</p><h1 className="mt-1 font-display text-2xl font-extrabold text-ink-950 dark:text-white sm:text-3xl">Gym Equipment</h1><p className="mt-1 text-sm text-surface-500">Create equipment listings and control what appears publicly.</p></div><Button onClick={openCreate}><Plus size={16}/> Add equipment</Button></div>
    <Card><div className="grid gap-3 sm:grid-cols-[1fr_200px]"><label className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"/><input value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} placeholder="Search name, brand, SKU or category" className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-3 text-sm dark:border-surface-700 dark:bg-surface-950 dark:text-white"/></label><select value={status} onChange={(e)=>{setStatus(e.target.value);setPage(1);}} className="rounded-xl border border-surface-200 bg-white px-3 py-3 text-sm dark:border-surface-700 dark:bg-surface-950 dark:text-white"><option value="all">All listings</option><option value="published">Published</option><option value="draft">Draft / hidden</option></select></div></Card>
    {error && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
    {loading ? <AdminLoadingSkeleton variant="cards"/> : data.rows?.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.rows.map((item)=><Card key={item._id} padding={false} className="overflow-hidden"><div className="flex h-44 items-center justify-center bg-surface-50 p-4 dark:bg-surface-800">{item.images?.[0]?.url ? <img src={item.images[0].url} alt={item.images[0].alt_text || item.name} className="h-full w-full object-contain"/> : <Dumbbell size={42} className="text-surface-300"/>}</div><div className="space-y-3 p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{item.brand || item.category}</p><h3 className="mt-1 font-bold text-ink-950 dark:text-white">{item.name}</h3><p className="mt-1 text-xs text-surface-500">{item.sku} · {item.slug}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${item.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300'}`}>{item.is_published ? 'Published' : 'Draft'}</span></div><p className="text-sm font-bold text-ink-900 dark:text-white">{item.price_label || (item.price == null ? 'Request a quote' : formatCurrency(item.price))}</p><div className="flex gap-2"><Button size="sm" variant="secondary" className="flex-1" onClick={()=>openEdit(item)}><Pencil size={14}/> Edit</Button><Button size="sm" variant="danger" onClick={()=>remove(item)}><Trash2 size={14}/></Button></div></div></Card>)}</div> : <Card><div className="py-10 text-center"><Dumbbell size={34} className="mx-auto text-surface-300"/><p className="mt-3 font-bold dark:text-white">No equipment listings</p><p className="mt-1 text-xs text-surface-500">Add the first equipment item to the catalogue.</p></div></Card>}
    {!loading && data.total > 0 && <div className="flex items-center justify-between text-xs text-surface-500"><span>{data.total} listings · Page {page} of {Math.max(1,data.pages)}</span><div className="flex gap-2"><button disabled={page<=1} onClick={()=>setPage(v=>v-1)} className="rounded-lg border px-3 py-2 disabled:opacity-40 dark:border-surface-700">Previous</button><button disabled={page>=data.pages} onClick={()=>setPage(v=>v+1)} className="rounded-lg border px-3 py-2 disabled:opacity-40 dark:border-surface-700">Next</button></div></div>}
    {editing && <div className="fixed inset-0 z-[10000] grid place-items-center overflow-y-auto bg-black/60 p-3 sm:p-5" onClick={closeEditor}><div className="my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-surface-900 sm:p-7" onClick={(e)=>e.stopPropagation()}><div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-xl font-extrabold dark:text-white">{editing==='new'?'Add equipment':'Edit equipment'}</h2><p className="mt-1 text-xs text-surface-500">Product details, images, pricing and publication</p></div><button onClick={closeEditor} className="rounded-lg px-3 py-2 text-surface-500">Close</button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ['name','Equipment name *'],['slug','URL slug (optional)'],['sku','SKU *'],['brand','Brand'],['category','Category'],['price','Price (₹)'],['compare_at_price','Compare-at price (₹)'],['price_label','Price label'],['offer_label','Offer label']
        ].map(([key,label])=><label key={key} className="space-y-1 text-xs font-semibold text-surface-600 dark:text-surface-300">{label}<input value={form[key] ?? ''} onChange={(e)=>setField(key,e.target.value)} type={key==='price'||key==='compare_at_price'?'number':'text'} min="0" step="0.01" className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-surface-700 dark:bg-surface-950 dark:text-white"/></label>)}
        <label className="space-y-1 text-xs font-semibold text-surface-600 dark:text-surface-300 sm:col-span-2">Description<textarea rows={4} maxLength={6000} value={form.description || ''} onChange={(e)=>setField('description',e.target.value)} className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-surface-700 dark:bg-surface-950 dark:text-white"/></label>
        <label className="space-y-1 text-xs font-semibold text-surface-600 dark:text-surface-300">Availability<select value={form.availability} onChange={(e)=>setField('availability',e.target.value)} className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-950 dark:text-white"><option>Available</option><option>Made to order</option><option>Enquire for availability</option></select></label>
        <label className="space-y-1 text-xs font-semibold text-surface-600 dark:text-surface-300">Equipment photos (up to 5, JPG/PNG/WEBP, 5 MB each)<span className="flex items-center gap-2 rounded-xl border border-dashed border-surface-300 px-3 py-3 dark:border-surface-700"><ImagePlus size={17}/><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e)=>setField('images',Array.from(e.target.files || []).slice(0,5))} className="min-w-0 text-xs"/></span><span className="block font-normal">{form.images?.length || 0} new image(s) selected · existing photos are retained</span></label>
      </div>
      <div className="mt-4 flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm dark:text-white"><input type="checkbox" checked={!!form.is_featured} onChange={(e)=>setField('is_featured',e.target.checked)}/> Featured</label><label className="flex items-center gap-2 text-sm dark:text-white"><input type="checkbox" checked={!!form.is_published} onChange={(e)=>setField('is_published',e.target.checked)}/> Publish on public website</label></div>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      <div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={closeEditor}>Cancel</Button><Button onClick={save} loading={saving} disabled={saving}>{editing==='new'?'Create listing':'Save changes'}</Button></div>
    </div></div>}
  </div>;
}
