/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './TenantMaintenance.css';
import mockData from '../../data/mockdata.json';

type StatusKey = 'pending' | 'in-progress' | 'resolved';
// Danh sách các categories cố định
const CATEGORIES = ['All Categories', 'Maintenance', 'Room Issue', 'Early Checkout', 'Other'];

interface Request {
  id: string;
  title: string;
  description: string;
  category: string; // Thêm trường này
  date: string;
  status: StatusKey;
}

/* ─── Fetch data ─── */
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = mockData.users.find(u => u.id === storedUser.id) || mockData.users[1];
const currentTenant = (mockData.tenants as any[]).find(t => t.userId === currentUser.id) || mockData.tenants[0];

const initialRequests: Request[] = (mockData.maintenanceRequests as any[])
  .filter(m => m.createdBy === currentTenant?.id)
  .map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    category: m.category || 'Maintenance', // Mặc định là Maintenance nếu data cũ chưa có
    date: m.createdAt,
    status: m.status as StatusKey,
  }));

const STATUS_CONFIG: Record<StatusKey, { label: string; dotCls: string; badgeCls: string }> = {
  'in-progress': { label: 'In Progress', dotCls: 'mt-dot--orange', badgeCls: 'mt-badge--orange' },
  pending: { label: 'Pending', dotCls: 'mt-dot--orange', badgeCls: 'mt-badge--pending' },
  resolved: { label: 'Resolved', dotCls: 'mt-dot--green', badgeCls: 'mt-badge--resolved' },
};

export default function TenantMaintenance() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Categories'); // State lưu bộ lọc hiện tại
  const [form, setForm] = useState({ title: '', description: '', category: 'Maintenance' });

  // Tính toán số lượng dựa trên toàn bộ requests
  const counts = {
    total: requests.length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    resolved: requests.filter(r => r.status === 'resolved').length,
  };

  // Logic lọc danh sách
  const filteredRequests = activeCategory === 'All Categories' 
    ? requests 
    : requests.filter(r => r.category === activeCategory);

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    const newReq: Request = {
      id: `M${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      date: new Date().toLocaleDateString('en-US'),
      status: 'pending',
    };
    setRequests(prev => [newReq, ...prev]);
    setForm({ title: '', description: '', category: 'Maintenance' });
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({ title: '', description: '', category: 'Maintenance' });
  };

  return (
    <div className="mt-page">
      <div className="mt-header">
        <div>
          <h1>Maintenance Requests</h1>
          <p className="mt-sub">Track and submit repair requests</p>
        </div>
        <button className="mt-add-btn" onClick={() => setShowModal(true)}>
          New Request
        </button>
      </div>

      <div className="mt-summary-grid">
        <div className="mt-summary-card">
          <p className="mt-summary-label">Total Requests</p>
          <p className="mt-summary-count">{counts.total}</p>
        </div>
        <div className="mt-summary-card">
          <p className="mt-summary-label">In Progress</p>
          <p className="mt-summary-count mt-summary-count--orange">{counts.inProgress}</p>
        </div>
        <div className="mt-summary-card">
          <p className="mt-summary-label">Resolved</p>
          <p className="mt-summary-count mt-summary-count--green">{counts.resolved}</p>
        </div>
      </div>

      {/* ─── BỘ LỌC CATEGORY (Ảnh bạn yêu cầu) ─── */}
      <div className="mt-filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`mt-filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredRequests.length === 0 ? (
        <div className="mt-empty">
          <p>No requests found in "{activeCategory}"</p>
          <span>Try changing the filter or click "New Request"</span>
        </div>
      ) : (
        <div className="mt-list">
          {filteredRequests.map(req => {
            const cfg = STATUS_CONFIG[req.status];
            return (
              <div key={req.id} className="mt-item">
                <span className={`mt-dot ${cfg.dotCls}`} />
                <div className="mt-item-body">
                  <div className="mt-item-top">
                    <div>
                      <p className="mt-item-title">{req.title}</p>
                      <small className="mt-item-cat-label">{req.category}</small>
                    </div>
                    <span className={`mt-badge ${cfg.badgeCls}`}>{cfg.label}</span>
                  </div>
                  <p className="mt-item-desc">{req.description}</p>
                  <p className="mt-item-date">Submitted on {req.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="mt-overlay" onClick={handleClose}>
          <div className="mt-modal" onClick={e => e.stopPropagation()}>
            <h3 className="mt-modal-title">Submit New Request</h3>

            <div className="mt-form-group">
              <label>Category</label>
              <select 
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="mt-form-select"
              >
                {CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="mt-form-group">
              <label>Issue Title</label>
              <input
                type="text"
                placeholder="e.g., Broken air conditioner..."
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="mt-form-group">
              <label>Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Describe the problem..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="mt-modal-actions">
              <button className="mt-btn-cancel" onClick={handleClose}>Cancel</button>
              <button className="mt-btn-submit" onClick={handleSubmit}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}