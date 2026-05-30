import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

export function PageShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="mb-5 flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </header>
      <div className="scroll-area min-h-0 flex-1 pr-1">{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'brand' | 'amber' | 'emerald' | 'violet';
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="glass-panel flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={22} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export function Panel({
  title,
  icon: Icon,
  action,
  children,
  className = '',
  noPadding,
}: {
  title?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div className={`glass-panel overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            {Icon && <Icon size={18} className="text-brand-600" />}
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass-panel p-6 ${className}`}>{children}</div>;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
}) {
  const styles = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/25',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm' };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:opacity-50 ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({
  label,
  children,
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
      <select
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Alert({ message, type = 'error' }: { message: string; type?: 'error' | 'success' }) {
  return (
    <div
      className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
        type === 'error'
          ? 'border-red-100 bg-red-50 text-red-700'
          : 'border-emerald-100 bg-emerald-50 text-emerald-700'
      }`}
    >
      {message}
    </div>
  );
}

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200/60',
  Assigned: 'bg-blue-100 text-blue-800 ring-1 ring-blue-200/60',
  PickedUp: 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/60',
  InTransit: 'bg-violet-100 text-violet-800 ring-1 ring-violet-200/60',
  Delivered: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60',
  Cancelled: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/60',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[status] ?? 'bg-slate-100 text-slate-600'}`}
    >
      {status}
    </span>
  );
}

export function EmptyState({ message, icon: Icon }: { message: string; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Icon size={28} />
        </div>
      )}
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
