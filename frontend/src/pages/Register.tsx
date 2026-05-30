import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getRoleHome } from '../components/ProtectedRoute';
import { Alert, Button, Input, Select } from '../components/ui';
import type { UserRole } from '../types';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    role: 'Customer' as UserRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate(getRoleHome(form.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="hidden w-2/5 flex-col justify-center bg-gradient-to-br from-brand-700 to-brand-900 p-12 text-white lg:flex">
        <Truck className="mb-6 h-12 w-12 opacity-90" />
        <h2 className="text-3xl font-bold">Join Delivery System</h2>
        <p className="mt-3 text-brand-100">Register as customer or driver and start today.</p>
      </div>
      <div className="scroll-area flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">Fill in your details below</p>
          {error && <div className="mt-4"><Alert message={error} /></div>}
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Select label="Account Type" value={form.role} onChange={(e) => set('role', e.target.value)}>
                <option value="Customer">Customer</option>
                <option value="Driver">Driver</option>
              </Select>
            </div>
            <Input label="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} required className="sm:col-span-2" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required className="sm:col-span-2" />
            <Input label="Password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required className="sm:col-span-2" />
            <Input label="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            <Input label={form.role === 'Driver' ? 'Vehicle' : 'Address'} value={form.address} onChange={(e) => set('address', e.target.value)} />
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full !py-3" disabled={loading}>
                {loading ? 'Creating...' : 'Register'}
              </Button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Have account? <Link to="/login" className="font-semibold text-brand-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
