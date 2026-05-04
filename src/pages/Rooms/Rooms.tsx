/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import mockData from '../../data/mockdata.json';
import Header from '../../components/Header/Header';
import './Rooms.css';

interface Room {
    id: string;
    number: string;
    capacity: number;
    status: string;
    notes: string;
    images: string[];
}

// interface Tenant {
//     id: string;
//     name: string;
//     phone: string;
//     roomId: string;
//     moveInDate?: string;
//     status: string;
// }

const Rooms: React.FC = () => {
    // 1. Khởi tạo danh sách phòng và bổ sung ảnh mặc định nếu thiếu
    const [rooms, setRooms] = useState<Room[]>(mockData.rooms.map(r => ({
        ...r,
        images: (r as any).images || [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400"
        ]
    })));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [selectedRoomDetail, setSelectedRoomDetail] = useState<Room | null>(null);

    const [roomForm, setRoomForm] = useState({
        number: '',
        capacity: 1,
        status: 'available',
        notes: '',
        heroImage: ''
    });

    // Hàm lấy danh sách người thuê thuộc về một phòng cụ thể (Lọc từ mockData.tenants)
    const getTenantsInRoom = (roomId: string) => {
        return mockData.tenants.filter(t => t.roomId === roomId && t.status === 'active');
    };

    const openAddModal = () => {
        setEditingRoom(null);
        setRoomForm({ number: '', capacity: 1, status: 'available', notes: '', heroImage: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (room: Room) => {
        setEditingRoom(room);
        setRoomForm({
            number: room.number,
            capacity: room.capacity,
            status: room.status,
            notes: room.notes,
            heroImage: room.images[0] || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRoom) {
            setRooms(rooms.map(r => r.id === editingRoom.id ? { ...editingRoom, ...roomForm, images: [roomForm.heroImage, ...editingRoom.images.slice(1)] } : r));
        } else {
            setRooms([{ id: `${Date.now()}`, ...roomForm, images: [roomForm.heroImage, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400"] }, ...rooms]);
        }
        setIsModalOpen(false);
    };

    const handleEditSingleImage = (index: number) => {
        if (!selectedRoomDetail) return;
        const newUrl = prompt("Enter new Image URL:", selectedRoomDetail.images[index]);
        if (newUrl) {
            const updatedImages = [...selectedRoomDetail.images];
            updatedImages[index] = newUrl;
            const updatedRoom = { ...selectedRoomDetail, images: updatedImages };
            setRooms(rooms.map(r => r.id === selectedRoomDetail.id ? updatedRoom : r));
            setSelectedRoomDetail(updatedRoom);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-view">
                <Header pageTitle="Room Management" />
                <div className="dashboard-content">
                    <div className="section-header">
                        <div>
                            <h2>Rooms List</h2>
                            <p>Manage and monitor all boarding house units</p>
                        </div>
                        <button className="btn-add" onClick={openAddModal}>Add New Room</button>
                    </div>

                    <div className="table-container">
                        <table className="rooms-table">
                            <thead>
                                <tr>
                                    <th>Preview</th>
                                    <th>Room Number</th>
                                    <th>Status</th>
                                    <th>Capacity</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.id}>
                                        <td>
                                            <div className="room-preview-container" onClick={() => setSelectedRoomDetail(room)}>
                                                <img src={room.images[0]} alt="Hero" className="room-hero-thumb" />
                                                <span className="view-more-overlay">+{room.images.length - 1}</span>
                                            </div>
                                        </td>
                                        <td className="room-number-cell">{room.number}</td>
                                        <td>
                                            <span className={`status-badge ${room.status}`}>{room.status}</span>
                                        </td>
                                        <td>{room.capacity} Person(s)</td>
                                        <td>
                                            <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                                <button className="btn-icon view" onClick={() => setSelectedRoomDetail(room)}><i className="bi bi-eye"></i></button>
                                                <button className="btn-icon edit" onClick={() => openEditModal(room)}><i className="bi bi-pencil-square"></i></button>
                                                <button className="btn-icon delete" onClick={() => alert('Delete logic')}><i className="bi bi-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- MODAL VIEW DETAIL --- */}
            {selectedRoomDetail && (
                <div className="modal-overlay" onClick={() => setSelectedRoomDetail(null)}>
                    <div className="modal-content room-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Room {selectedRoomDetail.number} - Detailed</h3>
                            <button className="close-modal" onClick={() => setSelectedRoomDetail(null)}>×</button>
                        </div>

                        <div className="modal-body">
                            {/* Gallery Section */}
                            <div className="image-management-section">
                                <label className="section-label">Gallery (Click photo to edit URL)</label>
                                <div className="gallery-admin-grid">
                                    <div className="hero-edit-wrapper" onClick={() => handleEditSingleImage(0)}>
                                        <img src={selectedRoomDetail.images[0]} alt="Hero" className="hero-manage-img" />
                                        <div className="img-overlay">Change Hero</div>
                                        <div className="badge-hero">HERO</div>
                                    </div>
                                    <div className="sub-images-edit-grid">
                                        {[1, 2].map((idx) => (
                                            <div key={idx} className="sub-edit-wrapper" onClick={() => handleEditSingleImage(idx)}>
                                                <img src={selectedRoomDetail.images[idx]} alt="sub" />
                                                <div className="img-overlay">Edit</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Info & Occupant Section */}
                            <div className="detail-container-grid">
                                {/* Room Info */}
                                <div className="info-detail-grid">
                                    <div className="detail-item">
                                        <label>Status</label>
                                        <span className={`status-badge ${selectedRoomDetail.status}`}>{selectedRoomDetail.status}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Capacity</label>
                                        <p>{selectedRoomDetail.capacity} Persons</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Notes</label>
                                        <p>{selectedRoomDetail.notes || "No notes available"}</p>
                                    </div>
                                </div>

                                {/* THÔNG TIN NGƯỜI Ở (TENANT INFO) */}
                                <div className="occupant-info-card">
                                    <label className="section-label-sm">Current Occupants</label>
                                    {selectedRoomDetail.status === 'occupied' ? (
                                        <div className="tenant-list-wrapper">
                                            {getTenantsInRoom(selectedRoomDetail.id).map(tenant => (
                                                <div key={tenant.id} className="tenant-data-item">
                                                    <div className="tenant-avatar-mini">
                                                        {tenant.name.charAt(0)}
                                                    </div>
                                                    <div className="tenant-details">
                                                        <p className="t-name">{tenant.name}</p>
                                                        <p className="t-phone"><i className="bi bi-telephone"></i> {tenant.phone}</p>
                                                        <p className="t-date"><i className="bi bi-calendar-check"></i> In: {tenant.moveInDate}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {getTenantsInRoom(selectedRoomDetail.id).length === 0 && (
                                                <p className="no-data-text">Occupied but no tenant record found.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="no-tenant">
                                            <p>Room is currently vacant</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-save" onClick={() => setSelectedRoomDetail(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ADD/EDIT */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                                <button type="button" className="close-modal" onClick={() => setIsModalOpen(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Room Number</label>
                                    <input
                                        type="text"
                                        value={roomForm.number}
                                        onChange={e => setRoomForm({ ...roomForm, number: e.target.value })}
                                        required
                                        placeholder="e.g. R101"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <input
                                        type="number"
                                        value={roomForm.capacity}
                                        onChange={e => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={roomForm.status}
                                        onChange={e => setRoomForm({ ...roomForm, status: e.target.value })}
                                    >
                                        <option value="available">Available</option>
                                        <option value="occupied">Occupied</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Hero Image URL</label>
                                    <input
                                        type="text"
                                        value={roomForm.heroImage}
                                        onChange={e => setRoomForm({ ...roomForm, heroImage: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Notes</label>
                                    <textarea
                                        value={roomForm.notes}
                                        onChange={e => setRoomForm({ ...roomForm, notes: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Save Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;