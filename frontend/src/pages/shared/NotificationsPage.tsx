import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { notificationsApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Alert, Button, EmptyState, PageShell, Panel } from '../../components/ui';
import type { Notification } from '../../types';

export function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [msg, setMsg] = useState('');

  const load = () => {
    if (!user) return;
    notificationsApi.list(user.token).then(setItems).catch(() => setItems([]));
  };

  useEffect(load, [user]);

  const markRead = async (id: number) => {
    if (!user) return;
    await notificationsApi.markRead(user.token, id);
    setMsg('Marked as read');
    load();
  };

  return (
    <PageShell title="Notifications" subtitle="Alerts about orders and deliveries">
      {msg && <Alert message={msg} type="success" />}
      <Panel title="Inbox" icon={Bell}>
        {items.length === 0 ? (
          <EmptyState message="No notifications yet" icon={Bell} />
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((n) => (
              <li key={n.notificationId} className="flex items-center justify-between gap-4 py-4 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${n.isRead ? 'text-slate-500' : 'font-medium text-slate-900'}`}>{n.message}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && (
                  <Button size="sm" variant="secondary" onClick={() => markRead(n.notificationId)}>
                    Mark read
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </PageShell>
  );
}
