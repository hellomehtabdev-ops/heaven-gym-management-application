import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Dumbbell, Search, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { gymEquipmentService } from '@/services/gymEquipmentService';

const money = (value) => value == null ? 'Request a quote' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);\nconst discount = (item) => item.compare_at_price > item.price && item.price >= 0 ? Math.round(((item.compare_at_price - item.price) / item.compare_at_price) * 100) : 0;

export default function GymEquipment() {
  const [data, setData] = useState({ rows: [], categories: [] });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    gymEquipmentService.getPublic({ search, category }).then((result) => {
      if (active) { setData(result); setError(''); }
    }).catch(() => { if (active) setError('Equipment catalogue could not be loaded. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, category]);

  return (
    <div className="min-h-screen bg-[#08090c] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#090a0d] px-5 pb-20 pt-36 sm:pb-28 sm:pt-44">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 78% 28%, rgba(220,38,38,.42), transparent 34%), linear-gradient(120deg, transparent 40%, rgba(255,255,255,.035))' }} />
        <div className="absolute inset-0 -z-10 opacity-[.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '54px 54px' }} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.24em] text-red-300"><Dumbbell size={14}/> Heaven Gym Equipment</div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.35em] text-white/45">Build stronger spaces</p>
            <h1 className="max-w-3xl font-display text-5xl font-black uppercase leading-[.98] tracking-[-.055em] sm:text-7xl">Equip your gym.<br/><span className="text-red-500">Elevate every rep.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">Explore dependable strength and fitness equipment for new gym setups, growing fitness studios and professional training spaces.</p>
            <a href="#equipment" className="mt-9 inline-flex items-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-xs font-black uppercase tracking-[.16em] shadow-xl shadow-red-950/40 transition hover:-translate-y-1 hover:bg-red-500">Explore equipment <ArrowRight size={16}/></a>
          </div>
          <div className="relative hidden min-h-[360px] items-center justify-center lg:flex">
            <div className="absolute h-72 w-72 rounded-full bg-red-600/20 blur-[90px]"/>
            <div className="relative flex h-[330px] w-full max-w-[470px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[.10] to-white/[.015] shadow-2xl">
              <Dumbbell size={170} strokeWidth={.8} className="text-white/80 drop-shadow-[0_20px_35px_rgba(220,38,38,.35)]"/>
              <span className="absolute bottom-7 left-7 text-[10px] font-bold uppercase tracking-[.3em] text-white/40">Commercial fitness solutions</span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">
          {[['01','Strength & conditioning'],['02','Gym setup solutions'],['03','Direct expert enquiry']].map(([n,t])=><div key={n} className="flex items-center gap-4"><span className="text-xs font-black text-red-500">{n}</span><span className="text-xs font-bold uppercase tracking-[.15em] text-white/65">{t}</span></div>)}
        </div>
      </section>

      <section id="equipment" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="mb-3 text-[10px] font-black uppercase tracking-[.3em] text-red-400">The equipment collection</p><h2 className="font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">Find your next <span className="text-red-500">upgrade.</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-white/50">Browse our equipment range, compare listed prices and enquire directly for product and bulk-order details.</p></div>
          <label className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 md:max-w-xs"><Search size={17} className="text-white/40"/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search equipment..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"/></label>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {['all', ...(data.categories || [])].map((item)=><button key={item} onClick={()=>setCategory(item)} className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[.14em] transition ${category===item?'border-red-500 bg-red-600 text-white':'border-white/10 bg-white/[.03] text-white/55 hover:border-white/30 hover:text-white'}`}>{item==='all'?'All equipment':item}</button>)}
        </div>
        {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
        {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(n=><div key={n} className="h-80 animate-pulse rounded-2xl bg-white/[.05]"/>)}</div> :
          data.rows?.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.rows.map((item)=><Link key={item._id} to={`/gym-equipment/${item.slug}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111216] transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-[0_24px_60px_rgba(0,0,0,.35)]">
            <div className="relative aspect-[5/4] overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.10),rgba(255,255,255,.015)_70%)] p-5 sm:p-7">{item.images?.[0]?.url ? <img src={item.images[0].url} alt={item.images[0].alt_text || item.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.035]"/> : <div className="flex h-full items-center justify-center"><Dumbbell size={70} className="text-white/15"/></div>}
              {(item.is_featured || discount(item) > 0 || item.offer_label) && <div className="absolute left-4 top-4 flex flex-wrap gap-2">{item.is_featured && <span className="rounded-full border border-white/15 bg-black/75 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.15em] text-white">Featured</span>}{(discount(item) > 0 || item.offer_label) && <span className="rounded-full bg-red-600 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.15em] text-white">{item.offer_label || (discount(item) > 0 ? discount(item) + '% OFF' : 'Special offer')}</span>}</div>}
              <span className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/75">{item.category}</span>
            </div>
            <div className="p-6"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-red-400">{item.brand || 'Heaven Gym Collection'}</p><h3 className="mt-2 text-xl font-extrabold tracking-tight text-white">{item.name}</h3><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/90">{item.price_label || money(item.price)}{item.compare_at_price > item.price && <span className="text-xs font-medium text-white/35 line-through">{money(item.compare_at_price)}</span>}</span><span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400">Details <ArrowRight size={14}/></span></div></div>
          </Link>)}</div> : <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center"><Dumbbell size={34} className="mx-auto text-white/25"/><h3 className="mt-4 text-lg font-bold">Equipment collection coming soon</h3><p className="mt-2 text-sm text-white/45">New products will appear here once published.</p></div>}
      </section>
      <section className="border-y border-white/10 bg-[#0d0e12] px-5 py-16"><div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">{[[ShieldCheck,'Curated selection','Equipment information managed by the Heaven Gym team.'],[Truck,'Setup conversations','Discuss delivery, installation and bulk requirements directly.'],[Wrench,'Right-fit guidance','Share your gym plans and get help choosing suitable equipment.']].map(([Icon,title,desc])=><div key={title} className="flex gap-4"><Icon className="shrink-0 text-red-500" size={25}/><div><h3 className="text-sm font-black uppercase tracking-wider">{title}</h3><p className="mt-2 text-sm leading-6 text-white/45">{desc}</p></div></div>)}</div></section>
    </div>
  );
}
