import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Dumbbell, MessageCircle } from 'lucide-react';
import { gymEquipmentService } from '@/services/gymEquipmentService';
import { gymSettingsService } from '@/services/settingsService';

export default function GymEquipmentDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [phone, setPhone] = useState('');
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    gymEquipmentService.getPublicBySlug(slug).then(setProduct).catch(() => setError('This equipment is unavailable or may have been unpublished.'));
    gymSettingsService.get().then((settings) => setPhone(settings.contact_phone || '')).catch(() => setPhone(''));
  }, [slug]);
  const whatsapp = phone.replace(/\D/g, '');
  const message = encodeURIComponent(`Hello Heaven Gym, I am interested in ${product?.name || 'gym equipment'}.${product?.sku ? ` SKU: ${product.sku}.` : ''} Please share details, availability and quotation.`);
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${message}` : '';
  if (error) return <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#08090c] px-5 text-center text-white"><Dumbbell size={36} className="text-red-500"/><h1 className="mt-5 text-2xl font-black">{error}</h1><Link to="/gym-equipment" className="mt-6 text-sm font-bold text-red-400">Back to equipment</Link></div>;
  if (!product) return <div className="min-h-[70vh] animate-pulse bg-[#08090c] pt-40"><div className="mx-auto h-80 max-w-6xl rounded-3xl bg-white/5"/></div>;
  return <div className="min-h-screen bg-[#08090c] px-5 pb-20 pt-32 text-white sm:pt-40"><div className="mx-auto max-w-7xl">
    <Link to="/gym-equipment" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/45 transition hover:text-white"><ArrowLeft size={15}/> All equipment</Link>
    <div className="mt-8 grid gap-12 lg:grid-cols-2">
      <div><div className="aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/[.04]">{product.images?.length ? <img src={product.images[selected]?.url} alt={product.images[selected]?.alt_text || product.name} className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center"><Dumbbell size={100} className="text-white/20"/></div>}</div>
      {product.images?.length > 1 && <div className="mt-3 grid grid-cols-5 gap-3">{product.images.map((image, index) => <button key={image._id || image.public_id} onClick={() => setSelected(index)} className={`aspect-square overflow-hidden rounded-xl border ${selected === index ? 'border-red-500' : 'border-white/10 opacity-60 hover:opacity-100'}`}><img src={image.url} alt={image.alt_text || product.name} className="h-full w-full object-cover"/></button>)}</div>}</div>
      <div className="py-2"><p className="text-[10px] font-black uppercase tracking-[.3em] text-red-400">{product.category}</p><h1 className="mt-4 font-display text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">{product.name}</h1>{product.brand && <p className="mt-3 text-sm text-white/45">{product.brand}</p>}
        <p className="mt-7 text-2xl font-black">{product.price_label || (product.price == null ? 'Request a quotation' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price))}</p>
        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-300"><CheckCircle2 size={15}/>{product.availability}</div>
        <p className="mt-7 whitespace-pre-line text-sm leading-8 text-white/60">{product.description || 'Contact our team for more product information.'}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[.035] p-5"><p className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Product information</p><div className="mt-4">{product.sku && <div><p className="text-[10px] uppercase text-white/35">Product code</p><p className="mt-1 text-sm font-semibold">{product.sku}</p></div>}</div></div>
        {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#20b85a] px-6 py-4 text-xs font-black uppercase tracking-[.15em] text-white shadow-xl shadow-green-950/30 transition hover:-translate-y-0.5 hover:bg-[#1da950]"><MessageCircle size={18}/> Enquire on WhatsApp <ArrowRight size={16}/></a> : <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">WhatsApp contact is not configured yet. Please contact Heaven Gym through the Contact page.</div>}
        <p className="mt-3 text-center text-[10px] text-white/30">No online checkout. Final pricing, delivery and bulk orders are confirmed directly.</p>
      </div>
    </div>
  </div></div>;
}
