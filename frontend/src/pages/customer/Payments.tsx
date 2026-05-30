import { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { ordersApi, paymentsApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';
import { Alert, Button, EmptyState, Input, PageShell, Panel, Select } from '../../components/ui';
import type { Order } from '../../types';

export function Payments() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) ordersApi.myOrders(user.token).then(setOrders).catch(() => setOrders([]));
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setSuccess('');
    try {
      await paymentsApi.create(user.token, {
        orderId: Number(orderId),
        amount: Number(amount),
        paymentMethod: method,
      });
      setSuccess('Payment recorded successfully');
      setAmount('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Payment failed');
    }
  };

  return (
    <PageShell title="Payments" subtitle="Pay for your orders">
      <Panel title="New payment" icon={CreditCard} className="max-w-md">
        {error && <Alert message={error} />}
        {success && <Alert message={success} type="success" />}
        {orders.length === 0 ? (
          <EmptyState message="Create an order first" icon={CreditCard} />
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Select label="Order" value={orderId} onChange={(e) => setOrderId(e.target.value)} required>
              <option value="">Select order</option>
              {orders.map((o) => (
                <option key={o.orderId} value={o.orderId}>
                  #{o.orderId} - {o.productName} ({o.status})
                </option>
              ))}
            </Select>
            <Input label="Amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Select label="Method" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option>Cash</option>
              <option>Card</option>
              <option>Mobile Money</option>
            </Select>
            <Button type="submit" className="w-full">Pay Now</Button>
          </form>
        )}
      </Panel>
    </PageShell>
  );
}
