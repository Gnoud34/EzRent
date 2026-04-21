import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Tenants from './pages/Tenants/Tenants'
import Rooms from './pages/Rooms/Rooms';
import Auth from './pages/Auth/Auth';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Settings from './pages/Settings/Settings';
import Maintenances from './pages/Maintenances/Maintenances';
import UserRequest from './pages/UserRequest/UserRequest';
import LandingPage from './LandingPage';
import type { JSX } from 'react';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/landing" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        
        <Route path="/" element={<Navigate to="/login" />} />

        <Route 
          path="/landing" 
          element={
            <ProtectedRoute allowedRoles={['tenant', 'admin']}>
              <LandingPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tenants" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Tenants />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/rooms" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Rooms />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/maintenance" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Maintenances />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'tenant']}>
              <Settings />
            </ProtectedRoute>
          } 
        />
                <Route 
          path="/UserRequest" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserRequest />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;