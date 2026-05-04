/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './UserDetail.css';

const UserDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Sử dụng Lazy Initializer để tránh lỗi setState trong render
    const [displayUser] = useState<any>(() => {
        const passedData = location.state?.tenantData;
        if (passedData) return passedData;

        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const getInitials = (name: any) => {
        if (typeof name !== 'string') return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (!displayUser) {
        return <div className="dashboard-layout"><Sidebar /><main className="main-view"><Header pageTitle="Error" /><div style={{ padding: '20px' }}>User not found</div></main></div>;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <Header pageTitle={location.state?.tenantData ? "Tenant Profile" : "My Profile"} />

                <div className="user-detail-content">
                    <div className="section-title">
                        <button onClick={() => navigate(-1)} style={{ marginBottom: '15px', background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                        <h2>{String(displayUser.name || 'User Detail')}</h2>
                    </div>

                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar-wrapper">
                                {displayUser.avatar ? (
                                    <img src={String(displayUser.avatar)} className="profile-avatar-img" alt="Avatar" />
                                ) : (
                                    <div className="profile-initials">{getInitials(displayUser.name)}</div>
                                )}
                            </div>
                            <div className="profile-basic-info">
                                <h3>{String(displayUser.name || 'N/A')}</h3>
                                <span className="role-badge active">
                                    {String(displayUser.status || displayUser.role || 'TENANT').toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <label><i className="bi bi-person"></i> Full Name</label>
                                <div className="info-value">{String(displayUser.name || 'N/A')}</div>
                            </div>

                            <div className="info-item">
                                <label><i className="bi bi-envelope"></i> Email/Status</label>
                                <div className="info-value">{String(displayUser.email || displayUser.status || 'N/A')}</div>
                            </div>

                            <div className="info-item">
                                <label><i className="bi bi-telephone"></i> Phone Number</label>
                                <div className="info-value">{String(displayUser.phone || displayUser.phoneNumber || 'N/A')}</div>
                            </div>

                            <div className="info-item">
                                <label><i className="bi bi-door-open"></i> Room ID</label>
                                <div className="info-value">{String(displayUser.roomId || 'Not assigned')}</div>
                            </div>

                            <div className="info-item full-width">
                                <label><i className="bi bi-chat-left-text"></i> Note</label>
                                <div className="info-value">{String(displayUser.note || 'No notes available')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDetail;