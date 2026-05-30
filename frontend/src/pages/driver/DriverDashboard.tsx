import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { driverApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Button, PageShell, StatCard } from '../../components/ui';
import type { Order } from '../../types';

export function DriverDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) driverApi.assignments(user.token).then(setOrders).catch(() => setOrders([]));
  }, [user]);

  return (
    <PageShell title="Driver Dashboard" subtitle="Your delivery overview">
      <StatCard label="Active deliveries" value={orders.length} icon={Truck} tone="brand" />
      <div className="mt-6">
        <Link to="/driver/assignments">
          <Button className="!px-6">
            <Truck size={18} /> View all deliveries
          </Button>
        </Link>
      </div>
    </PageShell>
  );
}
