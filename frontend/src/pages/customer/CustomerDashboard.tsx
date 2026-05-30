import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, PlusCircle } from 'lucide-react';
import { ordersApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { OrderTable } from '../../components/OrderTable';
import { Button, EmptyState, PageShell, Panel, StatCard } from '../../components/ui';
import type { Order } from '../../types';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) ordersApi.myOrders(user.token).then(setOrders).catch(() => setOrders([]));
  }, [user]);

  const pending = orders.filter((o) => o.status === 'Pending').length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;

  return (
    <PageShell
      title="Dashboard"
      subtitle={`Welcome back, ${user?.email?.split('@')[0] ?? 'Customer'}`}
      action={
        <Link to="/customer/new-order">
          <Button>
            <PlusCircle size={18} /> New Order
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Orders" value={orders.length} icon={Package} tone="brand" />
        <StatCard label="Pending" value={pending} icon={Clock} tone="amber" />
        <StatCard label="Delivered" value={delivered} icon={CheckCircle} tone="emerald" />
      </div>

      <Panel title="Recent Orders" icon={Package} className="mt-6">
        {orders.length === 0 ? (
          <EmptyState message="No orders yet. Place your first order!" icon={Package} />
        ) : (
          <OrderTable orders={orders.slice(0, 8)} />
        )}
      </Panel>
    </PageShell>
  );
}
