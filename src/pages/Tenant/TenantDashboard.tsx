import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TenantDashboard.css';

const userData = JSON.parse(localStorage.getItem('user') || '{}');

const TENANT = {
  name:           userData.name  || 'Nguyễn Văn An',
  email:          userData.email || 'an.nguyen@email.com',
  roomNumber:     '202',
  floor:          2,
  capacity:       2,
  area:           25,
  monthlyRent:    4_200_000,
  moveInDate:     '2024-01-15',
  contractExpiry: '2025-07-15',
};

const MAINTENANCE = [
  { id: 'M1', title: 'Điều hòa bị hỏng, không làm lạnh được', date: '20/05/2025', status: 'in-progress' },
  { id: 'M2', title: 'Vòi nước bị rỉ — phòng tắm',           date: '10/04/2025', status: 'resolved'   },
  { id: 'M3', title: 'Bóng đèn phòng tắm bị hỏng',           date: '02/04/2025', status: 'resolved'   },
];

function getDaysLeft(d: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end   = new Date(d); end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}
function fmtDate(d: string) { return new Date(d).toLocaleDateString('vi-VN'); }
function fmtMonths(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / (30 * 86_400_000)); }

const STATUS_DOT: Record<string, string> = {
  pending: 'dot-yellow', 'in-progress': 'dot-blue', resolved: 'dot-green',
};
const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  pending:       { cls: 'badge-yellow', label: 'Chờ xử lý'  },
  'in-progress': { cls: 'badge-blue',   label: 'Đang xử lý' },
  resolved:      { cls: 'badge-gray',   label: 'Đã xử lý'   },
};

export default function TenantDashboard() {
  const navigate = useNavigate();
  const days = getDaysLeft(TENANT.contractExpiry);

  const stats = [
    {
      label: 'Số phòng', value: `P.${TENANT.roomNumber}`, sub: `Tầng ${TENANT.floor}`,
      iconBg: '#EFF6FF', iconColor: '#2563EB',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    },
    {
      label: 'Trạng thái', value: 'Đang thuê', sub: 'Hợp đồng còn hiệu lực',
      iconBg: '#F0FDF4', iconColor: '#16A34A',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      label: 'Ngày chuyển vào', value: fmtDate(TENANT.moveInDate), sub: `${fmtMonths(TENANT.moveInDate)} tháng trước`,
      iconBg: '#FFFBEB', iconColor: '#D97706',
      icon: <><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2}/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2}/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2}/></>,
    },
    {
      label: 'Hết hạn HĐ', value: fmtDate(TENANT.contractExpiry),
      sub: days > 0 ? `Còn ${days} ngày` : 'Đã hết hạn',
      subColor: days <= 30 ? '#EA580C' : undefined,
      iconBg: '#F5F3FF', iconColor: '#7C3AED',
      icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8" strokeWidth={2}/></>,
    },
  ];

  return (
    <div className="td-page">
      <div className="td-page-header">
        <h1 className="td-title">Tổng quan</h1>
        <p className="td-sub">Thông tin thuê phòng của bạn</p>
      </div>

      {/* Alert */}
      {days <= 30 && (
        <div className={`td-alert ${days <= 7 ? 'td-alert--red' : 'td-alert--orange'}`}>
          <div className={`td-alert-icon ${days <= 7 ? 'td-alert-icon--red' : 'td-alert-icon--orange'}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="td-alert-body">
            <p className="td-alert-title">Hợp đồng sắp hết hạn</p>
            <p className="td-alert-desc">
              Hợp đồng còn <strong>{days} ngày</strong> (hết hạn {fmtDate(TENANT.contractExpiry)}). Vui lòng liên hệ quản lý để gia hạn.
            </p>
          </div>
          <button className={`td-alert-btn ${days <= 7 ? 'td-alert-btn--red' : 'td-alert-btn--orange'}`}>
            Liên hệ ngay
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="td-stat-grid">
        {stats.map(s => (
          <div key={s.label} className="td-stat-card">
            <div className="td-stat-left">
              <p className="td-stat-label">{s.label}</p>
              <p className="td-stat-value">{s.value}</p>
              <p className="td-stat-sub" style={s.subColor ? { color: s.subColor } : undefined}>{s.sub}</p>
            </div>
            <div className="td-stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {s.icon}
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="td-bottom-grid">
        {/* Room info */}
        <div className="td-panel">
          <div className="td-panel-header">
            <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span className="td-panel-title">Thông tin phòng</span>
          </div>
          {[
            { label: 'Số phòng',  value: `R${TENANT.roomNumber}`, blue: true },
            { label: 'Tầng',      value: `Tầng ${TENANT.floor}` },
            { label: 'Sức chứa',  value: `${TENANT.capacity} người` },
            { label: 'Diện tích', value: `${TENANT.area} m²` },
            { label: 'Tiền thuê', value: `${TENANT.monthlyRent.toLocaleString('vi-VN')} đ/tháng` },
            { label: 'Trạng thái', badge: true },
          ].map(row => (
            <div key={row.label} className="td-info-row">
              <span className="td-info-label">{row.label}</span>
              {row.badge
                ? <span className="td-badge td-badge--green">Đang thuê</span>
                : <span className={`td-info-value ${row.blue ? 'td-info-value--blue' : ''}`}>{row.value}</span>
              }
            </div>
          ))}
          <button className="td-btn-primary" onClick={() => navigate('/tenant/my-room')}>
            Xem chi tiết phòng
          </button>
        </div>

        {/* Right column */}
        <div className="td-right-col">
          {/* Maintenance */}
          <div className="td-panel">
            <div className="td-panel-header">
              <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
              <span className="td-panel-title">Yêu cầu bảo trì gần đây</span>
            </div>
            {MAINTENANCE.map(req => {
              const st = STATUS_BADGE[req.status];
              return (
                <div key={req.id} className="td-mt-item">
                  <span className={`td-mt-dot ${STATUS_DOT[req.status]}`} />
                  <div className="td-mt-body">
                    <p className="td-mt-title">{req.title}</p>
                    <p className="td-mt-date">{req.date}</p>
                  </div>
                  <span className={`td-badge ${st.cls}`}>{st.label}</span>
                </div>
              );
            })}
            <button className="td-btn-outline" onClick={() => navigate('/tenant/maintenance')}>
              + Gửi yêu cầu mới
            </button>
          </div>

          {/* Quick links */}
          <div className="td-panel">
            <div className="td-panel-header">
              <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="td-panel-title">Truy cập nhanh</span>
            </div>
            <div className="td-quick-grid">
              {[
                { label: 'Phòng của tôi', to: '/tenant/my-room',     d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
                { label: 'Hồ sơ cá nhân', to: '/tenant/profile',     d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
                { label: 'Hợp đồng',      to: '/tenant/my-room',     d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6' },
                { label: 'Bảo trì',       to: '/tenant/maintenance',  d: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
              ].map(q => (
                <button key={q.label} className="td-quick-btn" onClick={() => navigate(q.to)}>
                  <svg width="16" height="16" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={q.d} />
                  </svg>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}