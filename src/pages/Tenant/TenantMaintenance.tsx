import React, { useState } from 'react';
import './TenantMaintenance.css';

type StatusKey = 'pending' | 'in-progress' | 'resolved';

interface Request {
  id: string;
  title: string;
  description: string;
  date: string;
  status: StatusKey;
}

const MOCK_REQUESTS: Request[] = [
  { id: 'M1', title: 'Máy lạnh chạy nhưng không ra hơi lạnh',       description: 'Máy lạnh chạy nhưng không ra hơi lạnh, có tiếng kêu lạ.', date: '20/05/2025', status: 'in-progress' },
  { id: 'M2', title: 'Cửa sổ không đóng kín được',                   description: 'Cửa sổ không đóng kín được, có tiếng gió lọt vào ban đêm.', date: '15/05/2025', status: 'pending' },
  { id: 'M3', title: 'Vòi tắm nhỏ giọt liên tục',                    description: 'Vòi tắm nhỏ giọt liên tục, đã xử lý xong ngày 12/04/2025.', date: '10/04/2025', status: 'resolved' },
  { id: 'M4', title: 'Đèn LED nhấp nháy rồi tắt hẳn',               description: 'Đèn LED nhấp nháy rồi tắt hẳn.', date: '02/04/2025', status: 'resolved' },
  { id: 'M5', title: 'Ổ điện phía góc trái phòng không có điện',     description: 'Ổ điện phía góc trái phòng không có điện.', date: '18/03/2025', status: 'resolved' },
];

const STATUS_CONFIG: Record<StatusKey, { label: string; dotCls: string; badgeCls: string }> = {
  'in-progress': { label: 'Đang xử lý', dotCls: 'mt-dot--orange', badgeCls: 'mt-badge--orange' },
  pending:       { label: 'Chờ xử lý',  dotCls: 'mt-dot--orange', badgeCls: 'mt-badge--pending' },
  resolved:      { label: 'Đã xử lý',   dotCls: 'mt-dot--green',  badgeCls: 'mt-badge--resolved' },
};

export default function TenantMaintenance() {
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });

  const counts = {
    total:       requests.length,
    inProgress:  requests.filter(r => r.status === 'in-progress').length,
    resolved:    requests.filter(r => r.status === 'resolved').length,
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    const newReq: Request = {
      id: `M${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'pending',
    };
    setRequests(prev => [newReq, ...prev]);
    setForm({ title: '', description: '' });
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({ title: '', description: '' });
  };

  return (
    <div className="mt-page">
      {/* Header */}
      <div className="mt-header">
        <div>
          <p className="mt-sub">Theo dõi và gửi yêu cầu sửa chữa</p>
        </div>
        <button className="mt-add-btn" onClick={() => setShowModal(true)}>
          Gửi yêu cầu mới
        </button>
      </div>

      {/* Summary — 3 dark cards */}
      <div className="mt-summary-grid">
        <div className="mt-summary-card">
          <p className="mt-summary-label">Tổng yêu cầu</p>
          <p className="mt-summary-count">{counts.total}</p>
        </div>
        <div className="mt-summary-card mt-summary-card--orange">
          <p className="mt-summary-label">Đang xử lý</p>
          <p className="mt-summary-count mt-summary-count--orange">{counts.inProgress}</p>
        </div>
        <div className="mt-summary-card mt-summary-card--green">
          <p className="mt-summary-label">Đã xử lý</p>
          <p className="mt-summary-count mt-summary-count--green">{counts.resolved}</p>
        </div>
      </div>

      {/* List */}
      <div className="mt-list">
        {requests.map(req => {
          const cfg = STATUS_CONFIG[req.status];
          return (
            <div key={req.id} className="mt-item">
              <span className={`mt-dot ${cfg.dotCls}`} />
              <div className="mt-item-body">
                <div className="mt-item-top">
                  <p className="mt-item-title">{req.title}</p>
                  <span className={`mt-badge ${cfg.badgeCls}`}>{cfg.label}</span>
                </div>
                <p className="mt-item-desc">{req.description}</p>
                <p className="mt-item-date">Gửi ngày {req.date}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal — dark theme */}
      {showModal && (
        <div className="mt-overlay" onClick={handleClose}>
          <div className="mt-modal" onClick={e => e.stopPropagation()}>
            <h3 className="mt-modal-title">Gửi yêu cầu bảo trì mới</h3>

            <div className="mt-form-group">
              <label>Tiêu đề sự cố</label>
              <input
                type="text"
                placeholder="VD: Điều hòa bị hỏng..."
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="mt-form-group">
              <label>Mô tả chi tiết</label>
              <textarea
                rows={4}
                placeholder="Mô tả vấn đề bạn gặp phải..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="mt-modal-actions">
              <button className="mt-btn-cancel" onClick={handleClose}>Hủy</button>
              <button className="mt-btn-submit" onClick={handleSubmit}>Gửi yêu cầu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}