import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import StatCard from '../../components/StatCard/StatCard';
import mockData from '../../data/mockdata.json';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [admin, setAdmin] = useState(mockData.users.find(u => u.role === 'admin'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: admin?.name || '', email: admin?.email || '' });
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalRooms = mockData.rooms.length;
    const occupiedRooms = mockData.rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = mockData.rooms.filter(r => r.status === 'available').length;
    const totalTenants = mockData.tenants.length;
    const recentRooms = mockData.rooms.slice(0, 5);
    const recentTenants = mockData.tenants.slice(0, 5);

    const getRoomNumber = (roomId: string) => {
        return mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';
    };

    // Xử lý lưu thông tin chỉnh sửa
    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (admin) {
            setAdmin({ ...admin, name: editForm.name, email: editForm.email });
            setIsEditModalOpen(false);
            setIsDropdownOpen(false);
            alert("Profile updated successfully!");
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar /> 
            <main className="main-view">
                <header className="top-header">
                    <div className="header-title"><h3>Dashboard</h3></div>
                    
                    {/* DROPDOWN PROFILE SECTION */}
                    <div className="admin-profile-container" ref={dropdownRef}>
                        <div className="admin-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <div className="admin-text">
                                <span className="admin-name">{admin?.name || 'Admin'}</span>
                                <span className="admin-email">{admin?.email || 'admin@funhome.com'}</span>
                            </div>
                            <div className="admin-avatar">
                                {admin?.name?.substring(0, 2).toUpperCase() || 'AD'}
                            </div>
                        </div>

                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-header">
                                    <strong>Account Info</strong>
                                    <p>{admin?.role?.toUpperCase()}</p>
                                </div>
                                <div className="dropdown-item">
                                    <i className="bi bi-person"></i> {admin?.name}
                                </div>
                                <div className="dropdown-item">
                                    <i className="bi bi-envelope"></i> {admin?.email}
                                </div>
                                <hr />
                                <button className="dropdown-btn edit" onClick={() => setIsEditModalOpen(true)}>
                                    <i className="bi bi-pencil-square"></i> Edit Profile
                                </button>
                                <button className="dropdown-btn logout">
                                    <i className="bi bi-box-arrow-right"></i> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="dashboard-content">
                    <div className="section-title">
                        <h2>Overview</h2>
                        <p>Current status of your boarding house</p>
                    </div>

                    <div className="stats-container">
                        <StatCard title="Total Rooms" value={totalRooms} icon="bi-buildings" color="#2563eb" bgColor="#eff6ff" />
                        <StatCard title="Occupied Rooms" value={occupiedRooms} icon="bi-house-check-fill" color="#16a34a" bgColor="#f0fdf4" />
                        <StatCard title="Available Rooms" value={availableRooms} icon="bi-door-open" color="#ea580c" bgColor="#fff7ed" />
                        <StatCard title="Total Tenants" value={totalTenants} icon="bi-people-fill" color="#9333ea" bgColor="#faf5ff" />
                    </div>

                    <div className="data-grid">
                        <div className="card-panel">
                            <h4 className="panel-header"><i className="bi bi-list-ul"></i> Recent Rooms</h4>
                            <div className="list-container">
                                {recentRooms.map(room => (
                                    <div key={room.id} className="list-row">
                                        <div className="info-group">
                                            <div className="info-main">{room.number}</div>
                                            <div className="info-sub">Capacity: {room.capacity}</div>
                                        </div>
                                        <span className={`badge ${room.status === 'occupied' ? 'badge-occupied' : 'badge-available'}`}>
                                            {room.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-panel">
                            <h4 className="panel-header"><i className="bi bi-person-lines-fill"></i> Recent Tenants</h4>
                            <div className="list-container">
                                {recentTenants.map(tenant => (
                                    <div key={tenant.id} className="list-row">
                                        <div className="info-group">
                                            <div className="info-main">{tenant.name}</div>
                                            <div className="info-sub">{tenant.phone}</div>
                                        </div>
                                        <span className="room-label">{getRoomNumber(tenant.roomId)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL CHỈNH SỬA THÔNG TIN */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Admin Profile</h3>
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.name} 
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    value={editForm.email} 
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-profile-container { position: relative; cursor: pointer; }
                .profile-dropdown {
                    position: absolute; top: 110%; right: 0; background: white;
                    width: 220px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1001; padding: 10px; border: 1px solid #eee;
                }
                .dropdown-header { padding: 5px 10px; border-bottom: 1px solid #f5f5f5; margin-bottom: 8px; }
                .dropdown-header p { font-size: 11px; color: #64748b; margin: 0; }
                .dropdown-item { padding: 8px 10px; font-size: 14px; color: #334155; display: flex; gap: 10px; }
                .dropdown-btn {
                    width: 100%; text-align: left; padding: 8px 10px; border: none;
                    background: none; cursor: pointer; font-size: 14px; border-radius: 4px;
                    display: flex; gap: 10px; transition: 0.2s;
                }
                .dropdown-btn:hover { background: #f1f5f9; }
                .dropdown-btn.edit { color: #2563eb; }
                .dropdown-btn.logout { color: #dc2626; }
                
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;
                }
                .modal-content { background: white; padding: 25px; border-radius: 12px; width: 350px; }
                .form-group { margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
                .form-group input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
                .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
                .btn-save { background: #2563eb; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; }
                .btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default Dashboard;