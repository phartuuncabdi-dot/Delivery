import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Truck,
  Users,
  BarChart3,
  CreditCard,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

type NavItem = { to: string; label: string; icon: React.ReactNode };

const navByRole: Record<UserRole, NavItem[]> = {
  Customer: [
    { to: '/customer', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/customer/new-order', label: 'New Order', icon: <PlusCircle size={18} /> },
    { to: '/customer/orders', label: 'My Orders', icon: <Package size={18} /> },
    { to: '/customer/payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { to: '/customer/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ],
  Admin: [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/orders', label: 'Orders', icon: <ClipboardList size={18} /> },
    { to: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
    { to: '/admin/drivers', label: 'Drivers', icon: <Truck size={18} /> },
    { to: '/admin/reports', label: 'Reports', icon: <BarChart3 size={18} /> },
    { to: '/admin/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ],
  Driver: [
    { to: '/driver', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/driver/assignments', label: 'Deliveries', icon: <Truck size={18} /> },
    { to: '/driver/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ],
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const nav = navByRole[user.role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full overflow-hidden">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-slate-200/80 bg-white">
        <div className="border-b border-slate-100 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30">
              <Truck size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">Delivery</p>
              <p className="text-xs font-medium text-brand-600">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="scroll-area flex-1 space-y-0.5 px-3 py-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split('/').length === 2}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2">
            <p className="truncate text-xs font-medium text-slate-500">Signed in as</p>
            <p className="truncate text-sm font-semibold text-slate-800">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-[var(--color-surface)]">
        <div className="h-full overflow-hidden p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
