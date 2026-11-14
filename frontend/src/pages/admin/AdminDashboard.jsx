import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Dumbbell, CreditCard, TrendingUp, IndianRupee, ShoppingCart, AlertTriangle, ArrowRight, Activity, Store, ShieldCheck, Building2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { fetchAdminStats, fetchRevenueAnalytics } from '@/redux/slices/dashboardSlice';
import { formatCurrency, formatDate, getDaysRemaining } from '@/utils/formatters';

const periods = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '3m', label: '3 months' },
  { key: '6m', label: '6 months' },
  { key: '1y', label: '1 year' },
];

function StatCard({ icon: Icon, label, value, tone = 'neutral', sublabel }) {
  const tones = {
    success: { icon: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', card: '!border-emerald-200/80 !bg-emerald-50/70 dark:!border-emerald-500/20 dark:!bg-emerald-500/[0.08]' },
    warning: { icon: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', card: '!border-amber-200/80 !bg-amber-50/70 dark:!border-amber-500/20 dark:!bg-amber-500/[0.08]' },
    danger: { icon: 'bg-red-500/10 text-red-700 dark:text-red-400', card: '!border-red-200/80 !bg-red-50/70 dark:!border-red-500/20 dark:!bg-red-500/[0.08]' },
    info: { icon: 'bg-blue-500/10 text-blue-700 dark:text-blue-400', card: '!border-blue-200/80 !bg-blue-50/70 dark:!border-blue-500/20 dark:!bg-blue-500/[0.08]' },
    violet: { icon: 'bg-violet-500/10 text-violet-700 dark:text-violet-400', card: '!border-violet-200/80 !bg-violet-50/70 dark:!border-violet-500/20 dark:!bg-violet-500/[0.08]' },
    teal: { icon: 'bg-teal-500/10 text-teal-700 dark:text-teal-400', card: '!border-teal-200/80 !bg-teal-50/70 dark:!border-teal-500/20 dark:!bg-teal-500/[0.08]' },
    neutral: { icon: 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300', card: '' },
  };
  const palette = tones[tone] || tones.neutral;
  return (
    <Card className={palette.card}>
      <div className="flex items-center justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${palette.icon}`}><Icon size={20} /></span>
        {sublabel && <span className="text-xs text-surface-500">{sublabel}</span>}
      </div>
      <p className="mt-4 text-xs font-medium text-surface-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink-950 dark:text-white">{value}</p>
    </Card>
  );
}

function RevenueChart({ analytics, period, onPeriodChange }) {
  const allDates = [...(analytics?.gymRevenue || []), ...(analytics?.storeRevenue || [])].map((d) => d.date);
  const uniqueDates = [...new Set(allDates)].sort();
  const maxAmount = Math.max(1, ...[...(analytics?.gymRevenue || []), ...(analytics?.storeRevenue || [])].map((d) => d.amount));

  function getAmount(arr, date) {
    return arr.find((d) => d.date === date)?.amount || 0;
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-brand-500" />
          <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-white">Revenue Trend</h3>
        </div>
        <div className="flex max-w-full flex-wrap gap-1 rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
          {periods.map((p) => (
            <button key={p.key} onClick={() => onPeriodChange(p.key)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${period === p.key ? 'bg-brand-600 text-white' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}>{p.label}</button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-brand-600" /> Gym Memberships</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-blue-500" /> Supplement Store (online + counter)</span>
      </div>
      {uniqueDates.length > 0 ? (
        <>
        <div className="mb-3 grid grid-cols-3 gap-3 rounded-xl bg-surface-50 p-3 dark:bg-surface-800/60">
          <div><p className="text-[11px] text-surface-500">Gym</p><p className="mt-1 text-sm font-semibold text-ink-950 dark:text-white">{formatCurrency((analytics?.gymRevenue || []).reduce((sum, item) => sum + item.amount, 0))}</p></div>
          <div><p className="text-[11px] text-surface-500">Store</p><p className="mt-1 text-sm font-semibold text-ink-950 dark:text-white">{formatCurrency((analytics?.storeRevenue || []).reduce((sum, item) => sum + item.amount, 0))}</p></div>
          <div><p className="text-[11px] text-surface-500">Total</p><p className="mt-1 text-sm font-semibold text-ink-950 dark:text-white">{formatCurrency([...(analytics?.gymRevenue || []), ...(analytics?.storeRevenue || [])].reduce((sum, item) => sum + item.amount, 0))}</p></div>
        </div>
        <div className="flex min-w-0 items-end gap-0.5 overflow-x-auto" style={{ minHeight: '180px' }}> 
          {uniqueDates.map((date) => {
            const gym = getAmount(analytics.gymRevenue, date);
            const store = getAmount(analytics.storeRevenue, date);
            const gymH = (gym / maxAmount) * 160;
            const storeH = (store / maxAmount) * 160;
            return (
              <div key={date} className="flex min-w-[18px] flex-1 flex-col items-center gap-1 sm:min-w-[24px]">
                <div className="flex w-full items-end justify-center gap-1" style={{ height: '160px' }}>
                  <div className="w-3 rounded-t bg-brand-600 transition-all duration-300" style={{ height: `${gymH}px` }} title={`Gym: ${formatCurrency(gym)}`} />
                  <div className="w-3 rounded-t bg-blue-500 transition-all duration-300" style={{ height: `${storeH}px` }} title={`Store: ${formatCurrency(store)}`} />
                </div>
                <span className="text-[10px] text-surface-500">{date.slice(5)}</span>
              </div>
            );
          })}
        </div>
        </>
      ) : <p className="py-8 text-center text-sm text-surface-500">No revenue recorded in this period</p>}
    </Card>
  );
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const adminStats = useSelector((state) => state.dashboard.adminStats);
  const analytics = useSelector((state) => state.dashboard.analytics);
  const loading = useSelector((state) => state.dashboard.loading);
  const [period, setPeriod] = useState('30d');

  useEffect(() => { dispatch(fetchAdminStats()); }, [dispatch]);
  useEffect(() => { dispatch(fetchRevenueAnalytics(period)); }, [dispatch, period]);

  if (loading && !adminStats) return <AdminLoadingSkeleton variant="dashboard" />;
  if (!adminStats) return <EmptyState title="Failed to load dashboard" />;

  const s = adminStats.stats;

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] px-5 py-6 text-white shadow-xl shadow-slate-950/10 sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[28px] border-white/[0.035]" />
        <div className="pointer-events-none absolute -bottom-24 right-44 h-48 w-48 rounded-full border border-red-400/15" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-400/25 bg-red-500/15 text-red-300 shadow-inner sm:h-14 sm:w-14">
              <ShieldCheck size={27} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-red-300">Admin control center</p>
                <span className="h-1 w-1 rounded-full bg-slate-500" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Heaven Gym</span>
              </div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-[28px]">Business Overview</h1>
              <p className="mt-1 text-sm text-slate-400">Manage operations, members, revenue and inventory from one place.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5">
            <Building2 size={17} className="text-red-300" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
              <p className="text-xs font-bold text-white">Gym Administration</p>
            </div>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 sm:max-w-[520px] sm:gap-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Members</p>
            <p className="mt-1 text-sm font-bold text-white sm:text-base">{s.totalAdmitted.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Active plans</p>
            <p className="mt-1 text-sm font-bold text-white sm:text-base">{s.activeMemberships.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Total revenue</p>
            <p className="mt-1 text-sm font-bold text-white sm:text-base">{formatCurrency(s.totalRevenue)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Registered Users" value={s.totalUsers} tone="info" />
        <StatCard icon={Dumbbell} label="Gym Members" value={s.totalAdmitted} tone="success" sublabel={`${s.notAdmitted} not admitted`} />
        <StatCard icon={CreditCard} label="Active Memberships" value={s.activeMemberships} tone="teal" sublabel={`${s.expiredMemberships} expired`} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={s.totalOrders} tone="violet" sublabel={`${s.pendingOrders} pending`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={IndianRupee} label="Gym Revenue" value={formatCurrency(s.gymRevenue)} tone="success" />
        <StatCard icon={Store} label="Store Revenue" value={formatCurrency(s.storeRevenue)} tone="violet" />
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(s.totalRevenue)} tone="success" />
        <StatCard icon={TrendingUp} label="This Month" value={formatCurrency(s.monthRevenue)} tone="teal" sublabel={`Today: ${formatCurrency(s.todayRevenue)}`} />
      </div>

      {loading && !analytics ? <AdminLoadingSkeleton variant="chart" /> : <RevenueChart analytics={analytics} period={period} onPeriodChange={setPeriod} />}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card padding={false}>
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4 dark:border-surface-800">
            <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-white">Recent Orders</h3>
            <Link to="/admin/orders"><Button variant="ghost" size="sm">All <ArrowRight size={14} /></Button></Link>
          </div>
          <div className="p-5">
            {adminStats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {adminStats.recentOrders.slice(0, 5).map((o) => (
                  <div key={o._id} className="flex items-center justify-between border-b border-surface-100 pb-3 last:border-0 dark:border-surface-800">
                    <div>
                      <p className="text-sm font-medium text-ink-900 dark:text-white">{o.order_number}</p>
                      <p className="text-xs text-surface-500">{o.user_id?.full_name || '—'} · {formatDate(o.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(o.total_amount)}</p>
                      <Badge tone={o.status === 'delivered' ? 'success' : o.status === 'pending' ? 'warning' : 'info'}>{o.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState title="No orders yet" />}
          </div>
        </Card>

        <Card padding={false}>
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4 dark:border-surface-800">
            <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-white">Expiring Memberships</h3>
            <Link to="/admin/memberships"><Button variant="ghost" size="sm">All <ArrowRight size={14} /></Button></Link>
          </div>
          <div className="p-5">
            {adminStats.expiringMemberships.length > 0 ? (
              <div className="space-y-3">
                {adminStats.expiringMemberships.slice(0, 5).map((m) => {
                  const days = getDaysRemaining(m.end_date);
                  return (
                    <div key={m._id} className="flex items-center justify-between border-b border-surface-100 pb-3 last:border-0 dark:border-surface-800">
                      <div>
                        <p className="text-sm font-medium text-ink-900 dark:text-white">{m.user_id?.full_name || '—'}</p>
                        <p className="text-xs text-surface-500">{m.plan_name_snapshot} · {formatDate(m.end_date)}</p>
                      </div>
                      <Badge tone={days <= 1 ? 'danger' : 'warning'}>{days} days left</Badge>
                    </div>
                  );
                })}
              </div>
            ) : <EmptyState title="No expiring memberships" />}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding={false}>
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4 dark:border-surface-800">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-950 dark:text-white"><AlertTriangle size={18} className="text-amber-500" /> Low Stock</h3>
            <Link to="/admin/products"><Button variant="ghost" size="sm">All <ArrowRight size={14} /></Button></Link>
          </div>
          <div className="p-5">
            {adminStats.lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {adminStats.lowStockProducts.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center justify-between border-b border-surface-100 pb-3 last:border-0 dark:border-surface-800">
                    <p className="text-sm font-medium text-ink-900 dark:text-white">{p.name}</p>
                    <Badge tone={p.available_quantity === 0 ? 'danger' : 'warning'}>{p.available_quantity} available</Badge>
                  </div>
                ))}
              </div>
            ) : <EmptyState title="All products well stocked" />}
          </div>
        </Card>

        <Card padding={false}>
          <div className="flex items-center justify-between border-b border-surface-200 px-5 py-4 dark:border-surface-800">
            <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-white">Recent Payments</h3>
            <Link to="/admin/payments"><Button variant="ghost" size="sm">All <ArrowRight size={14} /></Button></Link>
          </div>
          <div className="p-5">
            {adminStats.recentPayments.length > 0 ? (
              <div className="space-y-3">
                {adminStats.recentPayments.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center justify-between border-b border-surface-100 pb-3 last:border-0 dark:border-surface-800">
                    <div>
                      <p className="text-sm font-medium capitalize text-ink-900 dark:text-white">{p.payment_type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-surface-500">{p.user_id?.full_name || '—'} · {formatDate(p.payment_date || p.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(p.amount)}</p>
                      <Badge tone={p.status === 'success' ? 'success' : 'warning'}>{p.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState title="No payments yet" />}
          </div>
        </Card>
      </div>
    </div>
  );
}
