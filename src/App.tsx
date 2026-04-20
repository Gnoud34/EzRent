import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Tenants from './pages/Dashboard/Tenants.tsx'
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Automatically go to dashboard when opening the site */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Main Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tenants" element={<Tenants />} />
        
        {/* Placeholders for other pages */}
        <Route path="/rooms" element={<div>Rooms Page Coming Soon</div>} />
        <Route path="/maintenance" element={<div>Maintenance Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;