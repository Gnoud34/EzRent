import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import mockData from '../../../../public/mockdata.json';
import './Tenants.css';

interface Tenant {
    id: string;
    name: string;
    phone: string;
    roomId?: string;       // ✅ optional - inquiry tenant có thể không có
    moveInDate?: string;   // ✅ optional
    status?: string;
    email?: string;
}

const Tenants: React.FC = () => {
    // ✅ Chỉ lấy tenant có status active để hiển thị
    const activeTenants = (mockData.tenants as Tenant[]).filter(
        t => !t.status || t.status === 'active'
    );

    const [tenants, setTenants] = useState<Tenant[]>(activeTenants);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        roomId: '',
        moveInDate: new Date().toISOString().split('T')[0]
    });

    const admin = mockData.users.find(u => u.role === 'admin');

    const getRoomNumber = (roomId?: string) => {
        if (!roomId) return 'N/A';
        return mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';
    };

    const openAddModal = () => {
        setEditingTenant(null);
        setFormData({ name: '', phone: '', roomId: '', moveInDate: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const openEditModal = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setFormData({
            name: tenant.name,
            phone: tenant.phone,
            roomId: tenant.roomId || '',
            moveInDate: tenant.moveInDate || new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTenant) {
            setTenants(tenants.map(t => t.id === editingTenant.id ? { ...t, ...formData } : t));
        } else {
            const newEntry: Tenant = { id: `T${Date.now()}`, status: 'active', ...formData };
            setTenants([newEntry, ...tenants]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure?')) {
            setTenants(tenants.filter(t => t.id !== id));
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-view">
                <header className="top-header">
                    <div className="header-title"><h3>Tenants Management</h3></div>
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
                            <h2>Tenants List</h2>
                            <p>Manage all residents</p>
                        </div>
                        <button className="btn-add" onClick={openAddModal}>
                            <i className="bi bi-person-plus-fill"></i> Add New Tenant
                        </button>
                    </div>

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
                                        <td>
                                            <span className="room-badge">{getRoomNumber(tenant.roomId)}</span>
                                        </td>
                                        <td>
                                            {tenant.moveInDate
                                                ? new Date(tenant.moveInDate).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon edit" onClick={() => openEditModal(tenant)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn-icon delete" onClick={() => handleDelete(tenant.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingTenant ? 'Edit Tenant' : 'Add New Tenant'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" required value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" required value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Assign Room</label>
                                <select value={formData.roomId}
                                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })} required>
                                    <option value="" disabled>-- Select a room --</option>
                                    {mockData.rooms.map(room => {
                                        const isCurrentRoom = room.id === editingTenant?.roomId;
                                        const isOccupied = room.status === 'occupied';
                                        return (
                                            <option key={room.id} value={room.id}
                                                disabled={isOccupied && !isCurrentRoom}>
                                                Room {room.number}
                                                {isCurrentRoom ? ' (Current)' : isOccupied ? ' (Occupied)' : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Move-in Date</label>
                                <input type="date" required value={formData.moveInDate}
                                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">
                                    {editingTenant ? 'Update Changes' : 'Save Tenant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .action-buttons { display: flex; gap: 8px; }
                .btn-icon { border: none; padding: 6px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
                .btn-icon.edit { color: #2563eb; background: #eff6ff; }
                .btn-icon.delete { color: #dc2626; background: #fef2f2; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 400px; }
                .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 5px; }
                .form-group label { font-size: 14px; font-weight: 500; color: #475569; }
                .form-group input, .form-group select { padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }
                select option:disabled { color: #94a3b8; background-color: #f1f5f9; }
                .modal-actions { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; }
                .btn-save { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
                .btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default Tenants;