import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Dumbbell, Search, ShieldCheck, Truck, Wrench, X } from 'lucide-react';
import { gymEquipmentService } from '@/services/gymEquipmentService';

const PAGE_SIZE = 20;
const money = (value) => value == null ? 'Request a quote' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const discount = (item) => item.compare_at_price > item.price && item.price >= 0 ? Math.round(((item.compare_at_price - item.price) / item.compare_at_price) * 100) : 0;

export default function GymEquipment() {
  const [data, setData] = useState({ rows: [], total: 0, page: 1, pages: 0, categories: [] });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    gymEquipmentService.getPublic({ search: debouncedSearch, category, page, limit: PAGE_SIZE }).then((result) => {
      if (active) { setData(result); setError(''); }
    }).catch(() => { if (active) { setData({ rows: [], total: 0, page: 1, pages: 0, categories: [] }); setError('Equipment catalogue could not be loaded. Please try again.'); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [debouncedSearch, category, page]);

  const rows = useMemo(() => data.rows || [], [data.rows]);
  const totalPages = Math.max(1, Number(data.pages) || 0);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + index
  );
  const visibleRows = rows;

  return (
    <div className="min-h-screen bg-[#08090c] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#090a0d] px-5 pb-12 pt-28 sm:pb-16 sm:pt-36 lg:pb-20">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 78% 28%, rgba(220,38,38,.38), transparent 34%), linear-gradient(120deg, transparent 40%, rgba(255,255,255,.035))' }} />
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-red-300"><Dumbbell size={14}/> Heaven Gym Equipment</div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.3em] text-white/45 sm:text-xs">Build stronger spaces</p>
            <h1 className="max-w-3xl font-display text-4xl font-black uppercase leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">Equip your gym.<br/><span className="text-red-500">Elevate every rep.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">Explore dependable strength and fitness equipment for new gym setups, growing fitness studios and professional training spaces.</p>
            <a href="#equipment" className="mt-7 inline-flex items-center gap-3 rounded-xl bg-red-600 px-5 py-3.5 text-[10px] font-black uppercase tracking-[.14em] shadow-xl shadow-red-950/40 transition hover:-translate-y-1 hover:bg-red-500 sm:text-xs">Explore equipment <ArrowRight size={15}/></a>
          </div>
          <div className="relative hidden min-h-[260px] items-center justify-center lg:flex">
            <div className="absolute h-64 w-64 rounded-full bg-red-600/20 blur-[90px]"/>
            <div className="relative flex h-[260px] w-full max-w-[390px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[.10] to-white/[.015] shadow-2xl">
              <Dumbbell size={130} strokeWidth={.8} className="text-white/80 drop-shadow-[0_20px_35px_rgba(220,38,38,.35)]"/>
              <span className="absolute bottom-6 left-6 text-[9px] font-bold uppercase tracking-[.25em] text-white/40">Commercial fitness solutions</span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          {[['01','Strength & conditioning'],['02','Gym setup solutions'],['03','Direct expert enquiry']].map(([n,t])=><div key={n} className="flex items-center gap-3"><span className="text-xs font-black text-red-500">{n}</span><span className="text-[10px] font-bold uppercase tracking-[.12em] text-white/65 sm:text-xs">{t}</span></div>)}
        </div>
      </section>

      <section id="equipment" className="mx-auto max-w-[1440px] scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="mb-2 text-[10px] font-black uppercase tracking-[.28em] text-red-400">The equipment collection</p><h2 className="font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Find your next <span className="text-red-500">upgrade.</span></h2><p className="mt-3 max-w-xl text-xs leading-6 text-white/50 sm:text-sm">Browse our equipment range, compare listed prices and enquire directly for product and bulk-order details.</p></div>
          <div className="w-full lg:max-w-sm">
            <label className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 focus-within:border-red-500/60"><Search size={17} className="shrink-0 text-white/40"/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search name, brand or category..." aria-label="Search gym equipment" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"/>{search && <button type="button" onClick={()=>setSearch('')} aria-label="Clear search" className="text-white/45 hover:text-white"><X size={16}/></button>}</label>
          </div>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', ...(data.categories || [])].map((item)=><button key={item} onClick={()=>{setCategory(item);setPage(1);}} className={`rounded-full border px-3.5 py-2 text-[9px] font-black uppercase tracking-[.12em] transition sm:text-[10px] ${category===item?'border-red-500 bg-red-600 text-white':'border-white/10 bg-white/[.03] text-white/55 hover:border-white/30 hover:text-white'}`}>{item==='all'?'All equipment':item}</button>)}
        </div>
        <div className="mb-4 flex items-center justify-between text-[11px] text-white/45"><span>{loading ? 'Finding equipment…' : `${Number(data.total) || 0} product${Number(data.total)===1?'':'s'} found`}</span><span>{rows.length > 0 ? `Page ${currentPage} of ${totalPages}` : ''}</span></div>
        {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
        {loading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({length:8},(_,n)=><div key={n} className="h-72 animate-pulse rounded-2xl bg-white/[.05] sm:h-80"/>)}</div> :
          visibleRows.length ? <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleRows.map((item)=><Link key={item._id} to={`/gym-equipment/${item.slug}`} className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111216] transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-[0_20px_45px_rgba(0,0,0,.32)]">
              <div className="relative flex aspect-[5/4] max-h-[250px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.10),rgba(255,255,255,.015)_70%)] p-5 sm:p-6">{item.images?.[0]?.url ? <img src={item.images[0].url} alt={item.images[0].alt_text || item.name} loading="lazy" className="h-[72%] w-[72%] object-contain transition duration-500 group-hover:scale-[1.035]"/> : <Dumbbell size={58} className="text-white/15"/>}
                {(item.is_featured || discount(item) > 0 || item.offer_label) && <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">{item.is_featured && <span className="rounded-full border border-white/15 bg-black/75 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white">Featured</span>}{(discount(item) > 0 || item.offer_label) && <span className="rounded-full bg-red-600 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white">{item.offer_label || (discount(item) > 0 ? discount(item) + '% OFF' : 'Special offer')}</span>}</div>}
                <span className="absolute bottom-3 right-3 max-w-[75%] truncate rounded-md bg-black/75 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-wider text-white/75">{item.category}</span>
              </div>
              <div className="p-4 sm:p-5"><p className="truncate text-[9px] font-bold uppercase tracking-[.18em] text-red-400">{item.brand || 'Heaven Gym Collection'}</p><h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-base font-extrabold leading-6 tracking-tight text-white">{item.name}</h3><div className="mt-3 flex min-h-10 items-center justify-between gap-2 border-t border-white/10 pt-3"><span className="min-w-0 text-xs font-bold text-white/90">{item.price_label || money(item.price)}{item.compare_at_price > item.price && <span className="ml-2 text-[10px] font-medium text-white/35 line-through">{money(item.compare_at_price)}</span>}</span><span className="flex shrink-0 items-center gap-1 text-[9px] font-black uppercase tracking-wider text-red-400">Details <ArrowRight size={12}/></span></div></div>
            </Link>)}</div>
            {totalPages > 1 && <nav aria-label="Equipment pagination" className="mt-9 flex flex-wrap items-center justify-center gap-2"><button disabled={currentPage===1} onClick={()=>{setPage(p=>Math.max(1,p-1));document.getElementById('equipment')?.scrollIntoView({behavior:'smooth'});}} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-xs font-bold text-white/70 disabled:cursor-not-allowed disabled:opacity-30"><ArrowLeft size={14}/> Previous</button>{pageNumbers[0] > 1 && <><button onClick={()=>setPage(1)} className="h-9 min-w-9 rounded-lg border border-white/10 px-3 text-xs font-bold text-white/60">1</button><span className="px-1 text-white/35">…</span></>}{pageNumbers.map(n=><button key={n} onClick={()=>{setPage(n);document.getElementById('equipment')?.scrollIntoView({behavior:'smooth'});}} aria-current={currentPage===n?'page':undefined} className={`h-9 min-w-9 rounded-lg border px-3 text-xs font-bold ${currentPage===n?'border-red-500 bg-red-600 text-white':'border-white/10 text-white/60 hover:border-white/30'}`}>{n}</button>)}{pageNumbers[pageNumbers.length-1] < totalPages && <><span className="px-1 text-white/35">…</span><button onClick={()=>setPage(totalPages)} className="h-9 min-w-9 rounded-lg border border-white/10 px-3 text-xs font-bold text-white/60">{totalPages}</button></>}<button disabled={currentPage===totalPages} onClick={()=>{setPage(p=>Math.min(totalPages,p+1));document.getElementById('equipment')?.scrollIntoView({behavior:'smooth'});}} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-xs font-bold text-white/70 disabled:cursor-not-allowed disabled:opacity-30">Next <ArrowRight size={14}/></button></nav>}
          </> : <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center"><Dumbbell size={32} className="mx-auto text-white/25"/><h3 className="mt-4 text-base font-bold">No equipment found</h3><p className="mt-2 text-xs text-white/45">Try another search term or select a different category.</p><button onClick={()=>{setSearch('');setCategory('all');}} className="mt-4 rounded-lg bg-red-600 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider">Clear filters</button></div>}
      </section>
      <section className="border-y border-white/10 bg-[#0d0e12] px-5 py-12 sm:py-14"><div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-3">{[[ShieldCheck,'Curated selection','Equipment information managed by the Heaven Gym team.'],[Truck,'Setup conversations','Discuss delivery, installation and bulk requirements directly.'],[Wrench,'Right-fit guidance','Share your gym plans and get help choosing suitable equipment.']].map(([Icon,title,desc])=><div key={title} className="flex gap-4"><Icon className="shrink-0 text-red-500" size={23}/><div><h3 className="text-xs font-black uppercase tracking-wider">{title}</h3><p className="mt-2 text-xs leading-6 text-white/45">{desc}</p></div></div>)}</div></section>
    </div>
  );
}
