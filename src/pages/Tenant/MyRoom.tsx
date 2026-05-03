import React from 'react';
import './MyRoom.css';
import mockData from '../../../public/mockdata.json';

/* ─── Lấy dữ liệu theo user đang đăng nhập ─── */
const storedUser  = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = mockData.users.find(u => u.id === storedUser.id) || mockData.users[1];
const currentTenant = (mockData.tenants as any[]).find(t => t.userId === currentUser.id)
  || mockData.tenants[0];
const currentRoom = mockData.rooms.find(r => r.id === currentTenant?.roomId)
  || mockData.rooms[0];

/* ─── Helpers ─── */
function fmtDate(d: string) { return new Date(d).toLocaleDateString('vi-VN'); }
function getDaysLeft(d: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  const end   = new Date(d); end.setHours(0,0,0,0);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}

export default function MyRoom() {
  const contractEnd = currentTenant?.expireDate || '';
  const moveInDate  = currentTenant?.moveInDate || '';
  const days = contractEnd ? getDaysLeft(contractEnd) : 999;
  const roommates: { name: string; phone: string }[] = currentTenant?.roommates || [];

  return (
    <div className="mr-page">
      <div className="mr-page-header">
        <p className="mr-sub">Thông tin đầy đủ về phòng bạn đang thuê</p>
      </div>

      <div className="mr-grid">
        {/* ── Left col ── */}
        <div className="mr-left">
          {/* Room image */}
          <div className="mr-img-box">
            <svg width="56" height="56" fill="none" stroke="#93C5FD" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span className="mr-status-badge">Đang thuê</span>
          </div>

          {/* Room info rows */}
          <div className="mr-info-panel">
            <div className="mr-info-row">
              <span className="mr-info-label">Số phòng</span>
              <span className="mr-info-value mr-info-value--blue">{currentRoom.number}</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Tầng</span>
              <span className="mr-info-value">Tầng {currentRoom.floor}</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Diện tích</span>
              <span className="mr-info-value">{currentRoom.area} m²</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Sức chứa</span>
              <span className="mr-info-value">{currentRoom.capacity} người</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Tiền thuê</span>
              <span className="mr-info-value">
                {(currentTenant?.monthlyRent ?? currentRoom.price).toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Tiền cọc</span>
              <span className="mr-info-value">
                {(currentTenant?.deposit ?? currentRoom.price * 2).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* Amenities */}
          <div className="mr-amenities-panel">
            <p className="mr-section-label">Tiện nghi</p>
            <div className="mr-amenities">
              {(currentRoom.amenities || []).map((a: string) => (
                <span key={a} className="mr-amenity-tag">{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right col ── */}
        <div className="mr-right">
          {/* Contract panel */}
          <div className="mr-contract-panel">
            <p className="mr-section-label">Thông tin hợp đồng</p>
            <div className="mr-contract-row">
              <span className="mr-contract-label">Ngày chuyển vào</span>
              <span className="mr-contract-value">
                {moveInDate ? fmtDate(moveInDate) : '—'}
              </span>
            </div>
            <div className="mr-contract-row">
              <span className="mr-contract-label">Ngày hết hạn HĐ</span>
              <span className={`mr-contract-value ${days <= 30 ? 'mr-contract-value--orange' : ''}`}>
                {contractEnd ? fmtDate(contractEnd) : '—'}
              </span>
            </div>
            <div className="mr-contract-row">
              <span className="mr-contract-label">Trạng thái HĐ</span>
              <span className="mr-contract-badge">
                {days > 0 ? 'Còn hiệu lực' : 'Đã hết hạn'}
              </span>
            </div>
          </div>

          {/* Roommates */}
          {roommates.length > 0 && (
            <div className="mr-roommates-panel">
              <div className="mr-roommates-icon">
                <svg width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {roommates.map((r, i) => (
                <div key={i} className="mr-roommate">
                  <div className="mr-roommate-avatar">
                    {r.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="mr-roommate-info">
                    <svg width="14" height="14" fill="none" stroke="#6B7280" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{r.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mr-desc-panel">
            <div className="mr-desc-icon">
              <svg width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>Mô tả phòng</span>
            </div>
            <p className="mr-desc-text">{currentRoom.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}