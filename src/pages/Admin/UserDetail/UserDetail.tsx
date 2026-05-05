import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import mockData from '../../../data/mockdata.json'; // To map roomId to Room Number
import './UserDetail.css';

// 1. Define a flexible interface for both Admin and Tenant data
interface DetailUser {
    name?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
    avatar?: string | null;
    status?: string;
    role?: string;
    roomId?: string;
    note?: string;
}

const UserDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Check if we are viewing a tenant (passed via state) or ourselves
    const isTenantView = !!location.state?.tenantData;

    const [displayUser] = useState<DetailUser | null>(() => {
        const passedData = location.state?.tenantData;
        if (passedData) return passedData;

        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const getInitials = (name?: string) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRoomNumber = (id?: string) => {
        if (!id) return 'Not assigned';
        const room = mockData.rooms.find(r => r.id === id);
        return room ? `Room ${room.number}` : id;
    };

    if (!displayUser) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="main-view">
                    <Header pageTitle="Error" />
                    <div className="error-container">
                        <p>User not found or session expired.</p>
                        <button onClick={() => navigate(-1)}>Go Back</button>
                    </div>
                </main>
            </div>
        );
    }

    // Determine values based on available keys
    const userName = displayUser.name || 'Unknown User';
    const userPhone = displayUser.phone || displayUser.phoneNumber || 'N/A';
    const userRoleOrStatus = (displayUser.status || displayUser.role || 'Member').toUpperCase();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <Header pageTitle={isTenantView ? "Tenant Profile" : "My Profile"} />

                <div className="user-detail-content">
                    <div className="detail-actions">
                        <button className="btn-back" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                    </div>

                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar-wrapper">
                                {displayUser.avatar ? (
                                    <img src={displayUser.avatar} className="profile-avatar-img" alt="Avatar" />
                                ) : (
                                    <div className="profile-initials">{getInitials(userName)}</div>
                                )}
                            </div>
                            <div className="profile-main-meta">
                                <h3>{userName}</h3>
                                <span className={`role-badge ${userRoleOrStatus.toLowerCase()}`}>
                                    {userRoleOrStatus}
                                </span>
                            </div>
                        </div>

                        <hr className="divider" />

                        <div className="info-grid">
                            <div className="info-item">
                                <label><i className="bi bi-person"></i> Full Name</label>
                                <div className="info-value">{userName}</div>
                            </div>

                            <div className="info-item">
                                <label><i className="bi bi-envelope"></i> Contact / Email</label>
                                <div className="info-value">{displayUser.email || 'No email provided'}</div>
                            </div>

                            <div className="info-item">
                                <label><i className="bi bi-telephone"></i> Phone Number</label>
                                <div className="info-value">{userPhone}</div>
                            </div>

                            <div className="info-item">
                                <label><i className="bi bi-door-open"></i> Assigned Room</label>
                                <div className="info-value">{getRoomNumber(displayUser.roomId)}</div>
                            </div>

                            <div className="info-item full-width">
                                <label><i className="bi bi-chat-left-text"></i> Notes & Requirements</label>
                                <div className="info-value note-box">
                                    {displayUser.note || 'No additional notes provided for this user.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDetail;