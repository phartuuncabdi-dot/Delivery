import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Alert, Button, Input, PageShell, Panel } from '../../components/ui';
import { ApiError } from '../../api/client';

export function NewOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      await ordersApi.create(user.token, {
        productName,
        quantity: Number(quantity),
        deliveryAddress,
        scheduledDate: scheduledDate || null,
      });
      navigate('/customer/orders');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="New Order" subtitle="Fill in delivery details">
      <Panel className="max-w-lg">
        {error && <Alert message={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} required placeholder="e.g. Pizza Large" />
          <Input label="Quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
          <Input label="Delivery Address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required placeholder="Street, district, city" />
          <Input label="Scheduled Date" type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          <Button type="submit" className="w-full !py-3" disabled={loading}>
            {loading ? 'Submitting...' : 'Place Order'}
          </Button>
        </form>
      </Panel>
    </PageShell>
  );
}
