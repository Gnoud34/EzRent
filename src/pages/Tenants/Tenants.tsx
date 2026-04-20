import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import mockData from '../../data/mockdata.json';
import './Tenants.css';
import Header from '../../components/Header/Header';

interface Tenant {
    id: string;
    name: string;
    phone: string;
    roomId: string;
    moveInDate: string;
}

const Tenants: React.FC = () => {
    const [tenants, setTenants] = useState<Tenant[]>(mockData.tenants);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Tenant Form State
    const [newTenant, setNewTenant] = useState({
        name: '',
        phone: '',
        roomId: mockData.rooms[0]?.id || '', // Default to first room
        moveInDate: new Date().toISOString().split('T')[0] // Default to today
    });

    // const admin = mockData.users.find(u => u.role === 'admin');

    const getRoomNumber = (roomId: string) => {
        return mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure?')) {
            setTenants(tenants.filter(t => t.id !== id));
        }
    };

    // --- CREATE HANDLER ---
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        const createdTenant: Tenant = {
            id: `T${Date.now()}`, // Generate unique ID
            ...newTenant
        };

        setTenants([createdTenant, ...tenants]); // Add to the top of the list
        setIsModalOpen(false); // Close modal
        setNewTenant({ name: '', phone: '', roomId: mockData.rooms[0]?.id, moveInDate: new Date().toISOString().split('T')[0] }); // Reset form
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-view">
                <Header pageTitle="Tenants" />


                <div className="dashboard-content">
                    <div className="section-header">
                        <div>
                            <h2>Tenants List</h2>
                            <p>Manage all residents</p>
                        </div>
                        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                            <i className="bi bi-person-plus-fill"></i> Add New Tenant
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="table-container">
                        <table className="tenants-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Room</th>
                                    <th>Move-in</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map(tenant => (
                                    <tr key={tenant.id}>
                                        <td>{tenant.name}</td>
                                        <td>{tenant.phone}</td>
                                        <td><span className="room-badge">{getRoomNumber(tenant.roomId)}</span></td>
                                        <td>{new Date(tenant.moveInDate).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn-icon delete" onClick={() => handleDelete(tenant.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- ADD NEW TENANT MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Tenant</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text" required
                                    value={newTenant.name}
                                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text" required
                                    value={newTenant.phone}
                                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Assign Room</label>
                                <select
                                    value={newTenant.roomId}
                                    onChange={(e) => setNewTenant({ ...newTenant, roomId: e.target.value })}
                                >
                                    {mockData.rooms.map(room => (
                                        <option key={room.id} value={room.id}>
                                            Room {room.number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">Save Tenant</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
                }
                .modal-content {
                    background: white; padding: 2rem; border-radius: 12px; width: 400px;
                }
                .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; }
                .form-group label { margin-bottom: 5px; font-weight: 500; }
                .form-group input, .form-group select { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
                .modal-actions { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; }
                .btn-save { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
                .btn-cancel { background: #f1f5f9; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default Tenants;