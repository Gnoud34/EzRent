import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import mockData from '../../data/mockdata.json';
import './Tenants.css';
import Header from '../../components/Header/Header';

// ===== TYPES =====
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

interface TenantFormData {
    name: string;
    phone: string;
    roomId: string;
    moveInDate: string;
    contractEndDate: string;
    status: 'inquiry' | 'active' | 'expired';
    note: string;
}

const Tenants: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'inquiry' | 'active' | 'expired'>('active');
    const [tenants, setTenants] = useState<Tenant[]>(mockData.tenants as Tenant[]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

    const [formData, setFormData] = useState<TenantFormData>({
        name: '',
        phone: '',
        roomId: '',
        moveInDate: '',
        contractEndDate: '',
        status: 'active',
        note: ''
    });


    // ===== HELPERS =====
    const getRoomNumber = (roomId: string) => {
        return mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';
    };

    const isExpired = (tenant: Tenant) => {
        if (!tenant.contractEndDate) return false;
        return new Date(tenant.contractEndDate) < new Date();
    };

    const parseTags = (note?: string) => {
        if (!note) return [];
        return note.split(',').map(t => t.trim());
    };

    // ===== FILTER =====
    const filteredTenants = tenants.filter(t => t.status === activeTab);

    // ===== ACTIONS =====
    const openAddInquiryModal = () => {
        setEditingTenant(null);
        setFormData({
            name: '',
            phone: '',
            roomId: '',
            moveInDate: '',
            contractEndDate: '',
            status: 'inquiry',
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
            moveInDate: tenant.moveInDate || '',
            contractEndDate: tenant.contractEndDate || '',
            status: tenant.status,
            note: tenant.note || ''
        });
        setIsModalOpen(true);
    };

    const handleApproveInquiry = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setFormData({
            name: tenant.name,
            phone: tenant.phone,
            roomId: '',
            moveInDate: new Date().toISOString().split('T')[0],
            contractEndDate: '',
            status: 'active',
            note: tenant.note || ''
        });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTenant) {
            setTenants(prev =>
                prev.map(t =>
                    t.id === editingTenant.id ? { ...t, ...formData } : t
                )
            );
        } else {
            const newTenant: Tenant = {
                id: `T${Date.now()}`,
                ...formData
            };
            setTenants([newTenant, ...tenants]);
        }

        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this tenant?')) {
            setTenants(prev => prev.filter(t => t.id !== id));
        }
    };

    const moveToHistory = (id: string) => {
        setTenants(prev =>
            prev.map(t =>
                t.id === id ? { ...t, status: 'expired' } : t
            )
        );
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-view">
                <Header pageTitle="Tenant Management" />

                <div className="dashboard-content">
                    <div className="section-header">
                        <h2>
                            {activeTab === 'inquiry'
                                ? 'Inquiries'
                                : activeTab === 'active'
                                    ? 'Active Tenants'
                                    : 'History'}
                        </h2>

                        {activeTab === 'inquiry' && (
                            <button className="btn-add" onClick={openAddInquiryModal}>
                                + Add Inquiry
                            </button>
                        )}
                    </div>

                    {/* TABS */}
                    <div className="tabs-bar">
                        <button className={activeTab === 'inquiry' ? 'active' : ''} onClick={() => setActiveTab('inquiry')}>
                            Inquiry
                        </button>
                        <button className={activeTab === 'active' ? 'active' : ''} onClick={() => setActiveTab('active')}>
                            Active
                        </button>
                        <button className={activeTab === 'expired' ? 'active' : ''} onClick={() => setActiveTab('expired')}>
                            History
                        </button>
                    </div>

                    {/* TABLE */}
                    <table className="tenants-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Room</th>
                                <th>Info</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTenants.map(t => (
                                <tr key={t.id}>
                                    <td>{t.name}</td>
                                    <td>{t.phone}</td>
                                    <td>{getRoomNumber(t.roomId)}</td>

                                    <td>
                                        {activeTab === 'inquiry' ? (
                                            <div className="tag-container">
                                                {parseTags(t.note).length > 0 ? (
                                                    parseTags(t.note).map((tag, i) => (
                                                        <span key={i} className="tag">{tag}</span>
                                                    ))
                                                ) : (
                                                    <span className="no-tag">No request</span>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {t.moveInDate || 'N/A'} <br />
                                                <small>End: {t.contractEndDate || 'N/A'}</small>
                                            </>
                                        )}
                                    </td>

                                    <td>
                                        {t.status === 'expired' ? (
                                            <span className="status left">Moved Out</span>
                                        ) : isExpired(t) ? (
                                            <span className="status expired">Expired</span>
                                        ) : (
                                            <span className="status active">Active</span>
                                        )}
                                    </td>

                                    <td>
                                        {activeTab === 'inquiry' && (
                                            <button onClick={() => handleApproveInquiry(t)}>Approve</button>
                                        )}

                                        {activeTab === 'active' && (
                                            <button className="btn-move" onClick={() => moveToHistory(t.id)}>
                                                Move Out
                                            </button>
                                        )}

                                        <button onClick={() => openEditModal(t)}>Edit</button>
                                        <button onClick={() => handleDelete(t.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="modal">
                        <form onSubmit={handleSave} className="modal-box">
                            <h3>Tenant Form</h3>

                            <input placeholder="Name" value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })} />

                            <input placeholder="Phone" value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                            <select value={formData.roomId}
                                onChange={e => setFormData({ ...formData, roomId: e.target.value })}>
                                <option value="">Select room</option>
                                {mockData.rooms.map(r => (
                                    <option key={r.id} value={r.id}>Room {r.number}</option>
                                ))}
                            </select>

                            {formData.status !== 'inquiry' && (
                                <>
                                    <input type="date" value={formData.moveInDate}
                                        onChange={e => setFormData({ ...formData, moveInDate: e.target.value })} />

                                    <input type="date" value={formData.contractEndDate}
                                        onChange={e => setFormData({ ...formData, contractEndDate: e.target.value })} />
                                </>
                            )}

                            <textarea placeholder="Requirements (wifi, pet...)"
                                value={formData.note}
                                onChange={e => setFormData({ ...formData, note: e.target.value })} />

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Tenants;