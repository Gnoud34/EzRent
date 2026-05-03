import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TenantDashboard.css';
import mockData from '../../../public/mockdata.json';

/* ─── Lấy dữ liệu từ mockData ─── */
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = mockData.users.find(u => u.id === storedUser.id) || mockData.users[1];
const currentTenant = mockData.tenants.find(t => (t as any).userId === currentUser.id)
  || (mockData.tenants[0] as any);
const currentRoom = mockData.rooms.find(r => r.id === currentTenant?.roomId)
  || mockData.rooms[0];
const myMaintenance = mockData.maintenanceRequests
  .filter(m => m.tenantId === currentTenant?.id)
  .slice(0, 3);

/* ─── Helpers ─── */
function getDaysLeft(d: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end   = new Date(d); end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN');
}
function fmtMonths(d: string) {
  return Math.floor((Date.now() - new Date(d).getTime()) / (30 * 86_400_000));
}

const STATUS_DOT: Record<string, string> = {
  pending:       'dotYellow',
  'in-progress': 'dotBlue',
  resolved:      'dotGreen',
};
const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  pending:       { cls: 'badgeYellow', label: 'Chờ xử lý'  },
  'in-progress': { cls: 'badgeBlue',   label: 'Đang xử lý' },
  resolved:      { cls: 'badgeGray',   label: 'Đã xử lý'   },
};

export default function TenantDashboard() {
  const navigate = useNavigate();

  const expireDate = currentTenant?.expireDate || '';
  const moveInDate = currentTenant?.moveInDate || '';
  const days = expireDate ? getDaysLeft(expireDate) : 999;

  const stats = [
    {
      label: 'Số phòng',
      value: `P.${currentRoom.number.replace('R', '')}`,
      sub: `Tầng ${currentRoom.floor}`,
      iconBg: '#EFF6FF', iconColor: '#2563EB',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    },
    {
      label: 'Trạng thái',
      value: 'Đang thuê',
      sub: 'Hợp đồng còn hiệu lực',
      iconBg: '#F0FDF4', iconColor: '#16A34A',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      label: 'Ngày chuyển vào',
      value: moveInDate ? fmtDate(moveInDate) : '—',
      sub:   moveInDate ? `${fmtMonths(moveInDate)} tháng trước` : '',
      iconBg: '#FFFBEB', iconColor: '#D97706',
      icon: <>
        <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2}/>
        <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2}/>
        <line x1="8"  y1="2" x2="8"  y2="6" strokeWidth={2}/>
        <line x1="3"  y1="10" x2="21" y2="10" strokeWidth={2}/>
      </>,
    },
    {
      label: 'Hết hạn HĐ',
      value: expireDate ? fmtDate(expireDate) : '—',
      sub:   days > 0 ? `Còn ${days} ngày` : 'Đã hết hạn',
      subColor: days <= 30 ? '#EA580C' : undefined,
      iconBg: '#F5F3FF', iconColor: '#7C3AED',
      icon: <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8" strokeWidth={2}/>
      </>,
    },
  ];

  return (
    <div className="page">

      {/* ── Header ── */}
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Tổng quan</h1>
          <p className="pageSub">Thông tin thuê phòng của bạn</p>
        </div>
      </div>

      {/* ── Alert ── */}
      {days <= 30 && expireDate && (
        <div className={`alert ${days <= 7 ? 'alertRed' : 'alertOrange'}`}>
          <div className={`alertIcon ${days <= 7 ? 'alertIconRed' : 'alertIconOrange'}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="alertBody">
            <p className="alertTitle">Hợp đồng sắp hết hạn</p>
            <p className="alertDesc">
              Hợp đồng còn <strong>{days} ngày</strong> (hết hạn {fmtDate(expireDate)}). Vui lòng liên hệ quản lý để gia hạn.
            </p>
          </div>
          <button className={`alertBtn ${days <= 7 ? 'alertBtnRed' : 'alertBtnOrange'}`}>
            Liên hệ ngay
          </button>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="statGrid">
        {stats.map(s => (
          <div key={s.label} className="statCard">
            <div className="statLeft">
              <p className="statLabel">{s.label}</p>
              <p className="statValue">{s.value}</p>
              <p className="statSub" style={s.subColor ? { color: s.subColor } : undefined}>
                {s.sub}
              </p>
            </div>
            <div className="statIcon" style={{ background: s.iconBg, color: s.iconColor }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {s.icon}
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom grid ── */}
      <div className="bottomGrid">

        {/* ── Room info panel ── */}
        <div className="panel">
          <div className="panelHeader">
            <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span className="panelTitle">Thông tin phòng</span>
          </div>

          {[
            { label: 'Số phòng',  value: currentRoom.number,  blue: true },
            { label: 'Tầng',      value: `Tầng ${currentRoom.floor}` },
            { label: 'Sức chứa',  value: `${currentRoom.capacity} người` },
            { label: 'Diện tích', value: `${currentRoom.area} m²` },
            { label: 'Tiền thuê', value: `${(currentTenant?.monthlyRent ?? currentRoom.price).toLocaleString('vi-VN')} đ/tháng` },
            { label: 'Trạng thái', badge: true },
          ].map(row => (
            <div key={row.label} className="infoRow">
              <span className="infoLabel">{row.label}</span>
              {row.badge
                ? <span className="badge badgeGreen">Đang thuê</span>
                : <span className={`infoValue${row.blue ? ' infoValueBlue' : ''}`}>{row.value}</span>
              }
            </div>
          ))}

          <button className="btnPrimary" onClick={() => navigate('/tenant/my-room')}>
            Xem chi tiết phòng
          </button>
        </div>

        {/* ── Right column ── */}
        <div className="rightCol">

          {/* Maintenance panel */}
          <div className="panel">
            <div className="panelHeader">
              <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
              <span className="panelTitle">Yêu cầu bảo trì gần đây</span>
            </div>

            {myMaintenance.length === 0
              ? <p style={{ fontSize: 12, color: '#9CA3AF', padding: '8px 0' }}>Chưa có yêu cầu nào.</p>
              : myMaintenance.map(req => {
                  const st = STATUS_BADGE[req.status] ?? { cls: 'badgeGray', label: req.status };
                  return (
                    <div key={req.id} className="mtItem">
                      <span className={`mtDot ${STATUS_DOT[req.status] ?? 'dotGreen'}`} />
                      <div className="mtBody">
                        <p className="mtTitle">{req.title}</p>
                        <p className="mtDate">{req.createdAt}</p>
                      </div>
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                    </div>
                  );
                })
            }

            <button className="btnOutline" onClick={() => navigate('/tenant/maintenance')}>
              + Gửi yêu cầu mới
            </button>
          </div>

          {/* Quick links panel */}
          <div className="panel">
            <div className="panelHeader">
              <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="panelTitle">Truy cập nhanh</span>
            </div>
            <div className="quickGrid">
              {[
                { label: 'Phòng của tôi', to: '/tenant/my-room',    d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
                { label: 'Hồ sơ cá nhân', to: '/tenant/profile',    d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
                { label: 'Hợp đồng',      to: '/tenant/my-room',    d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6' },
                { label: 'Bảo trì',       to: '/tenant/maintenance', d: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
              ].map(q => (
                <button key={q.label} className="quickBtn" onClick={() => navigate(q.to)}>
                  <svg width="20" height="20" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
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