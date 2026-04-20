import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const menuItems = [
        { name: 'Dashboard', icon: 'bi-grid-1x2-fill' },
        { name: 'Rooms', icon: 'bi-door-open-fill' },
        { name: 'Tenants', icon: 'bi-people-fill' },
        { name: 'Maintenance', icon: 'bi-tools' },
        { name: 'Settings', icon: 'bi-gear-fill' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <i className="bi bi-house-door-fill" style={{ fontSize: '24px', color: '#2563eb' }}></i>
                EzRent
            </div>
            <ul className="sidebar-nav">
                {menuItems.map((item) => (
                    <li key={item.name} className={`nav-item ${item.name === 'Dashboard' ? 'active' : ''}`}>
                        <i className={`bi ${item.icon}`} style={{ marginRight: '12px' }}></i>
                        {item.name}
                    </li>
                ))}
            </ul>
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