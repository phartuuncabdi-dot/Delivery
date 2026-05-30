import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { driverApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Alert, Button, EmptyState, PageShell, Panel, Select, StatusBadge } from '../../components/ui';
import type { Order } from '../../types';

export function DriverAssignments() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [msg, setMsg] = useState('');

  const load = () => {
    if (!user) return;
    driverApi.assignments(user.token).then(setOrders).catch(() => setOrders([]));
  };

  useEffect(() => { load(); }, [user]);

  const updateStatus = async (id: number, status: string) => {
    if (!user) return;
    await driverApi.updateStatus(user.token, id, status);
    setMsg('Status updated');
    load();
  };

  const complete = async (id: number) => {
    if (!user) return;
    await driverApi.complete(user.token, id);
    setMsg('Delivery completed');
    load();
  };

  return (
    <PageShell title="My Deliveries" subtitle="Update and complete assigned orders">
      {msg && <Alert message={msg} type="success" />}
      <Panel title="Active assignments" icon={Truck}>
        {orders.length === 0 ? (
          <EmptyState message="No active assignments" icon={Truck} />
        ) : (
          <div className="grid gap-3">
            {orders.map((o) => (
              <div
                key={o.orderId}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">#{o.orderId}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 font-medium text-slate-800">{o.productName}</p>
                  <p className="text-sm text-slate-500">{o.customerName} · {o.deliveryAddress}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Select className="!w-36" value="" onChange={(e) => e.target.value && updateStatus(o.orderId, e.target.value)}>
                    <option value="">Status</option>
                    <option value="PickedUp">PickedUp</option>
                    <option value="InTransit">InTransit</option>
                  </Select>
                  <Button onClick={() => complete(o.orderId)}>Delivered</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </PageShell>
  );
}
