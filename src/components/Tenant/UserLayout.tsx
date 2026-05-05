import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import './UserLayout.css';

const PAGE_TITLES: Record<string, string> = {
  '/tenant/dashboard':   'Dashboard',
  '/tenant/my-room':     'My Room',
  '/tenant/profile':     'Profile',
  '/tenant/maintenance': 'Maintenance',
};

const UserLayout: React.FC = () => {
  const { pathname } = useLocation();
  const pageTitle = PAGE_TITLES[pathname] ?? 'Dashboard';

  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const getInitials = (name: string) => {
    if (!name) return 'NV';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="ul-root">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main */}
      <div className="ul-main">
        {/* Header */}
        <header className="ul-header">
          <h2 className="ul-page-title">{pageTitle}</h2>

          <div className="ul-header-right">
            <div className="ul-user-info">
              <span className="ul-user-name">{userData.name || 'Nguyễn Văn An'}</span>
              <span className="ul-user-email">{userData.email || ''}</span>
            </div>
            <div className="ul-avatar">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerText = getInitials(userData.name);
                  }}
                />
              ) : (
                getInitials(userData.name || '')
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="ul-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;