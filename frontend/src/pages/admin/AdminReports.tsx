import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { adminApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { EmptyState, PageShell, Panel, StatusBadge } from '../../components/ui';
import type { CustomerReport, DeliveryReport } from '../../types';

export function AdminReports() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<DeliveryReport[]>([]);
  const [customers, setCustomers] = useState<CustomerReport[]>([]);

  useEffect(() => {
    if (!user) return;
    adminApi.deliveryReport(user.token).then(setDeliveries);
    adminApi.customerReport(user.token).then(setCustomers);
  }, [user]);

  return (
    <PageShell title="Reports" subtitle="Delivery and customer statistics">
      <div className="grid min-h-0 gap-6 lg:grid-cols-2">
        <Panel title="Deliveries" icon={BarChart3} className="flex min-h-0 flex-col">
          <div className="scroll-area max-h-[calc(100vh-280px)] flex-1">
            {deliveries.length === 0 ? (
              <EmptyState message="No data" />
            ) : (
              <ul className="space-y-2">
                {deliveries.map((d) => (
                  <li key={d.orderId} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
                    <span className="font-medium text-slate-800">#{d.orderId} {d.productName}</span>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>
        <Panel title="Customers" icon={BarChart3}>
          <div className="scroll-area max-h-[calc(100vh-280px)]">
            {customers.length === 0 ? (
              <EmptyState message="No data" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-slate-500">
                    <th className="pb-2">Name</th>
                    <th className="pb-2 text-right">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {customers.map((c) => (
                    <tr key={c.customerId}>
                      <td className="py-2.5 font-medium">{c.name}</td>
                      <td className="py-2.5 text-right text-brand-600">{c.totalOrders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
