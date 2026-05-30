import type { Order } from '../types';
import { StatusBadge } from './ui';

export function OrderTable({
  orders,
  actions,
  maxHeight = 'min(420px, 50vh)',
}: {
  orders: Order[];
  actions?: (order: Order) => React.ReactNode;
  maxHeight?: string;
}) {
  if (orders.length === 0) return null;

  return (
    <div className="scroll-area rounded-xl border border-slate-100" style={{ maxHeight }}>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm">
          <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
            {actions && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map((o) => (
            <tr key={o.orderId} className="bg-white transition hover:bg-slate-50/80">
              <td className="px-4 py-3.5 font-semibold text-slate-900">#{o.orderId}</td>
              <td className="px-4 py-3.5 text-slate-800">
                {o.productName}
                <span className="ml-1 text-slate-400">x{o.quantity}</span>
              </td>
              <td className="px-4 py-3.5 text-slate-700">{o.customerName}</td>
              <td className="px-4 py-3.5 text-slate-600">{o.driverName ?? '—'}</td>
              <td className="max-w-[160px] truncate px-4 py-3.5 text-slate-600" title={o.deliveryAddress}>
                {o.deliveryAddress}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={o.status} />
              </td>
              <td className="px-4 py-3.5 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
              {actions && <td className="px-4 py-3.5 text-right">{actions(o)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
