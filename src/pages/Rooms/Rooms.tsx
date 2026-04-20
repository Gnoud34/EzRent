import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import mockData from '../../data/mockdata.json';
import Header from '../../components/Header/Header'; // Import Header mới

import './Rooms.css';

interface Room {
    id: string;
    number: string;
    capacity: number;
    status: string;
    notes: string;
}

const Rooms: React.FC = () => {
    // 1. QUẢN LÝ STATE
    const [rooms, setRooms] = useState<Room[]>(mockData.rooms);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [roomForm, setRoomForm] = useState({
        number: '',
        capacity: 1,
        status: 'available',
        notes: ''
    });

    // const admin = mockData.users.find(u => u.role === 'admin');

    // 2. XỬ LÝ ĐÓNG/MỞ MODAL
    const openAddModal = () => {
        setEditingRoom(null);
        setRoomForm({ number: '', capacity: 1, status: 'available', notes: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (room: Room) => {
        setEditingRoom(room);
        setRoomForm({
            number: room.number,
            capacity: room.capacity,
            status: room.status,
            notes: room.notes
        });
        setIsModalOpen(true);
    };

    // 3. XỬ LÝ CRUD
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setRooms(rooms.filter(r => r.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra trùng lặp số phòng (Không phân biệt hoa thường)
        const isDuplicate = rooms.some(r => {
            const isSameNumber = r.number.toLowerCase() === roomForm.number.toLowerCase();
            return editingRoom ? (isSameNumber && r.id !== editingRoom.id) : isSameNumber;
        });

        if (isDuplicate) {
            alert(`Error: Room number "${roomForm.number}" already exists!`);
            return;
        }

        if (editingRoom) {
            // Cập nhật phòng hiện có
            setRooms(rooms.map(r =>
                r.id === editingRoom.id ? { ...editingRoom, ...roomForm } : r
            ));
        } else {
            // Thêm phòng mới
            const createdRoom: Room = {
                id: `R${Date.now()}`,
                ...roomForm
            };
            setRooms([createdRoom, ...rooms]);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-view">
                {/* Header Section */}
                <Header pageTitle="Room Management" />


                {/* Content Section */}
                <div className="dashboard-content">
                    <div className="section-header">
                        <div>
                            <h2>Rooms List</h2>
                            <p>Manage and monitor all boarding house units</p>
                        </div>
                        <button className="btn-add" onClick={openAddModal}>
                            Add New Room
                        </button>
                    </div>

                    {/* Table Container */}
                    <div className="table-container">
                        <table className="rooms-table">
                            <thead>
                                <tr>
                                    <th>Room Number</th>
                                    <th>Status</th>
                                    <th>Capacity</th>
                                    <th>Notes</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.id}>
                                        <td style={{ fontWeight: 700, color: '#1e293b' }}>{room.number}</td>
                                        <td>
                                            <span className={`status-badge ${room.status}`}>
                                                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{room.capacity} Person(s)</td>
                                        <td style={{ color: '#64748b', maxWidth: '300px' }}>{room.notes}</td>
                                        <td>
                                            <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                                <button className="btn-icon edit" onClick={() => openEditModal(room)} title="Edit Room">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn-icon delete" onClick={() => handleDelete(room.id)} title="Delete Room">
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

            {/* --- POPUP MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-header">
                            <h3>{editingRoom ? 'Edit Room Details' : 'Add New Room'}</h3>
                            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Room Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 101"
                                        required
                                        value={roomForm.number}
                                        onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Capacity (People)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number" min="1" required
                                            value={roomForm.capacity}
                                            onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={roomForm.status}
                                        onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                                    >
                                        <option value="available">Available</option>
                                        <option value="occupied">Occupied</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Notes</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Enter room description or facilities..."
                                        value={roomForm.notes}
                                        onChange={(e) => setRoomForm({ ...roomForm, notes: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    {editingRoom ? 'Update Room' : 'Create Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;