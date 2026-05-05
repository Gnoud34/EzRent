/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import mockData from '../../../data/mockdata.json';
import Header from '../../../components/Header/Header';
import './Rooms.css';

interface Room {
    id: string;
    number: string;
    capacity: number;
    status: 'available' | 'occupied' | 'maintenance';
    notes: string;
    images: string[];
    area?: number;
    price?: number;
    floor?: number;
}

const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400"
];

const Rooms: React.FC = () => {
    // Initialize state with proper mapping to avoid 'any'
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [selectedRoomDetail, setSelectedRoomDetail] = useState<Room | null>(null);

    const [roomForm, setRoomForm] = useState({
        number: '',
        capacity: 1,
        status: 'available' as Room['status'],
        notes: '',
        images: ['', '', '']
    });

    // Simulate Data Loading
    useEffect(() => {
        const initialRooms: Room[] = mockData.rooms.map((r: any) => ({
            ...r,
            notes: r.notes || "",
            images: r.images && r.images.length > 0 ? r.images : DEFAULT_IMAGES,
            status: (r.status as Room['status']) || 'available'
        }));
        setRooms(initialRooms);
    }, []);

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
            // Clean up previous blob if it exists to save memory
            if (roomForm.images[index].startsWith('blob:')) {
                URL.revokeObjectURL(roomForm.images[index]);
            }
            const imageUrl = URL.createObjectURL(file);
            const newImages = [...roomForm.images];
            newImages[index] = imageUrl;
            setRoomForm({ ...roomForm, images: newImages });
        }
    };

    const removeRoom = (id: string) => {
        if (window.confirm("Are you sure you want to delete this room?")) {
            setRooms(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRoom) {
            setRooms(rooms.map(r => r.id === editingRoom.id ? { ...editingRoom, ...roomForm } : r));
        } else {
            const newRoom: Room = { 
                id: `room-${Date.now()}`, 
                ...roomForm 
            };
            setRooms([newRoom, ...rooms]);
        }
        setIsModalOpen(false);
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
                        <button className="btn-add" onClick={openAddModal}>
                            <i className="bi bi-plus-lg"></i> Add New Room
                        </button>
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
                                                <img src={room.images[0] || DEFAULT_IMAGES[0]} alt="Room" className="room-hero-thumb" />
                                                {room.images.length > 1 && (
                                                    <span className="view-more-overlay">+{room.images.length - 1}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="room-number-cell"><strong>{room.number}</strong></td>
                                        <td>
                                            <span className={`status-badge ${room.status}`}>{room.status}</span>
                                        </td>
                                        <td>{room.capacity} Person(s)</td>
                                        <td>
                                            <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                                <button className="btn-icon view" title="View Details" onClick={() => setSelectedRoomDetail(room)}>
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button className="btn-icon edit" title="Edit Room" onClick={() => openEditModal(room)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn-icon delete" title="Delete Room" onClick={() => removeRoom(room.id)}>
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

            {/* Modal components remain largely the same, ensure they check for roomForm.images[idx] existing */}
        </div>
    );
};

export default Rooms;