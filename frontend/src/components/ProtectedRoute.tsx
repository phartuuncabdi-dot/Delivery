import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const home = user.role === 'Admin' ? '/admin' : user.role === 'Driver' ? '/driver' : '/customer';
    return <Navigate to={home} replace />;
  }

  return children;
}

export function getRoleHome(role: UserRole) {
  if (role === 'Admin') return '/admin';
  if (role === 'Driver') return '/driver';
  return '/customer';
}
