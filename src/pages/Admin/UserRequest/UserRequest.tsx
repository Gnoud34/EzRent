import React, { useState } from 'react';
import './UserRequest.css';
// import mockData from '../../data/mockdata.json';

interface Request {
    id: string;
    roomNumber: string;
    title: string;        // Khớp mock data
    description: string;
    status: string;
    createdAt: string;
    createdBy: string;    // Khớp mock data (id của user)
}

const UserRequest: React.FC = () => {
    // State cho các trường nhập liệu
    const [title, setTitle] = useState('Maintenance'); // Dùng Category làm Title mặc định
    const [description, setDescription] = useState('');
    const [myRequests, setMyRequests] = useState<Request[]>([]);

    // Lấy thông tin user hiện tại
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // useEffect(() => {
    //     // Lọc danh sách yêu cầu dựa trên createdBy khớp với user.id
    //     const filtered = mockData.maintenanceRequests.filter(req => req.createdBy === user.id);
    //     setMyRequests(filtered as Request[]);
    // }, [user.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        // Tạo object mới khớp 100% các trường trong mock data
        const newRequest: Request = {
            id: String(Date.now()), // Tạo ID duy nhất
            roomNumber: "R203",     // Giả định phòng của user này
            title: title,           // Lấy từ combo box
            description: description,
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0], // Định dạng YYYY-MM-DD
            createdBy: user.id      // Lưu ID người tạo
        };

        setMyRequests([newRequest, ...myRequests]);
        setDescription('');
        setTitle('Maintenance');
        alert('Yêu cầu đã được gửi thành công!');
    };

    return (
        <div className="user-request-container">
            <header className="user-header">
                <h2>Room Service & Maintenance</h2>
                <p>Gửi yêu cầu hỗ trợ về phòng hoặc dịch vụ.</p>
            </header>

            <div className="request-grid">
                {/* Form gửi yêu cầu */}
                <div className="request-form-card">
                    <h3>Gửi yêu cầu mới</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Số phòng</label>
                            <input type="text" value="R203" disabled className="disabled-input" />
                        </div>

                        <div className="form-group">
                            <label>Loại yêu cầu (Tiêu đề)</label>
                            <select
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="category-select"
                            >
                                <option value="Sửa chữa thiết bị">Sửa chữa thiết bị (Maintenance)</option>
                                <option value="Vấn đề về phòng">Vấn đề về phòng (Room Issue)</option>
                                <option value="Yêu cầu trả phòng">Yêu cầu trả phòng (Early Checkout)</option>
                                <option value="Yêu cầu khác">Khác (Other)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mô tả chi tiết</label>
                            <textarea
                                placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-submit-request">
                            <i className="bi bi-send"></i> Gửi yêu cầu
                        </button>
                    </form>
                </div>

                {/* Danh sách yêu cầu đã gửi */}
                <div className="request-history-card">
                    <h3>Lịch sử yêu cầu của tôi</h3>
                    <div className="history-list">
                        {myRequests.length === 0 ? (
                            <p className="no-data">Bạn chưa có yêu cầu nào.</p>
                        ) : (
                            myRequests.map(req => (
                                <div key={req.id} className="history-item">
                                    <div className="history-info">
                                        <div className="req-header">
                                            <span className="req-id">#{req.id}</span>
                                            <span className="req-category">{req.title}</span>
                                        </div>
                                        <p className="req-desc">{req.description}</p>
                                        <div className="req-meta">
                                            <small><i className="bi bi-clock"></i> {req.createdAt}</small>
                                            <small style={{ marginLeft: '10px' }}><i className="bi bi-door-closed"></i> {req.roomNumber}</small>
                                        </div>
                                    </div>
                                    <span className={`status-pill ${req.status}`}>
                                        {req.status === 'pending' ? 'Đang chờ' : 'Đã xử lý'}
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