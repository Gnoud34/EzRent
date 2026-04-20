import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Tenants from './pages/Dashboard/Tenants/Tenants';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Mặc định vào dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Các trang chính */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tenants" element={<Tenants />} />
        
        {/* Các trang khác bạn có thể thêm sau */}
        <Route path="/rooms" element={<div>Trang Rooms</div>} />
      </Routes>
    </Router>
  );
}

export default App;