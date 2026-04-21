import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Tenants from './pages/Tenants/Tenants'
import Rooms from './pages/Rooms/Rooms';
import Auth from './pages/Auth/Auth';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Settings from './pages/Settings/Settings';
import Maintenances from './pages/Maintenances/Maintenances';
import LandingPage from './LandingPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Mặc định vào dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Auth />} />
        {/* Main Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tenants" element={<Tenants />} />

        {/* Placeholders for other pages */}
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/maintenance" element={<Maintenances />} />
        <Route path="/settings" element={<Settings />} />
<Route path="/landing" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;