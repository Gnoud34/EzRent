import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const menuItems = [
        { name: 'Dashboard', icon: 'bi-grid-1x2-fill', path: '/dashboard' },
        { name: 'Room', icon: 'bi-door-open-fill', path: '/rooms' },
        { name: 'Tenant', icon: 'bi-people-fill', path: '/tenants' },
        { name: 'Maintenance', icon: 'bi-tools', path: '/maintenance' },
        { name: 'Setting', icon: 'bi-gear-fill', path: '/settings' },
    ];

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            // 1. Xóa dữ liệu user khỏi localStorage
            localStorage.removeItem('user');

            // 2. Log ra console để kiểm tra (Cách 1 bạn đang dùng)
            console.log('Đã đăng xuất. LocalStorage hiện tại:', localStorage.getItem('user'));

            // 3. Điều hướng về trang Login
            navigate('/login');
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <i className="bi bi-house-door-fill" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                EzRent
            </div>
            <nav className="sidebar-nav">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <i className={`bi ${item.icon}`} style={{ marginRight: '12px' }}></i>
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <div className="logout-btn" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <i className="bi bi-box-arrow-left" style={{ marginRight: '12px' }}></i>
                    Logout
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;