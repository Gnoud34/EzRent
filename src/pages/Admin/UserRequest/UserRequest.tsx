import React, { useState, useEffect } from 'react';
import './UserRequest.css';
import mockData from '../../../../public/mockdata.json';

interface Request {
    id: string;
    roomNumber: string;
    title?: string;
    description: string;
    status: string;
    createdAt: string;
    tenantId?: string;
}

const UserRequest: React.FC = () => {
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [myRequests, setMyRequests] = useState<Request[]>([]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // ✅ dùng tenantId thay vì createdBy
        // Tìm tenant tương ứng với user đang đăng nhập
        const tenant = mockData.tenants.find(t => (t as any).userId === user.id);
        if (tenant) {
            const filtered = mockData.maintenanceRequests.filter(
                req => req.tenantId === tenant.id
            );
            setMyRequests(filtered as Request[]);
        }
    }, [user.id]);

    // Lấy roomNumber của user hiện tại
    const myTenant = mockData.tenants.find(t => (t as any).userId === user.id);
    const myRoomNumber = myTenant
        ? (mockData.rooms.find(r => r.id === myTenant.roomId)?.number || 'N/A')
        : 'N/A';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        const newRequest: Request = {
            id: `REQ${Math.floor(Math.random() * 10000)}`,
            roomNumber: myRoomNumber,
            title: title || 'Yêu cầu mới',
            description,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        setMyRequests([newRequest, ...myRequests]);
        setTitle('');
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
                            <input type="text" value={myRoomNumber} disabled className="disabled-input" />
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Air conditioner broken"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description of Issue</label>
                            <textarea
                                placeholder="Describe the problem in detail..."
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
                                        {req.title && <strong style={{ display: 'block', fontSize: 14 }}>{req.title}</strong>}
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