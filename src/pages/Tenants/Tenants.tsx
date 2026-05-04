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
    status: 'inquiry' | 'active' | 'expired';
    moveInDate?: string;
    contractEndDate?: string;
    note?: string;
}

const Tenants: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'inquiry' | 'active' | 'expired'>('active');
    const [tenants, setTenants] = useState<Tenant[]>(mockData.tenants as Tenant[]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

    const [formData, setFormData] = useState<{
        name: string;
        phone: string;
        roomId: string;
        moveInDate: string;
        contractEndDate: string;
        status: Tenant['status'];
        note: string;
    }>({
        name: '', phone: '', roomId: '', moveInDate: '', contractEndDate: '', status: 'active', note: ''
    });

    const getRoomNumber = (roomId: string) => mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';

    const isExpired = (tenant: Tenant) => {
        if (!tenant.contractEndDate) return false;
        return new Date(tenant.contractEndDate) < new Date();
    };

    const filteredTenants = tenants.filter(t => t.status === activeTab);

    const openAddModal = () => {
        setEditingTenant(null);
        setFormData({ 
            name: '', 
            phone: '', 
            roomId: '', 
            moveInDate: '', 
            contractEndDate: '', 
            status: activeTab === 'inquiry' ? 'inquiry' : 'active', // Tự động set status theo tab
            note: '' 
        });
        setIsModalOpen(true);
    };

    const openEditModal = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setFormData({
            name: tenant.name, phone: tenant.phone, roomId: tenant.roomId,
            moveInDate: tenant.moveInDate || '', contractEndDate: tenant.contractEndDate || '',
            status: tenant.status, note: tenant.note || ''
        });
        setIsModalOpen(true);
    };

    const handleMoveToActive = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setFormData({
            name: tenant.name,
            phone: tenant.phone,
            roomId: '', 
            moveInDate: new Date().toISOString().split('T')[0], // Mặc định ngày hôm nay
            contractEndDate: '',
            status: 'active', 
            note: tenant.note || ''
        });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTenant) {
            setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, ...formData } : t));
        } else {
            setTenants([{ id: `T${Date.now()}`, ...formData }, ...tenants]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this tenant?')) setTenants(prev => prev.filter(t => t.id !== id));
    };

    const moveToHistory = (id: string) => {
        setTenants(prev => prev.map(t => t.id === id ? { ...t, status: 'expired' } : t));
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <Header pageTitle="Tenant Management" />
                <div className="dashboard-content">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Tenant List</h2>
                        <button className="btn-add" onClick={openAddModal} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                            {activeTab === 'inquiry' ? '+ Add New Inquiry' : '+ Add New Tenant'}
                        </button>
                    </div>

                    <div className="tabs-bar">
                        <button className={activeTab === 'inquiry' ? 'active' : ''} onClick={() => setActiveTab('inquiry')}>Inquiry</button>
                        <button className={activeTab === 'active' ? 'active' : ''} onClick={() => setActiveTab('active')}>Active</button>
                        <button className={activeTab === 'expired' ? 'active' : ''} onClick={() => setActiveTab('expired')}>History</button>
                    </div>

                    <table className="tenants-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                {activeTab !== 'inquiry' && <th>Room</th>}
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTenants.map(t => (
                                <tr key={t.id}>
                                    <td><strong>{t.name}</strong></td>
                                    <td>{t.phone}</td>
                                    {activeTab !== 'inquiry' && <td>{getRoomNumber(t.roomId)}</td>}
                                    <td>
                                        <span className={`status ${t.status === 'expired' ? 'left' : isExpired(t) ? 'expired' : 'active'}`}>
                                            {t.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        {activeTab === 'inquiry' && (
                                            <button className="btn-move" onClick={() => handleMoveToActive(t)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>
                                                Move to Active
                                            </button>
                                        )}
                                        {activeTab === 'active' && <button className="btn-move" onClick={() => moveToHistory(t.id)}>Move Out</button>}
                                        <button className="btn-edit" onClick={() => openEditModal(t)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(t.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && (
                    <div className="modal">
                        <form onSubmit={handleSave} className="modal-box">
                            <h3>{editingTenant ? (formData.status === 'active' && editingTenant.status === 'inquiry' ? 'Confirm Move-in' : 'Edit') : 'Add New'}</h3>
                            
                            <label className="form-label">Full Name</label>
                            <input placeholder="Enter name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />

                            <label className="form-label">Phone</label>
                            <input placeholder="Enter phone" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                            {formData.status === 'active' && (
                                <>
                                    <label className="form-label">Room</label>
                                    <select value={formData.roomId} onChange={e => setFormData({ ...formData, roomId: e.target.value })} required>
                                        <option value="">Select room</option>
                                        {mockData.rooms.map(r => {
                                            const isOccupied = tenants.some(t => t.roomId === r.id && t.status === 'active' && t.id !== editingTenant?.id);
                                            return (
                                                <option key={r.id} value={r.id} disabled={isOccupied}>
                                                    Room {r.number} {isOccupied ? '(Occupied)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>

                                    <label className="form-label">Move-in Date</label>
                                    <input type="date" value={formData.moveInDate} onChange={e => setFormData({ ...formData, moveInDate: e.target.value })} required />
                                    
                                    <label className="form-label">Contract End Date</label>
                                    <input type="date" value={formData.contractEndDate} onChange={e => setFormData({ ...formData, contractEndDate: e.target.value })} required />
                                </>
                            )}

                            <label className="form-label">{formData.status === 'inquiry' ? 'Requirements' : 'Notes'}</label>
                            <textarea placeholder="..." value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" style={{ background: '#2563eb', color: 'white' }}>
                                    {editingTenant?.status === 'inquiry' && formData.status === 'active' ? 'Confirm Move In' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Tenants;