import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './UserSidebar.css';

const UserSidebar: React.FC = () => {
  const navigate = useNavigate();


  const menuItems = [
    {
      name: 'Dashboard',
      path: '/tenant/dashboard',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} />
        </svg>
      ),
    },
    {
      name: 'My Room',
      path: '/tenant/my-room',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      path: '/tenant/profile',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      ),
    },
    {
      name: 'Request',
      path: '/tenant/maintenance',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <aside className="usb-sidebar">
      <div className="usb-logo">
        <div className="usb-logo-icon">
          <svg width="18" height="18" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span>EzRent</span>
      </div>

      <nav className="usb-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `usb-nav-item ${isActive ? 'usb-nav-item--active' : ''}`
                }
              >
                <span className="usb-nav-icon">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="usb-footer">
        <button className="usb-logout" onClick={handleLogout}>
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;