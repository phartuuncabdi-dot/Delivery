import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { ApiError, isApiConfigured } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getRoleHome } from '../components/ProtectedRoute';
import { Alert, Button, Input } from '../components/ui';

export function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(getRoleHome(user.role), { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const stored = JSON.parse(localStorage.getItem('delivery_auth') || '{}');
      navigate(getRoleHome(stored.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Truck size={24} />
          </div>
          <span className="text-xl font-bold">Delivery System</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Welcome back</h2>
          <p className="mt-3 max-w-sm text-brand-100">
            Sign in to manage orders, track deliveries and run your business efficiently.
          </p>
        </div>
        <p className="text-sm text-brand-200">© Delivery System 2026</p>
      </div>

      <div className="scroll-area flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Truck size={20} />
              </div>
              <span className="text-lg font-bold">Delivery System</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your account credentials</p>
          {!isApiConfigured && (
            <div className="mt-4">
              <Alert message="Vercel: set VITE_API_URL to your Railway URL (e.g. https://xxx.up.railway.app), then Redeploy." />
            </div>
          )}
          {error && <div className="mt-4"><Alert message={error} /></div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full !py-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            No account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Register
            </Link>
          </p>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
            <strong>Demo:</strong> admin@delivery.com / Admin@123
          </div>
        </div>
      </div>
    </div>
  );
}
