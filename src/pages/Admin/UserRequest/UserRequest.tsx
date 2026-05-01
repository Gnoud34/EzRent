import React, { useState, useEffect } from 'react';
import './UserRequest.css';
import mockData from '../../../data/mockdata.json';

interface Request {
    id: string;
    roomNumber: string;
    description: string;
    status: string;
    createdAt: string;
}

const UserRequest: React.FC = () => {
    const [description, setDescription] = useState('');
    const [myRequests, setMyRequests] = useState<Request[]>([]);
    
    // Lấy thông tin user hiện tại
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Lọc danh sách yêu cầu của riêng user này
        const filtered = mockData.maintenanceRequests.filter(req => req.createdBy === user.id);
        setMyRequests(filtered as any);
    }, [user.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        const newRequest = {
            id: `REQ${Math.floor(Math.random() * 1000)}`,
            roomNumber: "R203", // Giả định phòng của user này
            description,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        setMyRequests([newRequest, ...myRequests]);
        setDescription('');
        alert('Request sent successfully!');
    };

    return (
        <div className="user-request-container">
            <header className="user-header">
                <h2>Room Service & Maintenance</h2>
                <p>Need help with your room? Let us know.</p>
            </header>

            <div className="request-grid">
                {/* Form gửi yêu cầu */}
                <div className="request-form-card">
                    <h3>Submit New Request</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Room Number</label>
                            <input type="text" value="R203" disabled className="disabled-input" />
                        </div>
                        <div className="form-group">
                            <label>Description of Issue</label>
                            <textarea 
                                placeholder="Example: The light bulb is broken..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-submit-request">
                            <i className="bi bi-send"></i> Send Request
                        </button>
                    </form>
                </div>

                {/* Danh sách yêu cầu đã gửi */}
                <div className="request-history-card">
                    <h3>My Request History</h3>
                    <div className="history-list">
                        {myRequests.length === 0 ? (
                            <p className="no-data">No requests yet.</p>
                        ) : (
                            myRequests.map(req => (
                                <div key={req.id} className="history-item">
                                    <div className="history-info">
                                        <span className="req-id">#{req.id}</span>
                                        <p>{req.description}</p>
                                        <small>{new Date(req.createdAt).toLocaleDateString()}</small>
                                    </div>
                                    <span className={`status-pill ${req.status}`}>
                                        {req.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRequest;