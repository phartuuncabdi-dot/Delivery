import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, Package, Truck } from 'lucide-react';
import { adminApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Button, PageShell, StatCard } from '../../components/ui';
import type { Order } from '../../types';

export function AdminDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) adminApi.orders(user.token).then(setOrders).catch(() => setOrders([]));
  }, [user]);

  const pending = orders.filter((o) => o.status === 'Pending').length;
  const active = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length;

  return (
    <PageShell title="Admin Dashboard" subtitle="Overview of delivery operations">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Orders" value={orders.length} icon={Package} tone="brand" />
        <StatCard label="Pending" value={pending} icon={Clock} tone="amber" />
        <StatCard label="Active" value={active} icon={Truck} tone="violet" />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/admin/orders"><Button><ClipboardList size={18} /> Manage Orders</Button></Link>
        <Link to="/admin/drivers"><Button variant="secondary"><Truck size={18} /> Drivers</Button></Link>
        <Link to="/admin/reports"><Button variant="secondary">Reports</Button></Link>
      </div>
    </PageShell>
  );
}
