import React from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import StatCard from '../../../components/StatCard/StatCard';
import Header from '../../../components/Header/Header';
import mockData from '../../../data/mockdata.json';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const totalRooms = mockData.rooms.length;
    const occupiedRooms = mockData.rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = mockData.rooms.filter(r => r.status === 'available').length;
    const totalTenants = mockData.tenants.length;

    const recentRooms = mockData.rooms.slice(0, 5);
    const recentTenants = mockData.tenants.slice(0, 5);

    const getRoomNumber = (roomId: string) => {
        return mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <Header pageTitle="Dashboard" />
                <div className="dashboard-content">
                    <div className="section-title">
                        <h2>Overview</h2>
                        <p>Current status of your property management</p>
                    </div>

                    <div className="stats-container">
                        <StatCard
                            title="Total Rooms"
                            value={totalRooms}
                            icon="bi-buildings"
                            color="#2563eb"
                            bgColor="#eff6ff"
                        />
                        <StatCard
                            title="Occupied Rooms"
                            value={occupiedRooms}
                            icon="bi-house-check-fill"
                            color="#16a34a"
                            bgColor="#f0fdf4"
                        />
                        <StatCard
                            title="Available Rooms"
                            value={availableRooms}
                            icon="bi-door-open"
                            color="#ea580c"
                            bgColor="#fff7ed"
                        />
                        <StatCard
                            title="Total Tenants"
                            value={totalTenants}
                            icon="bi-people-fill"
                            color="#9333ea"
                            bgColor="#faf5ff"
                        />
                    </div>

                    <div className="data-grid">
                        <div className="card-panel">
                            <h4 className="panel-header">
                                <i className="bi bi-list-ul"></i> Recent Rooms
                            </h4>
                            <div className="list-container">
                                {recentRooms.map(room => (
                                    <div key={room.id} className="list-row">
                                        <div className="info-group">
                                            <div className="info-main">Room {room.number}</div>
                                            <div className="info-sub">Capacity: {room.capacity}</div>
                                        </div>
                                        <span className={`badge ${room.status === 'occupied' ? 'badge-occupied' : 'badge-available'}`}>
                                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-panel">
                            <h4 className="panel-header">
                                <i className="bi bi-person-lines-fill"></i> Recent Tenants
                            </h4>
                            <div className="list-container">
                                {recentTenants.map(tenant => (
                                    <div key={tenant.id} className="list-row">
                                        <div className="info-group">
                                            <div className="info-main">{tenant.name}</div>
                                            <div className="info-sub">{tenant.phone}</div>
                                        </div>
                                        <span className="room-label">Room {getRoomNumber(tenant.roomId)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .room-label {
                    background-color: #f0fdf4;
                    color: #16a34a;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .badge-occupied { background: #dcfce7; color: #166534; }
                .badge-available { background: #fef9c3; color: #854d0e; }
            `}</style>
        </div>
    );
};

export default Dashboard;