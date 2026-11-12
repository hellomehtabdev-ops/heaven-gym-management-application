import UserLoadingSkeleton from '@/components/ui/UserLoadingSkeleton';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { fetchMyOrders } from '@/redux/slices/orderSlice';
import { formatCurrency, formatDate } from '@/utils/formatters';

const TABS = [{ id: 'active', label: 'Active Orders' }, { id: 'completed', label: 'Completed' }, { id: 'cancelled', label: 'Cancelled' }];

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.items);
  const pagination = useSelector((state) => state.orders.userPagination);
  const loading = useSelector((state) => state.orders.loading);
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => { dispatch(fetchMyOrders({ bucket: tab, search, page, limit })); }, [dispatch, tab, search, page]);

  if (loading && orders.length === 0) return <UserLoadingSkeleton variant="list" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-display text-2xl font-bold text-ink-950 dark:text-white">My Orders</h1><p className="mt-1 text-sm text-surface-500">Track active orders and view your purchase history.</p></div><span className="text-xs text-surface-500">{pagination.total} orders</span></div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Order categories">
        {TABS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => { setTab(item.id); setPage(1); }} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === item.id ? 'bg-brand-600 text-white shadow-sm' : 'border border-surface-200 bg-white text-surface-600 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300'}`}>{item.label}</button>)}
      </div>
      <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by order number..." aria-label="Search orders" className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-brand-500 dark:border-surface-700 dark:bg-surface-900 dark:text-white" />
      {orders.length > 0 ? <div className="space-y-4">
        {orders.map((order) => <Card key={order.id}>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-ink-950 dark:text-white">{order.order_number}</p><p className="text-xs text-surface-500">{formatDate(order.created_at)}</p><p className="mt-1 text-xs font-medium text-brand-600">{order.fulfillment_method === 'store_pickup' ? 'Offline Store' : 'Online Store'}</p></div>
            <div className="flex items-center gap-3"><Badge tone={['delivered', 'collected'].includes(order.status) ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'danger' : 'info'}>{order.status === 'ready_for_pickup' ? 'Ready for collection' : order.status === 'out_for_delivery' ? 'Out for delivery' : order.status.replaceAll('_', ' ')}</Badge><span className="font-display text-lg font-bold">{formatCurrency(order.total_amount)}</span></div></div>
          <p className="mt-2 text-xs text-surface-500">Contact: {order.customer_name} · {order.customer_phone}</p>
          {order.fulfillment_method === 'admin_delivery' && <p className="mt-1 text-xs text-surface-500">Online Store delivery address: {order.shipping_address}</p>}
          <div className="mt-4 space-y-2 border-t border-surface-100 pt-3 dark:border-surface-800">{order.order_items?.map((item) => <div key={item.id} className="flex justify-between text-sm"><span className="text-surface-600 dark:text-surface-300">{item.product_name_snapshot} × {item.quantity}</span><span className="font-medium">{formatCurrency(item.subtotal)}</span></div>)}</div>
        </Card>)}
        <div className="flex items-center justify-between gap-3"><p className="text-xs text-surface-500">Page {pagination.page} of {pagination.pages}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button variant="outline" size="sm" disabled={page >= pagination.pages || loading} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
      </div> : <EmptyState title={tab === 'active' ? 'No active orders' : tab === 'completed' ? 'No completed orders yet' : 'No cancelled orders'} description={search ? 'No orders match your search. Try another order number.' : tab === 'active' ? 'New orders and orders being fulfilled will appear here.' : tab === 'completed' ? 'Orders you collect or receive will be saved here.' : 'Cancelled orders will be listed here.'}>{tab === 'active' && <Link to="/user/store"><Button>Shop now</Button></Link>}</EmptyState>}
    </div>
  );
}