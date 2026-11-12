import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Dumbbell, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { gymEquipmentService } from '@/services/gymEquipmentService';
import { gymSettingsService } from '@/services/settingsService';

const money = (value) => value == null ? 'Request a quotation' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const discount = (item) => item.compare_at_price > item.price && item.price >= 0 ? Math.round(((item.compare_at_price - item.price) / item.compare_at_price) * 100) : 0;

export default function GymEquipmentDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [phone, setPhone] = useState('');
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    setProduct(null); setSelected(0); setError('');
    gymEquipmentService.getPublicBySlug(slug).then(setProduct).catch(() => setError('This equipment is unavailable or may have been unpublished.'));
    gymSettingsService.get().then((settings) => setPhone(settings.contact_phone || '')).catch(() => setPhone(''));
  }, [slug]);
  const whatsapp = phone.replace(/\D/g, '');
  const message = encodeURIComponent(`Hello Heaven Gym, I am interested in ${product?.name || 'gym equipment'}.${product?.sku ? ` Product code: ${product.sku}.` : ''} Please share details, availability and quotation.`);
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.length === 10 ? '91' : ''}${whatsapp}?text=${message}` : '';
  if (error) return <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#08090c] px-5 text-center text-white"><Dumbbell size={36} className="text-red-500"/><h1 className="mt-5 text-2xl font-black">{error}</h1><Link to="/gym-equipment" className="mt-6 text-sm font-bold text-red-400">Back to equipment</Link></div>;
  if (!product) return <div className="min-h-[70vh] animate-pulse bg-[#08090c] pt-40"><div className="mx-auto h-80 max-w-6xl rounded-3xl bg-white/5"/></div>;
  const savings = discount(product);
  return <div className="min-h-screen bg-[#08090c] px-5 pb-20 pt-32 text-white sm:pt-40"><div className="mx-auto max-w-7xl">
    <Link to="/gym-equipment" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/45 transition hover:text-white"><ArrowLeft size={15}/> All equipment</Link>
    <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.05fr_.95fr] xl:gap-16">
      <div className="min-w-0">
        <div className="relative flex aspect-square max-h-[680px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.11),rgba(255,255,255,.015)_72%)] p-6 sm:p-10">
          {product.images?.length ? <img src={product.images[selected]?.url} alt={product.images[selected]?.alt_text || product.name} className="h-full w-full object-contain drop-shadow-[0_28px_35px_rgba(0,0,0,.35)]"/> : <Dumbbell size={120} className="text-white/20"/>}
          {(product.is_featured || savings > 0 || product.offer_label) && <div className="absolute left-5 top-5 flex flex-wrap gap-2">{product.is_featured && <span className="rounded-full border border-white/15 bg-black/75 px-3 py-2 text-[9px] font-black uppercase tracking-widest">Featured</span>}{(savings > 0 || product.offer_label) && <span className="rounded-full bg-red-600 px-3 py-2 text-[9px] font-black uppercase tracking-widest">{product.offer_label || `${savings}% OFF`}</span>}</div>}
        </div>
        {product.images?.length > 1 && <div className="mt-4 grid grid-cols-5 gap-3">{product.images.map((image, index) => <button key={image._id || image.public_id} onClick={() => setSelected(index)} aria-label={`View product image ${index + 1}`} className={`aspect-square overflow-hidden rounded-xl border bg-white/[.04] p-2 transition ${selected === index ? 'border-red-500' : 'border-white/10 opacity-60 hover:opacity-100'}`}><img src={image.url} alt={image.alt_text || product.name} className="h-full w-full object-contain"/></button>)}</div>}
      </div>
      <div className="py-2 lg:sticky lg:top-28">
        <p className="text-[10px] font-black uppercase tracking-[.3em] text-red-400">{product.category}</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-black uppercase leading-[1.03] tracking-tight sm:text-5xl xl:text-6xl">{product.name}</h1>
        {product.brand && <p className="mt-3 text-sm font-semibold text-white/45">{product.brand}</p>}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[.035] p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3"><p className="text-2xl font-black sm:text-3xl">{product.price_label || money(product.price)}</p>{(savings > 0 || product.offer_label) && <span className="rounded-full bg-red-500/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300">{product.offer_label || `Save ${savings}%`}</span>}</div>
          {product.compare_at_price > product.price && <div className="mt-2 flex flex-wrap items-center gap-3"><span className="text-sm text-white/35 line-through">{money(product.compare_at_price)}</span><span className="text-xs font-semibold text-emerald-300">You save {money(product.compare_at_price - product.price)}</span></div>}
          <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-emerald-300"><CheckCircle2 size={15}/>{product.availability}</div>
        </div>
        <p className="mt-7 whitespace-pre-line text-sm leading-8 text-white/60">{product.description || 'Contact our team for product details, bulk pricing and availability.'}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.025] p-4"><Truck size={19} className="shrink-0 text-red-400"/><span className="text-xs font-semibold text-white/65">Delivery & installation enquiry</span></div><div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.025] p-4"><ShieldCheck size={19} className="shrink-0 text-red-400"/><span className="text-xs font-semibold text-white/65">Product support from our team</span></div></div>
        {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#20b85a] px-6 py-4 text-xs font-black uppercase tracking-[.15em] text-white shadow-xl shadow-green-950/30 transition hover:-translate-y-0.5 hover:bg-[#1da950]"><MessageCircle size={18}/> Enquire on WhatsApp <ArrowRight size={16}/></a> : <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">WhatsApp contact is not configured yet. Add the gym contact number in Admin Gym Settings to enable enquiries.</div>}
        <p className="mt-3 text-center text-[10px] leading-5 text-white/30">Bulk orders, delivery charges and final quotations are confirmed directly by Heaven Gym.</p>
      </div>
    </div>
  </div></div>;
}
