import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import mockData from '../../../data/mockdata.json';
import './Maintenances.css';

interface MaintenanceRequest {
    id: string;
    roomNumber: string;
    description: string;
    status: string;
    createdAt: string;
    createdBy: string;
}

const Maintenances: React.FC = () => {
    const [requests, setRequests] = useState<MaintenanceRequest[]>(mockData.maintenanceRequests);
    const [filter, setFilter] = useState('all');

    const admin = mockData.users.find(u => u.role === 'admin');

    const filteredRequests = requests.filter(req => {
        if (filter === 'all') return true;
        return req.status === filter;
    });

    const getTenantName = (tenantId: string) => {
        return mockData.tenants.find(t => t.id === tenantId)?.name || 'Unknown';
    };

    const handleUpdateStatus = (id: string, newStatus: string) => {
        setRequests(requests.map(req => 
            req.id === id ? { ...req, status: newStatus } : req
        ));
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <header className="top-header">
                    <div className="header-title"><h3>Maintenance Management</h3></div>
                    <div className="admin-profile">
                        <div className="admin-text">
                            <span className="admin-name">{admin?.name}</span>
                            <span className="admin-email">{admin?.email}</span>
                        </div>
                        <div className="admin-avatar">{admin?.name?.substring(0, 2).toUpperCase()}</div>
                    </div>
                </header>

                <div className="dashboard-content">
                    <div className="section-header">
                        <div>
                            <h2>Repair Requests</h2>
                            <p>Track and manage room maintenance</p>
                        </div>
                        <div className="filter-group">
                            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                            <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
                            <button className={filter === 'resolved' ? 'active' : ''} onClick={() => setFilter('resolved')}>Resolved</button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="maintenance-table">
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>Description</th>
                                    <th>Requested By</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map(req => (
                                    <tr key={req.id}>
                                        <td className="room-col"><strong>{req.roomNumber}</strong></td>
                                        <td className="desc-col">{req.description}</td>
                                        <td>{getTenantName(req.createdBy)}</td>
                                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${req.status}`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            {req.status === 'pending' ? (
                                                <button 
                                                    className="btn-resolve"
                                                    onClick={() => handleUpdateStatus(req.id, 'resolved')}
                                                >
                                                    Mark Resolved
                                                </button>
                                            ) : (
                                                <button className="btn-done" disabled>Fixed</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredRequests.length === 0 && (
                            <div className="no-data">No maintenance requests found.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Maintenances;