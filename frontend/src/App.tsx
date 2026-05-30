import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './components/Layout';
import { ProtectedRoute, getRoleHome } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { NewOrder } from './pages/customer/NewOrder';
import { MyOrders } from './pages/customer/MyOrders';
import { Payments } from './pages/customer/Payments';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminDrivers } from './pages/admin/AdminDrivers';
import { AdminReports } from './pages/admin/AdminReports';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DriverAssignments } from './pages/driver/DriverAssignments';
import { NotificationsPage } from './pages/shared/NotificationsPage';

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Landing />;
  return <Navigate to={getRoleHome(user.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<div className="h-full"><Login /></div>} />
          <Route path="/register" element={<div className="h-full"><Register /></div>} />

          <Route
            element={
              <ProtectedRoute roles={['Customer']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/new-order" element={<NewOrder />} />
            <Route path="/customer/orders" element={<MyOrders />} />
            <Route path="/customer/payments" element={<Payments />} />
            <Route path="/customer/notifications" element={<NotificationsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute roles={['Admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/drivers" element={<AdminDrivers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute roles={['Driver']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/assignments" element={<DriverAssignments />} />
            <Route path="/driver/notifications" element={<NotificationsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
