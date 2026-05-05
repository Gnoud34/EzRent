import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

// ── Admin ──
import Dashboard    from './pages/Admin/Dashboard/Dashboard';
import Tenants      from './pages/Admin/Tenants/Tenants';
import Rooms        from './pages/Admin/Rooms/Rooms';
import Auth         from './pages/Admin/Auth/Auth';
import Settings     from './pages/Admin/Settings/Settings';
import Maintenances from './pages/Admin/Maintenances/Maintenances';
import UserRequest  from './pages/Admin/UserRequest/UserRequest';

// ── Guest ──
import LandingPage from './pages/Guest/LandingPage';
import RoomListing from './pages/Guest/RoomListing';
import RoomDetail  from './pages/Guest/RoomDetail';

// ── Tenant layout ──
import UserLayout from './components/Tenant/UserLayout';

// ── Tenant pages ──
import TenantDashboard from './pages/Tenant/TenantDashboard';
import MyRoom          from './pages/Tenant/MyRoom';
import Profile         from './pages/Tenant/Profile';
import TenantMaintenance     from './pages/Tenant/TenantMaintenance';

/* ─── Route guard ─── */
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user)                             return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

/* Redirect sau login theo role */
const RoleRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user)                  return <Navigate to="/login"            replace />;
  if (user.role === 'admin')  return <Navigate to="/dashboard"        replace />;
  if (user.role === 'tenant') return <Navigate to="/tenant/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Guest (không cần đăng nhập) ── */}
        <Route path="/"          element={<LandingPage />} />
        <Route path="/rooms"     element={<RoomListing />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/login"     element={<Auth />} />
        <Route path="/home"      element={<RoleRedirect />} />

        {/* ── Tenant ── */}
        <Route
          path="/tenant"
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index              element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<TenantDashboard />} />
          <Route path="my-room"     element={<MyRoom />} />
          <Route path="profile"     element={<Profile />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
        </Route>

        {/* ── Admin ── */}
        <Route path="/dashboard"
          element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
        <Route path="/tenants"
          element={<ProtectedRoute allowedRoles={['admin']}><Tenants /></ProtectedRoute>} />
        <Route path="/rooms-admin"
          element={<ProtectedRoute allowedRoles={['admin']}><Rooms /></ProtectedRoute>} />
        <Route path="/maintenance"
          element={<ProtectedRoute allowedRoles={['admin']}><Maintenances /></ProtectedRoute>} />
        <Route path="/UserRequest"
          element={<ProtectedRoute allowedRoles={['admin']}><UserRequest /></ProtectedRoute>} />
        <Route path="/settings"
          element={<ProtectedRoute allowedRoles={['admin', 'tenant']}><Settings /></ProtectedRoute>} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;