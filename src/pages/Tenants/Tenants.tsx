/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import mockData from '../../data/mockdata.json';
import './Tenants.css';

// Cập nhật Interface với trường moveInDate tùy chọn và thêm status
interface Tenant {
    id: string;
    name: string;
    phone: string;
    roomId: string;
    status: 'inquiry' | 'active' | 'expired'; // Thêm phân loại trạng thái
    moveInDate?: string; // Trạng thái optional như Dương mong muốn
    note?: string;
}
interface TenantFormData {
    name: string;
    phone: string;
    roomId: string;
    moveInDate: string;
    status: 'inquiry' | 'active' | 'expired'; // Chỉ định rõ các giá trị được phép
    note: string;
}

const Tenants: React.FC = () => {
    // Quản lý Tab hiện tại
    const [activeTab, setActiveTab] = useState<'inquiry' | 'active' | 'expired'>('active');
    const [tenants, setTenants] = useState<Tenant[]>(mockData.tenants as Tenant[]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

    const [formData, setFormData] = useState<TenantFormData>({
        name: '',
        phone: '',
        roomId: '',
        moveInDate: new Date().toISOString().split('T')[0],
        status: 'active', // Giá trị khởi tạo hợp lệ
        note: ''
    });

    const admin = mockData.users.find(u => u.role === 'admin');

    const getRoomNumber = (roomId: string) => {
        return mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';
    };

    // Lọc danh sách dựa trên Tab đang chọn
    const filteredTenants = tenants.filter(t => t.status === activeTab);

    const openAddModal = () => {
        setEditingTenant(null);
        setFormData({
            name: '',
            phone: '',
            roomId: '',
            moveInDate: new Date().toISOString().split('T')[0],
            status: activeTab, // Mặc định tạo user theo Tab hiện tại
            note: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setFormData({
            name: tenant.name,
            phone: tenant.phone,
            roomId: tenant.roomId,
            moveInDate: tenant.moveInDate || new Date().toISOString().split('T')[0],
            status: tenant.status,
            note: tenant.note || ''
        });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Nếu là khách vãng lai (inquiry), ta có thể xóa moveInDate trước khi lưu nếu cần
        const dataToSave = { ...formData };
        if (activeTab === 'inquiry') {
            delete (dataToSave as any).moveInDate;
        }

        if (editingTenant) {
            setTenants(tenants.map(t => t.id === editingTenant.id ? { ...t, ...dataToSave } : t));
        } else {
            const newEntry: Tenant = { id: `T${Date.now()}`, ...dataToSave } as Tenant;
            setTenants([newEntry, ...tenants]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to remove this record?')) {
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
                            <p>Manage your {activeTab} residents</p>
                        </div>
                        <button className="btn-add" onClick={openAddModal}>
                            <i className="bi bi-person-plus-fill"></i> Add {activeTab === 'inquiry' ? 'Inquiry' : 'Tenant'}
                        </button>
                    </div>

                    {/* Thanh điều hướng Tab */}
                    <div className="tabs-bar">
                        <button className={activeTab === 'inquiry' ? 'tab-item active' : 'tab-item'} onClick={() => setActiveTab('inquiry')}>Inquiries</button>
                        <button className={activeTab === 'active' ? 'tab-item active' : 'tab-item'} onClick={() => setActiveTab('active')}>Active Tenants</button>
                        <button className={activeTab === 'expired' ? 'tab-item active' : 'tab-item'} onClick={() => setActiveTab('expired')}>History</button>
                    </div>

                    <div className="table-container">
                        <table className="tenants-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Room</th>
                                    {activeTab === 'inquiry' ? <th>Note</th> : <th>Move-in</th>}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTenants.map(tenant => (
                                    <tr key={tenant.id}>
                                        <td className="tenant-name-cell">
                                            <div className="tenant-icon">{tenant.name.substring(0, 1)}</div>
                                            {tenant.name}
                                        </td>
                                        <td>{tenant.phone}</td>
                                        <td><span className={tenant.roomId ? "room-badge" : "room-badge empty"}>
                                            {tenant.roomId ? getRoomNumber(tenant.roomId) : 'N/A'}
                                        </span></td>
                                        <td>
                                            {activeTab === 'inquiry'
                                                ? (tenant.note || 'No notes')
                                                : (tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : 'N/A')}
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
                        {filteredTenants.length === 0 && <p className="empty-state">No {activeTab} records found.</p>}
                    </div>
                </div>
            </main>

            {/* Modal - Giữ nguyên cấu trúc của bạn nhưng thêm hiển thị có điều kiện cho Move-in Date */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingTenant ? 'Edit' : 'Add'} {activeTab === 'inquiry' ? 'Inquiry' : 'Tenant'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Room (Optional for inquiries)</label>
                                <select value={formData.roomId} onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}>
                                    <option value="">-- Select a room --</option>
                                    {mockData.rooms.map(room => (
                                        <option key={room.id} value={room.id} disabled={room.status === 'occupied' && room.id !== editingTenant?.roomId}>
                                            Room {room.number} {room.status === 'occupied' ? '(Occupied)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {activeTab !== 'inquiry' && (
                                <div className="form-group">
                                    <label>Move-in Date</label>
                                    <input type="date" required value={formData.moveInDate} onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })} />
                                </div>
                            )}

                            {activeTab === 'inquiry' && (
                                <div className="form-group">
                                    <label>Notes / Requirements</label>
                                    <textarea className="form-input-text" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .tabs-bar { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
                .tab-item { padding: 10px 20px; border: none; background: none; cursor: pointer; color: #64748b; font-weight: 500; border-bottom: 2px solid transparent; }
                .tab-item.active { color: #2563eb; border-bottom: 2px solid #2563eb; }
                .room-badge.empty { background-color: #f1f5f9; color: #94a3b8; }
                .empty-state { padding: 40px; text-align: center; color: #94a3b8; }
                .form-input-text { padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; min-height: 80px; }
            `}</style>
        </div>
    );
};

export default Tenants;