import React from 'react';
import './MyRoom.css';

const ROOM = {
  number: '202', floor: 2, capacity: 2, area: 25,
  monthlyRent: 4_200_000,
  moveInDate:  '2024-01-15',
  contractEnd: '2025-07-15',
  description: 'Phòng góc thoáng mát, view đẹp, ban công rộng. Gần chợ và siêu thị. Khu vực an ninh 24/7, có camera giám sát toàn khu.',
  amenities: ['WiFi tốc độ cao', 'Điều hòa', 'WC riêng', 'Ban công', 'Tủ lạnh'],
  roommates: [
    { name: 'TH', phone: '+84 901 222 333' },
  ],
};

function fmtDate(d: string) { return new Date(d).toLocaleDateString('vi-VN'); }
function getDaysLeft(d: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  const end   = new Date(d); end.setHours(0,0,0,0);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}

export default function MyRoom() {
  const days = getDaysLeft(ROOM.contractEnd);

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
              <span className="mr-info-value mr-info-value--blue">R{ROOM.number}</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Tầng</span>
              <span className="mr-info-value">Tầng {ROOM.floor}</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Diện tích</span>
              <span className="mr-info-value">{ROOM.area} m²</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Sức chứa</span>
              <span className="mr-info-value">{ROOM.capacity} người</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Tiền thuê</span>
              <span className="mr-info-value">{ROOM.monthlyRent.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="mr-info-row">
              <span className="mr-info-label">Tiền cọc</span>
              <span className="mr-info-value">{(ROOM.monthlyRent * 2).toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="mr-amenities-panel">
            <p className="mr-section-label">Tiện nghi</p>
            <div className="mr-amenities">
              {ROOM.amenities.map(a => (
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
              <span className="mr-contract-value">{fmtDate(ROOM.moveInDate)}</span>
            </div>
            <div className="mr-contract-row">
              <span className="mr-contract-label">Ngày hết hạn HĐ</span>
              <span className={`mr-contract-value ${days <= 30 ? 'mr-contract-value--orange' : ''}`}>
                {fmtDate(ROOM.contractEnd)}
              </span>
            </div>
            <div className="mr-contract-row">
              <span className="mr-contract-label">Trạng thái HĐ</span>
              <span className="mr-contract-badge">Còn hiệu lực</span>
            </div>
          </div>

          {/* Roommates */}
          {ROOM.roommates.length > 0 && (
            <div className="mr-roommates-panel">
              <div className="mr-roommates-icon">
                <svg width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {ROOM.roommates.map((r, i) => (
                <div key={i} className="mr-roommate">
                  <div className="mr-roommate-avatar">{r.name}</div>
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
            <p className="mr-desc-text">{ROOM.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}