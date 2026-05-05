/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './TenantMaintenance.css';
import mockData from '../../data/mockdata.json';

type StatusKey = 'pending' | 'in-progress' | 'resolved';

interface Request {
  id: string;
  title: string;
  description: string;
  date: string;
  status: StatusKey;
}

/* ─── Fetch data based on logged-in user ─── */
const storedUser    = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser   = mockData.users.find(u => u.id === storedUser.id) || mockData.users[1];
const currentTenant = (mockData.tenants as any[]).find(t => t.userId === currentUser.id)
  || mockData.tenants[0];

const initialRequests: Request[] = (mockData.maintenanceRequests as any[])
  .filter(m => m.createdBy === currentTenant?.id)
  .map(m => ({
    id:          m.id,
    title:       m.title,
    description: m.description,
    date:        m.createdAt,
    status:      m.status as StatusKey,
  }));

const STATUS_CONFIG: Record<StatusKey, { label: string; dotCls: string; badgeCls: string }> = {
  'in-progress': { label: 'In Progress', dotCls: 'mt-dot--orange', badgeCls: 'mt-badge--orange'  },
  pending:       { label: 'Pending',     dotCls: 'mt-dot--orange', badgeCls: 'mt-badge--pending'  },
  resolved:      { label: 'Resolved',    dotCls: 'mt-dot--green',  badgeCls: 'mt-badge--resolved' },
};

export default function TenantMaintenance() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });

  const counts = {
    total:      requests.length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    resolved:   requests.filter(r => r.status === 'resolved').length,
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    const newReq: Request = {
      id:          `M${Date.now()}`,
      title:       form.title.trim(),
      description: form.description.trim(),
      date:        new Date().toLocaleDateString('en-US'), // Changed to US locale
      status:      'pending',
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
        <p className="mt-sub">Track and submit repair requests</p>
        <button className="mt-add-btn" onClick={() => setShowModal(true)}>
          New Request
        </button>
      </div>

      {/* Summary — 3 dark cards */}
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

      {/* List */}
      {requests.length === 0 ? (
        <div className="mt-empty">
          <p>No requests found</p>
          <span>Click "New Request" to get started</span>
        </div>
      ) : (
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
                  <p className="mt-item-date">Submitted on {req.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal — dark theme */}
      {showModal && (
        <div className="mt-overlay" onClick={handleClose}>
          <div className="mt-modal" onClick={e => e.stopPropagation()}>
            <h3 className="mt-modal-title">Submit New Maintenance Request</h3>

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
                placeholder="Describe the problem you are experiencing..."
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