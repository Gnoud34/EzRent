/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './MyRoom.css';
import mockData from '../../data/mockdata.json';

/* ─── Lấy dữ liệu theo user đang đăng nhập ─── */
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = mockData.users.find(u => u.id === storedUser.id) || mockData.users[1];
const currentTenant = (mockData.tenants as any[]).find(t => t.userId === currentUser.id)
  || mockData.tenants[0];
const currentRoom = mockData.rooms.find(r => r.id === currentTenant?.roomId)
  || mockData.rooms[0];

/* ─── ẢNH CỐ ĐỊNH ─── */
const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
];

/* ─── Helpers ─── */
function fmtDate(d: string) { 
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN'); 
}

function getDaysLeft(d: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = new Date(d); end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}

export default function MyRoom() {
  const [currentImg, setCurrentImg] = useState(0);

  const contractEnd = currentTenant?.expireDate || '';
  const moveInDate = currentTenant?.moveInDate || '';
  const days = contractEnd ? getDaysLeft(contractEnd) : 999;
  const roommates: { name: string; phone: string }[] = currentTenant?.roommates || [];

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg(i => (i - 1 + ROOM_IMAGES.length) % ROOM_IMAGES.length);
  };
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg(i => (i + 1) % ROOM_IMAGES.length);
  };

  return (
    <div className="mr-page">
      <div className="mr-page-header">
        <p className="mr-sub">Thông tin đầy đủ về phòng bạn đang thuê</p>
      </div>

      <div className="mr-grid">
        {/* ── Left col ── */}
        <div className="mr-left">
          
          {/* ═══ THAY ĐỔI TỪ ĐÂY ═══ */}
          {/* ── Image gallery ── */}
          <div className="mr-gallery">
            {/* Main image */}
            <div className="mr-gallery-main">
              <img
                src={ROOM_IMAGES[currentImg]}
                alt={`Phòng ${currentRoom?.number}`}
              />

              {/* Prev / Next buttons */}
              <button className="mr-gallery-btn mr-gallery-btn--prev" onClick={prevImg}>
                ‹
              </button>
              <button className="mr-gallery-btn mr-gallery-btn--next" onClick={nextImg}>
                ›
              </button>
              
              {/* Dots indicator */}
              <div className="mr-gallery-dots">
                {ROOM_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`mr-gallery-dot ${i === currentImg ? 'mr-gallery-dot--active' : ''}`}
                    onClick={e => { e.stopPropagation(); setCurrentImg(i); }}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mr-gallery-thumbs">
              {ROOM_IMAGES.map((src, i) => (
                <button
                  key={i}
                  className={`mr-gallery-thumb ${i === currentImg ? 'mr-gallery-thumb--active' : ''}`}
                  onClick={() => setCurrentImg(i)}
                >
                  <img src={src} alt={`Ảnh ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
          {/* ═══ HẾT THAY ĐỔI ═══ */}

          <div className="mr-info-panel">
            <div className="mr-info-row">
              <span className="mr-info-label">Số phòng</span>
              <span className="mr-info-value mr-info-value--blue">{currentRoom?.number}</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Tầng</span>
              <span className="mr-info-value">Tầng {currentRoom?.floor}</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Diện tích</span>
              <span className="mr-info-value">{currentRoom?.area} m²</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Sức chứa</span>
              <span className="mr-info-value">{currentRoom?.capacity} người</span>
            </div>
          </div>

          <div className="mr-amenities-panel">
            <p className="mr-section-label">Tiện nghi</p>
            <div className="mr-amenities">
              {(currentRoom?.amenities || []).map((a: string) => (
                <span key={a} className="mr-amenity-tag">{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right col ── */}
        <div className="mr-right">
          <div className="mr-contract-panel">
            <p className="mr-section-label">Thông tin hợp đồng</p>
            <div className="mr-contract-row">
              <span className="mr-contract-label">Ngày chuyển vào</span>
              <span className="mr-contract-value">{fmtDate(moveInDate)}</span>
            </div>
            <div className="mr-contract-row">
              <span className="mr-contract-label">Ngày hết hạn HĐ</span>
              <span className={`mr-contract-value ${days <= 30 ? 'mr-contract-value--orange' : ''}`}>
                {fmtDate(contractEnd)}
              </span>
            </div>
            <div className="mr-contract-row">
              <span className="mr-contract-label">Trạng thái HĐ</span>
              <span className="mr-contract-badge">
                {days > 0 ? 'Còn hiệu lực' : 'Đã hết hạn'}
              </span>
            </div>
          </div>

          {roommates.length > 0 && (
            <div className="mr-roommates-panel">
              <p className="mr-section-label" style={{marginBottom: '12px'}}>Bạn cùng phòng</p>
              {roommates.map((r, i) => (
                <div key={i} className="mr-roommate">
                  <div className="mr-roommate-avatar">
                    {r.name ? r.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '??'}
                  </div>
                  <div className="mr-roommate-info">
                    <p className="mr-roommate-name">{r.name}</p>
                    <div className="mr-roommate-phone">
                      <svg width="14" height="14" fill="none" stroke="#6B7280" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{r.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mr-desc-panel">
            <div className="mr-desc-icon">
              <svg width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>Mô tả phòng</span>
            </div>
            <p className="mr-desc-text">{currentRoom?.description || 'Không có mô tả'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}