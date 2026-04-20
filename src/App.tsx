import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Tenants from './pages/Tenants/Tenants'
import Rooms from './pages/Rooms/Rooms';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Mặc định vào dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Main Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tenants" element={<Tenants />} />

        {/* Placeholders for other pages */}
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/maintenance" element={<div>Maintenance Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;