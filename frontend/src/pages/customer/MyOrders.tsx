import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { ordersApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { OrderTable } from '../../components/OrderTable';
import { EmptyState, PageShell, Panel } from '../../components/ui';
import type { Order } from '../../types';

export function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) ordersApi.myOrders(user.token).then(setOrders).catch(() => setOrders([]));
  }, [user]);

  return (
    <PageShell title="My Orders" subtitle="Track all your delivery orders">
      <Panel title={`${orders.length} orders`} icon={Package} noPadding>
        {orders.length === 0 ? (
          <EmptyState message="No orders found" icon={Package} />
        ) : (
          <OrderTable orders={orders} maxHeight="calc(100vh - 220px)" />
        )}
      </Panel>
    </PageShell>
  );
}
