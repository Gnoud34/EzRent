/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import './Profile.css';
import mockData from '../../data/mockdata.json';
type FormState = {
  name: string;
  phone: string;
  email: string;
  cccd: string;
};

function fmtDate(d: string) { return new Date(d).toLocaleDateString('vi-VN'); }
function getDaysLeft(d: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = new Date(d); end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}
function getInitials(name: string) {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'NA';
}

export default function Profile() {
  /* ─── Lấy dữ liệu theo user đang đăng nhập ─── */
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUser = mockData.users.find(u => u.id === storedUser.id) || mockData.users[1];
  const currentTenant = (mockData.tenants as any[]).find(t => t.userId === currentUser.id)
    || mockData.tenants[0];
  const currentRoom = (mockData.rooms.find(r => r.id === currentTenant?.roomId)
    || mockData.rooms[0]) as any;

  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: currentTenant?.name || storedUser.name || '',
    phone: currentTenant?.phone || storedUser.phoneNumber || '',
    email: currentTenant?.email || storedUser.email || '',
    cccd: currentTenant?.idCard
      ? currentTenant.idCard.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
      : '',
  });

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify({ ...storedUser, ...form }));
    setEditMode(false);
    setSaved(true);
  };

  const handleCancel = () => {
    setForm({
      name: currentTenant?.name || storedUser.name || '',
      phone: currentTenant?.phone || storedUser.phoneNumber || '',
      email: currentTenant?.email || storedUser.email || '',
      cccd: currentTenant?.idCard
        ? currentTenant.idCard.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
        : '',
    });
    setEditMode(false);
  };

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const contractEnd = currentTenant?.expireDate || '';
  const moveInDate = currentTenant?.moveInDate || '';
  const days = contractEnd ? getDaysLeft(contractEnd) : 999;

  return (
    <div className="pf-page">
      <div className="pf-page-header">
        <p className="pf-sub">Xem và chỉnh sửa thông tin cá nhân</p>
      </div>

      {saved && (
        <div className="pf-toast">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Lưu thông tin thành công!
        </div>
      )}

      <div className="pf-grid">
        {/* ── Left ── */}
        <div className="pf-left">
          <div className="pf-avatar-row">
            <div className="pf-avatar">{getInitials(form.name)}</div>
            <div className="pf-avatar-meta">
              <p className="pf-avatar-name">{form.name}</p>
              <p className="pf-avatar-role">Người thuê · Phòng {currentRoom.number}</p>
              <span className="pf-status-badge">Đang thuê</span>
            </div>
          </div>

          <div className="pf-fields">
            {([
              { label: 'Họ và tên', key: 'name', type: 'text' },
              { label: 'Số điện thoại', key: 'phone', type: 'tel' },
              { label: 'Email', key: 'email', type: 'email' },
            ] as const).map(field => (
              <div key={field.key} className="pf-field-group">
                <label className="pf-label">{field.label}</label>
                {editMode ? (
                  <input
                    className="pf-input"
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                  />
                ) : (
                  <div className="pf-value">{form[field.key] || '—'}</div>
                )}
              </div>
            ))}
          </div>

          <div className="pf-actions">
            {editMode ? (
              <>
                <button className="pf-btn-save" onClick={handleSave}>Lưu</button>
                <button className="pf-btn-cancel" onClick={handleCancel}>Hủy</button>
              </>
            ) : (
              <>
                <button className="pf-btn-save" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
                <button className="pf-btn-cancel" onClick={handleCancel}>Đổi mật khẩu</button>
              </>
            )}
          </div>
        </div>

        {/* ── Right ── */}
        <div className="pf-right">
          {/* Room info panel */}
          <div className="pf-panel">
            <div className="pf-panel-header">
              <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <span>Thông tin thuê phòng</span>
            </div>
            <div className="pf-panel-row">
              <span className="pf-panel-label">Phòng đang thuê</span>
              <span className="pf-panel-value pf-panel-value--blue">
                {currentRoom.number} - Tầng {currentRoom.floor}
              </span>
            </div>
            <div className="pf-panel-row">
              <span className="pf-panel-label">Ngày chuyển vào</span>
              <span className="pf-panel-value">
                {moveInDate ? fmtDate(moveInDate) : '—'}
              </span>
            </div>
            <div className="pf-panel-row">
              <span className="pf-panel-label">Hết hạn hợp đồng</span>
              <span className={`pf-panel-value ${days <= 30 ? 'pf-panel-value--orange' : ''}`}>
                {contractEnd ? fmtDate(contractEnd) : '—'}
              </span>
            </div>
            <div className="pf-panel-row">
              <span className="pf-panel-value">
              </span>
            </div>
          </div>

          {/* Address panel */}
          <div className="pf-panel">
            <div className="pf-panel-header">
              <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Địa chỉ thường trú</span>
            </div>
            <div className="pf-panel-row">
              <span className="pf-panel-label">Tỉnh / Thành phố</span>
              <span className="pf-panel-value">{currentTenant?.province || '—'}</span>
            </div>
            <div className="pf-panel-row">
              <span className="pf-panel-label">Quận / Huyện</span>
              <span className="pf-panel-value">{currentTenant?.district || '—'}</span>
            </div>
            <div className="pf-panel-row">
              <span className="pf-panel-label">Địa chỉ chi tiết</span>
              <span className="pf-panel-value">{currentTenant?.address || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}