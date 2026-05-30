import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { adminApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { OrderTable } from '../../components/OrderTable';
import { Alert, Button, EmptyState, PageShell, Panel, Select } from '../../components/ui';
import type { Driver, Order } from '../../types';
import { ORDER_STATUSES } from '../../types';

export function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignOrder, setAssignOrder] = useState<number | null>(null);
  const [driverId, setDriverId] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    if (!user) return;
    adminApi.orders(user.token).then(setOrders);
    adminApi.drivers(user.token).then(setDrivers);
  };

  useEffect(() => { load(); }, [user]);

  const assign = async () => {
    if (!user || !assignOrder || !driverId) return;
    await adminApi.assignDriver(user.token, assignOrder, Number(driverId));
    setMsg('Driver assigned successfully');
    setAssignOrder(null);
    setDriverId('');
    load();
  };

  const updateStatus = async (orderId: number, status: string) => {
    if (!user) return;
    await adminApi.updateStatus(user.token, orderId, status);
    setMsg(`Order #${orderId} updated`);
    load();
  };

  return (
    <PageShell title="Orders" subtitle="Assign drivers and manage delivery status">
      {msg && <Alert message={msg} type="success" />}
      {assignOrder && (
        <Panel className="mb-4 max-w-md">
          <h3 className="mb-3 font-semibold text-slate-800">Assign driver — Order #{assignOrder}</h3>
          <Select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d.driverId} value={d.driverId}>{d.driverName}</option>
            ))}
          </Select>
          <div className="mt-3 flex gap-2">
            <Button onClick={assign}>Confirm</Button>
            <Button variant="secondary" onClick={() => setAssignOrder(null)}>Cancel</Button>
          </div>
        </Panel>
      )}
      <Panel title="All Orders" icon={ClipboardList} noPadding>
        {orders.length === 0 ? (
          <EmptyState message="No orders" icon={ClipboardList} />
        ) : (
          <OrderTable
            orders={orders}
            maxHeight="calc(100vh - 280px)"
            actions={(o) => (
              <div className="flex flex-wrap justify-end gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => setAssignOrder(o.orderId)}>
                  Assign
                </Button>
                <Select
                  className="!w-28 !py-1.5"
                  value=""
                  onChange={(e) => e.target.value && updateStatus(o.orderId, e.target.value)}
                >
                  <option value="">Status</option>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>
            )}
          />
        )}
      </Panel>
    </PageShell>
  );
}
