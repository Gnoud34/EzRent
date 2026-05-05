import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    // Define menu items based on user role
    const menuItems = isAdmin 
        ? [
            { name: 'Dashboard', icon: 'bi-grid-1x2-fill', path: '/dashboard' },
            { name: 'Rooms', icon: 'bi-door-open-fill', path: '/rooms-admin' },
            { name: 'Tenants', icon: 'bi-people-fill', path: '/tenants' },
            { name: 'Maintenance', icon: 'bi-tools', path: '/maintenance' },
            { name: 'Settings', icon: 'bi-gear-fill', path: '/settings' },
          ]
        : [
            { name: 'My Room', icon: 'bi-house-fill', path: '/dashboard' },
            { name: 'Requests', icon: 'bi-chat-left-text-fill', path: '/maintenance' },
            { name: 'Profile', icon: 'bi-person-badge-fill', path: '/profile' },
            { name: 'Settings', icon: 'bi-gear-fill', path: '/settings' },
          ];

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('user');
            // Logic to clear specific tenant data if needed
            localStorage.removeItem(`requests_${user.id}`); 
            navigate('/login');
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <i className="bi bi-house-door-fill" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                <span>EzRent</span>
            </div>
            
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <i className={`bi ${item.icon}`}></i>
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-left"></i>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;