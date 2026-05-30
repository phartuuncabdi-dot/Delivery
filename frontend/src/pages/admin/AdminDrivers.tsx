import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { adminApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';
import { Alert, Button, EmptyState, Input, PageShell, Panel } from '../../components/ui';
import type { Driver } from '../../types';

export function AdminDrivers() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [form, setForm] = useState({ email: '', password: '', driverName: '', phone: '', vehicleType: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    if (!user) return;
    adminApi.drivers(user.token).then(setDrivers);
  };

  useEffect(() => { load(); }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    try {
      await adminApi.createDriver(user.token, form);
      setSuccess('Driver created');
      setForm({ email: '', password: '', driverName: '', phone: '', vehicleType: '' });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed');
    }
  };

  return (
    <PageShell title="Drivers" subtitle="Manage delivery drivers">
      <div className="grid h-full min-h-0 gap-6 lg:grid-cols-2">
        <Panel title="Add driver" icon={Truck}>
          {error && <Alert message={error} />}
          {success && <Alert message={success} type="success" />}
          <form onSubmit={submit} className="space-y-3">
            <Input label="Name" value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Vehicle" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} />
            <Button type="submit">Create Driver</Button>
          </form>
        </Panel>
        <Panel title="All drivers" icon={Truck} className="min-h-0">
          <div className="scroll-area max-h-[calc(100vh-280px)]">
            {drivers.length === 0 ? (
              <EmptyState message="No drivers" icon={Truck} />
            ) : (
              <ul className="space-y-2">
                {drivers.map((d) => (
                  <li key={d.driverId} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <p className="font-semibold text-slate-900">{d.driverName}</p>
                    <p className="text-sm text-slate-500">{d.vehicleType} · {d.phone}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
