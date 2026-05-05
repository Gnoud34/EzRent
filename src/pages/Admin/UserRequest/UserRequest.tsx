import React, { useState, useEffect } from 'react';
import './UserRequest.css';

interface Request {
    id: string;
    roomNumber: string;
    title: string;
    description: string;
    status: 'pending' | 'processing' | 'completed';
    createdAt: string;
    createdBy: string;
}

const UserRequest: React.FC = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRoom = user.roomId || user.roomNumber || "N/A";

    const [title, setTitle] = useState('Maintenance');
    const [description, setDescription] = useState('');
    const [myRequests, setMyRequests] = useState<Request[]>([]);

    useEffect(() => {
        const savedRequests = localStorage.getItem(`requests_${user.id}`);
        if (savedRequests) {
            setMyRequests(JSON.parse(savedRequests));
        }
    }, [user.id]);

    useEffect(() => {
        if (myRequests.length > 0) {
            localStorage.setItem(`requests_${user.id}`, JSON.stringify(myRequests));
        }
    }, [myRequests, user.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        const newRequest: Request = {
            id: `REQ${Math.floor(Math.random() * 10000)}`,
            roomNumber: userRoom,
            title: title,
            description: description,
            status: 'pending',
            createdAt: new Date().toLocaleDateString('en-US'),
            createdBy: user.id
        };
        setMyRequests([newRequest, ...myRequests]);
        setDescription('');
        setTitle('Maintenance');
        
        alert('Your request has been submitted successfully!');
    };

    return (
        <div className="user-request-container">
            <header className="user-header">
                <h2>Room Service & Maintenance</h2>
                <p>Submit a support request for your room or building services.</p>
            </header>

            <div className="request-grid">
                {/* Form Section */}
                <div className="request-form-card">
                    <div className="card-header">
                        <i className="bi bi-plus-circle"></i>
                        <h3>New Request</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Room Number</label>
                            <input 
                                type="text" 
                                value={userRoom} 
                                disabled 
                                className="disabled-input" 
                            />
                        </div>

                        <div className="form-group">
                            <label>Request Type</label>
                            <select
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="category-select"
                            >
                                <option value="Maintenance">Maintenance</option>
                                <option value="Cleaning Service">Cleaning Service</option>
                                <option value="Room Issue">Room Issue</option>
                                <option value="Checkout Request">Checkout Request</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Detailed Description</label>
                            <textarea
                                placeholder="E.g., The living room light is flickering and needs replacement..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-submit-request">
                            <i className="bi bi-send-fill"></i> Submit Request
                        </button>
                    </form>
                </div>

                <div className="request-history-card">
                    <div className="card-header">
                        <i className="bi bi-clock-history"></i>
                        <h3>Request History</h3>
                    </div>
                    <div className="history-list">
                        {myRequests.length === 0 ? (
                            <div className="empty-state">
                                <i className="bi bi-clipboard-x"></i>
                                <p>You haven't submitted any requests yet.</p>
                            </div>
                        ) : (
                            myRequests.map(req => (
                                <div key={req.id} className="history-item">
                                    <div className="history-content">
                                        <div className="req-top-bar">
                                            <span className="req-id">{req.id}</span>
                                            <span className={`status-pill ${req.status}`}>
                                                {req.status === 'pending' ? 'Pending' : 'Processed'}
                                            </span>
                                        </div>
                                        <h4 className="req-title">{req.title}</h4>
                                        <p className="req-desc">{req.description}</p>
                                        <div className="req-footer">
                                            <span><i className="bi bi-calendar3"></i> {req.createdAt}</span>
                                            <span><i className="bi bi-geo-alt"></i> {req.roomNumber}</span>
                                        </div>
                                    </div>
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