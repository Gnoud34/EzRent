import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const menuItems = [
        { name: 'Dashboard', icon: 'bi-grid-1x2-fill', path: '/' },
        { name: 'Rooms', icon: 'bi-door-open-fill', path: '/rooms' },
        { name: 'Tenants', icon: 'bi-people-fill', path: '/tenants' },
        { name: 'Maintenance', icon: 'bi-tools', path: '/maintenance' },
        { name: 'Settings', icon: 'bi-gear-fill', path: '/settings' },
    ];

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
                <div className="logout-btn">
                    <i className="bi bi-box-arrow-left" style={{ marginRight: '12px' }}></i>
                    Logout
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;