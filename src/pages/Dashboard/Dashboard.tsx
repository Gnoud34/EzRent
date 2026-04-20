import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import StatCard from '../../components/StatCard/StatCard';
import mockData from '../../data/mockdata.json';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    // 1. Lấy thông tin Admin từ danh sách users
    const admin = mockData.users.find(u => u.role === 'admin');

    // 2. Tính toán các chỉ số thống kê từ mockData
    const totalRooms = mockData.rooms.length;
    const occupiedRooms = mockData.rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = mockData.rooms.filter(r => r.status === 'available').length;
    const totalTenants = mockData.tenants.length;

    // 3. Lấy danh sách hiển thị (5 mục mới nhất)
    const recentRooms = mockData.rooms.slice(0, 5);
    const recentTenants = mockData.tenants.slice(0, 5);

    // Hàm hỗ trợ tìm số phòng dựa trên roomId của tenant
    const getRoomNumber = (roomId: string) => {
        return mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';
    };

    return (
        <div className="dashboard-layout">
            {/* Thành phần Menu bên trái */}
            <Sidebar />

            <main className="main-view">
                {/* Header phía trên */}
                <header className="top-header">
                    <div className="header-title">
                        <h3>Dashboard</h3>
                    </div>
                    <div className="admin-profile">
                        <div className="admin-text">
                            <span className="admin-name">{admin?.name || 'Admin'}</span>
                            <span className="admin-email">{admin?.email || 'admin@funhome.com'}</span>
                        </div>
                        <div className="admin-avatar">
                            {admin?.name?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Tiêu đề phần nội dung */}
                    <div className="section-title">
                        <h2>Overview</h2>
                        <p>Current status of your boarding house</p>
                    </div>

                    {/* Hàng thẻ thống kê - Sử dụng Bootstrap Icons */}
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

                    {/* Lưới hiển thị danh sách chi tiết */}
                    <div className="data-grid">

                        {/* Danh sách phòng gần đây */}
                        <div className="card-panel">
                            <h4 className="panel-header">
                                <i className="bi bi-list-ul"></i> Recent Rooms
                            </h4>
                            <div className="list-container">
                                {recentRooms.map(room => (
                                    <div key={room.id} className="list-row">
                                        <div className="info-group">
                                            <div className="info-main">{room.number}</div>
                                            <div className="info-sub">Capacity: {room.capacity} person(s)</div>
                                        </div>
                                        <span className={`badge ${room.status === 'occupied' ? 'badge-occupied' : 'badge-available'}`}>
                                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Danh sách khách thuê gần đây */}
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
                                        <span className="room-label">
                                            {getRoomNumber(tenant.roomId)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;