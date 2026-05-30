import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { adminApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { EmptyState, PageShell, Panel } from '../../components/ui';
import type { Customer } from '../../types';

export function AdminCustomers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (user) adminApi.customers(user.token).then(setCustomers).catch(() => setCustomers([]));
  }, [user]);

  return (
    <PageShell title="Customers" subtitle="All registered customers">
      <Panel title={`${customers.length} customers`} icon={Users} noPadding>
        {customers.length === 0 ? (
          <EmptyState message="No customers" icon={Users} />
        ) : (
          <div className="scroll-area" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Address</th>
                  <th className="px-5 py-3">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {customers.map((c) => (
                  <tr key={c.customerId} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-medium">{c.customerId}</td>
                    <td className="px-5 py-3.5">{c.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{c.email}</td>
                    <td className="px-5 py-3.5">{c.phone}</td>
                    <td className="px-5 py-3.5 max-w-[140px] truncate">{c.address}</td>
                    <td className="px-5 py-3.5">
                      <span className={c.isActive ? 'text-emerald-600' : 'text-slate-400'}>
                        {c.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </PageShell>
  );
}
