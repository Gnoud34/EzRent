import React, { useState, useMemo } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import mockData from '../../../data/mockdata.json';
import { useNavigate } from 'react-router-dom';
import './Tenants.css';

interface Tenant {
    id: string;
    name: string;
    phone: string;
    roomId: string;
    status: 'inquiry' | 'active' | 'expired';
    moveInDate?: string;
    expireDate?: string;
    note?: string;
}

const Tenants: React.FC = () => {
    const navigate = useNavigate();

    // 2. State
    const [activeTab, setActiveTab] = useState<Tenant['status']>('active');
    const [searchTerm, setSearchTerm] = useState('');
    const [tenants, setTenants] = useState<Tenant[]>(mockData.tenants as Tenant[]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

    const [formData, setFormData] = useState({
        name: '', phone: '', roomId: '', moveInDate: '', expireDate: '', status: 'active' as Tenant['status'], note: ''
    });

    const getRoomNumber = (roomId: string) => mockData.rooms.find(r => r.id === roomId)?.number || 'N/A';

    const isExpired = (tenant: Tenant) => {
        if (!tenant.expireDate) return false;
        return new Date(tenant.expireDate) < new Date();
    };

    const displayTenants = useMemo(() => {
        return tenants
            .filter(t => t.status === activeTab)
            .filter(t => 
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                t.phone.includes(searchTerm)
            )
            .sort((a, b) => {
                if (!a.expireDate || !b.expireDate) return 0;
                return new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime();
            });
    }, [tenants, activeTab, searchTerm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (tenant?: Tenant, forceStatus?: Tenant['status']) => {
        if (tenant) {
            setEditingTenant(tenant);
            setFormData({
                name: tenant.name, phone: tenant.phone, roomId: tenant.roomId || '',
                moveInDate: tenant.moveInDate || '', expireDate: tenant.expireDate || '',
                status: forceStatus || tenant.status, note: tenant.note || ''
            });
        } else {
            setEditingTenant(null);
            setFormData({
                name: '', phone: '', roomId: '', moveInDate: '', expireDate: '', 
                status: activeTab === 'expired' ? 'active' : activeTab, note: ''
            });
        }
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

    const deleteTenant = (id: string) => {
        if (confirm('Are you sure you want to delete this record?')) {
            setTenants(prev => prev.filter(t => t.id !== id));
        }
    };

    const updateStatus = (id: string, newStatus: Tenant['status']) => {
        setTenants(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <Header pageTitle="Tenants" />
                
                <div className="dashboard-content">
                    <div className="section-header">
                        <div className="header-left">
                            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tenants</h2>
                            <input 
                                type="text" 
                                placeholder="Search by name or phone..." 
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn-add" onClick={() => openModal()}>
                            + Add {activeTab === 'inquiry' ? 'Inquiry' : 'Tenant'}
                        </button>
                    </div>

                    <div className="tabs-bar">
                        {(['inquiry', 'active', 'expired'] as const).map(tab => (
                            <button 
                                key={tab}
                                className={activeTab === tab ? 'active' : ''} 
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'expired' ? 'History' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="table-container">
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
                                {displayTenants.length > 0 ? displayTenants.map(t => (
                                    <tr key={t.id}>
                                        <td className="tenant-link" onClick={() => navigate('/user-detail', { state: { tenantData: t } })}>
                                            <strong>{t.name}</strong>
                                        </td>
                                        <td>{t.phone}</td>
                                        {activeTab !== 'inquiry' && <td>Room {getRoomNumber(t.roomId)}</td>}
                                        <td>
                                            <span className={`badge ${t.status === 'expired' ? 'left' : isExpired(t) ? 'expired' : 'active'}`}>
                                                {isExpired(t) && t.status === 'active' ? 'EXPIRED' : t.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            {activeTab === 'inquiry' && (
                                                <button className="btn-move" onClick={() => openModal(t, 'active')}>Move In</button>
                                            )}
                                            {activeTab === 'active' && (
                                                <button className="btn-move-out" onClick={() => updateStatus(t.id, 'expired')}>Move Out</button>
                                            )}
                                            <button className="btn-icon" onClick={() => openModal(t)} title="Edit"><i className="bi bi-pencil"></i></button>
                                            <button className="btn-icon delete" onClick={() => deleteTenant(t.id)} title="Delete"><i className="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="empty-row">No records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <form onSubmit={handleSave} className="modal-box">
                            <h3>{editingTenant ? 'Update Tenant' : 'New Entry'}</h3>
                            
                            <div className="form-grid">
                                <div className="field">
                                    <label>Name</label>
                                    <input name="name" required value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="field">
                                    <label>Phone</label>
                                    <input name="phone" required value={formData.phone} onChange={handleInputChange} />
                                </div>
                                
                                {formData.status === 'active' && (
                                    <>
                                        <div className="field">
                                            <label>Room</label>
                                            <select name="roomId" value={formData.roomId} onChange={handleInputChange} required>
                                                <option value="">Select Room</option>
                                                {mockData.rooms.map(r => (
                                                    <option key={r.id} value={r.id}>Room {r.number}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="field">
                                            <label>Move-in Date</label>
                                            <input name="moveInDate" type="date" value={formData.moveInDate} onChange={handleInputChange} required />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Tenants;