/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import mockData from '../../../data/mockdata.json';
import Header from '../../../components/Header/Header';
import './Rooms.css';

interface Room {
    id: string;
    number: string;
    capacity: number;
    status: string;
    notes: string;
    images: string[];
    area?: number;
    price?: number;
    floor?: number;
}

const Rooms: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>(mockData.rooms.map(r => ({
        ...r,
        notes: (r as any).notes || "",
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
        images: ['', '', '']
    });

    const getTenantsInRoom = (roomId: string) => {
        return mockData.tenants.filter(t => t.roomId === roomId && t.status === 'active');
    };

    const openAddModal = () => {
        setEditingRoom(null);
        setRoomForm({ number: '', capacity: 1, status: 'available', notes: '', images: ['', '', ''] });
        setIsModalOpen(true);
    };

    const openEditModal = (room: Room) => {
        setEditingRoom(room);
        setRoomForm({
            number: room.number,
            capacity: room.capacity,
            status: room.status,
            notes: room.notes,
            images: [...room.images]
        });
        setIsModalOpen(true);
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const newImages = [...roomForm.images];
            newImages[index] = imageUrl;
            setRoomForm({ ...roomForm, images: newImages });
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...roomForm.images];
        newImages[index] = '';
        setRoomForm({ ...roomForm, images: newImages });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRoom) {
            setRooms(rooms.map(r => r.id === editingRoom.id ? { ...editingRoom, ...roomForm } : r));
        } else {
            setRooms([{ id: `${Date.now()}`, ...roomForm }, ...rooms]);
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

            {selectedRoomDetail && (
                <div className="modal-overlay" onClick={() => setSelectedRoomDetail(null)}>
                    <div className="modal-content room-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Room {selectedRoomDetail.number} - Detailed</h3>
                            <button className="close-modal" onClick={() => setSelectedRoomDetail(null)}>×</button>
                        </div>

                        <div className="modal-body">
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

                            <div className="detail-container-grid">
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

                                <div className="occupant-info-card">
                                    <label className="section-label-sm">Current Occupants</label>
                                    {selectedRoomDetail.status === 'occupied' ? (
                                        <div className="tenant-list-wrapper">
                                            {getTenantsInRoom(selectedRoomDetail.id).map(tenant => (
                                                <div key={tenant.id} className="tenant-data-item">
                                                    <div className="tenant-avatar-mini">{tenant.name.charAt(0)}</div>
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

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content room-form-modal" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                                <button type="button" className="close-modal" onClick={() => setIsModalOpen(false)}>×</button>
                            </div>
                            <div className="modal-body">

                                <div className="image-upload-section">
                                    <label className="section-label">Room Photos (Hero & Gallery)</label>
                                    <div className="image-preview-grid">
                                        {roomForm.images.map((img, idx) => (
                                            <div key={idx} className={`upload-box ${idx === 0 ? 'hero-box' : 'sub-box'}`}>
                                                {img ? (
                                                    <div className="img-wrap">
                                                        <img src={img} alt="preview" />
                                                        <button type="button" className="btn-remove" onClick={() => removeImage(idx)}>×</button>
                                                    </div>
                                                ) : (
                                                    <label className="upload-placeholder">
                                                        <i className="bi bi-plus-lg"></i>
                                                        <span>{idx === 0 ? 'Hero' : 'Photo'}</span>
                                                        <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(idx, e)} />
                                                    </label>
                                                )}
                                                {img && (
                                                    <label className="change-link">
                                                        Change
                                                        <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(idx, e)} />
                                                    </label>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-row">
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
                                    <label>Notes</label>
                                    <textarea
                                        value={roomForm.notes}
                                        onChange={e => setRoomForm({ ...roomForm, notes: e.target.value })}
                                        rows={3}
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