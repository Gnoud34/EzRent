import React from 'react';
import './Header.css';

interface HeaderProps {
    pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const getInitials = (name: string) => {
        if (!name) return "AD";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <header className="top-header">
            <div className="header-left">
                <h2 className="page-name">{pageTitle}</h2>
            </div>
            <div className="header-right">
                <div className="user-info">
                    <span className="user-name">{userData.name || 'Admin'}</span>
                    <span className="user-email">{userData.email || 'admin@ezrent.com'}</span>
                </div>

                <div className="user-avatar">
                    {userData.avatar ? (
                        <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="avatar-img"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerText = getInitials(userData.name);
                            }}
                        />
                    ) : (
                        getInitials(userData.name)
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;