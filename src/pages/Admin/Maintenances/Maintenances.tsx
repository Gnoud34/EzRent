import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import mockData from '../../../data/mockdata.json';
import './Maintenances.css';
import Header from '../../../components/Header/Header';

interface MaintenanceRequest {
    id: string;
    roomNumber: string;
    title: string; 
    description: string;
    status: string;
    createdAt: string;
    createdBy: string;
}

const Maintenances: React.FC = () => {
    const [requests, setRequests] = useState<MaintenanceRequest[]>(mockData.maintenanceRequests as any);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const categories = [
        { id: 'all', label: 'All Categories' },
        { id: 'Maintenance', label: 'Maintenance' },
        { id: 'Room Issue', label: 'Room Issue' },
        { id: 'Early Checkout', label: 'Early Checkout' },
        { id: 'Other', label: 'Other' }
    ];

    const filteredRequests = requests.filter(req => {
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || req.title === categoryFilter;
        return matchesStatus && matchesCategory;
    });

    const getTenantName = (tenantId: string) => {
        return mockData.tenants.find(t => t.id === tenantId)?.name || 'Unknown Tenant';
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
                <Header pageTitle="Maintenance Management" />

                <div className="dashboard-content">
                    <div className="section-header-main">
                        <div>
                            <h2>Repair Requests</h2>
                            <p>Track and manage room maintenance tasks</p>
                        </div>

                        <div className="filters-container">
                            <div className="filter-group">
                                <button 
                                    className={statusFilter === 'all' ? 'active' : ''} 
                                    onClick={() => setStatusFilter('all')}
                                >
                                    All Status
                                </button>
                                <button 
                                    className={statusFilter === 'pending' ? 'active' : ''} 
                                    onClick={() => setStatusFilter('pending')}
                                >
                                    Pending
                                </button>
                                <button 
                                    className={statusFilter === 'resolved' ? 'active' : ''} 
                                    onClick={() => setStatusFilter('resolved')}
                                >
                                    Resolved
                                </button>
                            </div>

                            <div className="category-tags">
                                {categories.map(cat => (
                                    <span
                                        key={cat.id}
                                        className={`category-tag ${categoryFilter === cat.id ? 'active' : ''}`}
                                        onClick={() => setCategoryFilter(cat.id)}
                                    >
                                        {cat.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="maintenance-table">
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>Category</th>
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
                                        <td>
                                            <span className="table-category-label">{req.title}</span>
                                        </td>
                                        <td className="desc-col">
                                            <div className="desc-text" title={req.description}>
                                                {req.description}
                                            </div>
                                        </td>
                                        <td>{getTenantName(req.createdBy)}</td>
                                        <td>{req.createdAt}</td>
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
                            <div className="no-data">No requests found matching these filters.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Maintenances;