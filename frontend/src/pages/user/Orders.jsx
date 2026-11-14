import UserLoadingSkeleton from '@/components/ui/UserLoadingSkeleton';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { fetchMyOrders } from '@/redux/slices/orderSlice';
import { paymentService } from '@/services/paymentService';
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
  const [retryingOrderId, setRetryingOrderId] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const paymentLock = useRef(false);
  const limit = 10;

  useEffect(() => { dispatch(fetchMyOrders({ bucket: tab, search, page, limit })); }, [dispatch, tab, search, page]);

  async function retryOrderPayment(order) {
    if (paymentLock.current) return;
    paymentLock.current = true;
    setRetryingOrderId(order.id);
    setPaymentError('');
    setPaymentMessage('Preparing your secure payment…');

    try {
      const { keyId, razorpayOrder } = await paymentService.createRazorpayOrder({ orderId: order.id });
      if (!razorpayOrder || !keyId || typeof window.Razorpay !== 'function') {
        throw new Error('Online payment is temporarily unavailable. Please try again later.');
      }

      const verifiedPayment = await new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || 'INR',
          name: 'Heaven Gym',
          description: `Order ${order.order_number}`,
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              setPaymentMessage('Payment received. Verifying securely…');
              resolve(await paymentService.verifyRazorpayPayment(response));
            } catch (error) {
              reject(error);
            }
          },
          modal: { ondismiss: () => reject(new Error('Payment was cancelled. Your order is still pending; you can retry while its stock reservation is active.')) },
        });
        checkout.on('payment.failed', (response) => reject(new Error(response?.error?.description || 'Payment failed. You can retry while the stock reservation is active.')));
        checkout.open();
      });

      if (verifiedPayment?.status === 'reconciliation_required') {
        throw new Error('Payment was received, but the stock reservation has expired. Please contact Heaven Gym. Do not pay again.');
      }

      setPaymentMessage('Payment successful. Your order is being updated…');
      await dispatch(fetchMyOrders({ bucket: tab, search, page, limit })).unwrap();
    } catch (error) {
      setPaymentError(error?.response?.data?.error || error.message || 'Payment could not be completed. Please check your order status before trying again.');
      setPaymentMessage('');
      await dispatch(fetchMyOrders({ bucket: tab, search, page, limit })).unwrap().catch(() => {});
    } finally {
      paymentLock.current = false;
      setRetryingOrderId('');
    }
  }

  if (loading && orders.length === 0) return <UserLoadingSkeleton variant="list" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-display text-2xl font-bold text-ink-950 dark:text-white">My Orders</h1><p className="mt-1 text-sm text-surface-500">Track active orders and view your purchase history.</p></div><span className="text-xs text-surface-500">{pagination.total} orders</span></div>
      {paymentError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{paymentError}</p>}
      {paymentMessage && <p role="status" aria-live="polite" className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{paymentMessage}</p>}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Order categories">
        {TABS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => { setTab(item.id); setPage(1); }} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === item.id ? 'bg-brand-600 text-white shadow-sm' : 'border border-surface-200 bg-white text-surface-600 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300'}`}>{item.label}</button>)}
      </div>
      <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by order number..." aria-label="Search orders" className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-brand-500 dark:border-surface-700 dark:bg-surface-900 dark:text-white" />
      {orders.length > 0 ? <div className="space-y-4">
        {orders.map((order) => {
          const canRetryPayment = order.status === 'pending'
            && order.payment_status === 'pending'
            && order.inventory_status === 'reserved'
            && order.reservation_expires_at
            && new Date(order.reservation_expires_at).getTime() > Date.now();
          const orderId = order.id || order._id;
          return <Card key={orderId}>
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-ink-950 dark:text-white">{order.order_number}</p><p className="text-xs text-surface-500">{formatDate(order.created_at)}</p><p className="mt-1 text-xs font-medium text-brand-600">{order.fulfillment_method === 'store_pickup' ? 'Offline Store' : 'Online Store'}</p></div>
              <div className="flex items-center gap-3"><Badge tone={['delivered', 'collected'].includes(order.status) ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'cancelled' ? 'danger' : 'info'}>{order.status === 'ready_for_pickup' ? 'Ready for collection' : order.status === 'out_for_delivery' ? 'Out for delivery' : order.status.replaceAll('_', ' ')}</Badge><span className="font-display text-lg font-bold">{formatCurrency(order.total_amount)}</span></div></div>
            <p className="mt-2 text-xs text-surface-500">Contact: {order.customer_name} · {order.customer_phone}</p>
            {order.fulfillment_method === 'admin_delivery' && <p className="mt-1 text-xs text-surface-500">Online Store delivery address: {order.shipping_address}</p>}
            <div className="mt-4 space-y-2 border-t border-surface-100 pt-3 dark:border-surface-800">{order.order_items?.map((item) => <div key={item._id || item.id} className="flex justify-between text-sm"><span className="text-surface-600 dark:text-surface-300">{item.product_name_snapshot} × {item.quantity}</span><span className="font-medium">{formatCurrency(item.subtotal)}</span></div>)}</div>
            {canRetryPayment && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-100 pt-4 dark:border-surface-800"><p className="text-xs text-surface-500">Payment is pending. Your stock is reserved temporarily.</p><Button size="sm" loading={retryingOrderId === orderId} disabled={Boolean(retryingOrderId)} onClick={() => retryOrderPayment(order)}>Pay now</Button></div>}
            {order.status === 'pending' && order.payment_status === 'pending' && order.inventory_status === 'reserved' && order.reservation_expires_at && new Date(order.reservation_expires_at).getTime() <= Date.now() && <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">This payment window has expired. If you already paid, contact Heaven Gym before placing another order.</p>}
          </Card>;
        })}
        <div className="flex items-center justify-between gap-3"><p className="text-xs text-surface-500">Page {pagination.page} of {pagination.pages}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button variant="outline" size="sm" disabled={page >= pagination.pages || loading} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
      </div> : <EmptyState title={tab === 'active' ? 'No active orders' : tab === 'completed' ? 'No completed orders yet' : 'No cancelled orders'} description={search ? 'No orders match your search. Try another order number.' : tab === 'active' ? 'New orders and orders being fulfilled will appear here.' : tab === 'completed' ? 'Orders you collect or receive will be saved here.' : 'Cancelled orders will be listed here.'}>{tab === 'active' && <Link to="/user/store"><Button>Shop now</Button></Link>}</EmptyState>}
    </div>
  );
}
