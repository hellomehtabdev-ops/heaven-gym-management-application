import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ReceiptText, ArrowLeft, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import { offlineSaleService } from '@/services/offlineSaleService';
import { formatCurrency } from '@/utils/formatters';

const PAGE_SIZE = 20;
const paymentLabel = { cash: 'Cash', upi: 'UPI', card: 'Card', other: 'Other' };

export default function AdminSupplementSalesHistory() {
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ rows: [], total: 0, pages: 1, summary: { revenue: 0, count: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      offlineSaleService.list({ search, from, to, page, limit: PAGE_SIZE })
        .then((result) => { if (active) { setData(result); setError(''); } })
        .catch((requestError) => { if (active) setError(requestError.response?.data?.error || 'Sales history could not be loaded.'); })
        .finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [search, from, to, page]);

  const pages = Math.max(1, Number(data.pages) || 1);
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><Link to="/admin/supplement-selling" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-surface-500 hover:text-brand-600"><ArrowLeft size={14}/> Back to counter sale</Link><p className="text-xs font-bold uppercase tracking-wider text-brand-600">Heaven Gym · Records</p><h1 className="mt-1 font-display text-2xl font-extrabold text-ink-950 dark:text-white sm:text-3xl">Sales History</h1><p className="mt-1 text-sm text-surface-500">Find previous counter sales and reopen their bills.</p></div>
      <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 dark:bg-brand-500/10 dark:text-brand-300"><ReceiptText className="mr-2 inline" size={16}/> {data.total || 0} bills</div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2"><Card><p className="text-xs font-semibold uppercase text-surface-500">Matching sales</p><p className="mt-2 text-2xl font-extrabold text-ink-950 dark:text-white">{data.summary?.count || 0}</p></Card><Card><p className="text-xs font-semibold uppercase text-surface-500">Sales total</p><p className="mt-2 text-2xl font-extrabold text-ink-950 dark:text-white">{formatCurrency(data.summary?.revenue || 0)}</p><p className="mt-1 text-[11px] text-surface-500">Based on selected search and date filters</p></Card></div>
    <Card><div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
      <label className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"/><input value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1);}} placeholder="Search bill number, customer or phone" className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-3 text-sm dark:border-surface-700 dark:bg-surface-950 dark:text-white"/></label>
      <label className="text-xs font-semibold text-surface-500">From<input type="date" value={from} onChange={(e)=>{setFrom(e.target.value);setPage(1);}} className="mt-1 w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-950 dark:text-white"/></label>
      <label className="text-xs font-semibold text-surface-500">To<input type="date" value={to} onChange={(e)=>{setTo(e.target.value);setPage(1);}} className="mt-1 w-full rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm dark:border-surface-700 dark:bg-surface-950 dark:text-white"/></label>
      <button onClick={()=>{setSearch('');setFrom('');setTo('');setPage(1);}} className="self-end rounded-xl border border-surface-200 px-4 py-2.5 text-xs font-bold text-surface-600 dark:border-surface-700 dark:text-surface-300">Clear filters</button>
    </div></Card>
    {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
    <Card padding={false} className="overflow-hidden">
      {loading ? <AdminLoadingSkeleton variant="section"/> : data.rows?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-surface-50 text-[11px] uppercase tracking-wider text-surface-500 dark:bg-surface-800"><tr><th className="px-4 py-3">Bill</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-surface-100 dark:divide-surface-800">{data.rows.map((sale)=><tr key={sale._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50"><td className="px-4 py-4 font-bold text-ink-900 dark:text-white">{sale.bill_number}</td><td className="px-4 py-4"><p className="font-semibold text-ink-800 dark:text-surface-200">{sale.customer_name || 'Walk-in customer'}</p><p className="text-xs text-surface-500">{sale.customer_phone || '—'}</p></td><td className="px-4 py-4 text-surface-600 dark:text-surface-300">{sale.createdAt ? new Date(sale.createdAt).toLocaleString('en-IN') : '—'}</td><td className="px-4 py-4 text-surface-600 dark:text-surface-300">{paymentLabel[sale.payment_method] || sale.payment_method}</td><td className="px-4 py-4 text-right font-bold text-ink-900 dark:text-white">{formatCurrency(sale.total_amount)}</td><td className="px-4 py-4 text-right"><Link to={`/admin/supplement-selling/bill/${sale._id}`} className="font-bold text-brand-600 hover:underline">View bill</Link></td></tr>)}</tbody></table></div> : <div className="py-14 text-center"><ReceiptText size={34} className="mx-auto text-surface-300"/><p className="mt-3 font-bold text-ink-900 dark:text-white">No sales found</p><p className="mt-1 text-xs text-surface-500">Try another search or date range.</p></div>}
    </Card>
    {!loading && data.total > 0 && <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-surface-500">Page {page} of {pages} · {data.total} bills</p><div className="flex gap-2"><button disabled={page<=1} onClick={()=>setPage(v=>v-1)} className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-3 py-2 text-xs font-bold disabled:opacity-40 dark:border-surface-700"><ArrowLeft size={14}/> Previous</button><button disabled={page>=pages} onClick={()=>setPage(v=>v+1)} className="inline-flex items-center gap-1 rounded-lg border border-surface-200 px-3 py-2 text-xs font-bold disabled:opacity-40 dark:border-surface-700">Next <ArrowRight size={14}/></button></div></div>}
  </div>;
}
