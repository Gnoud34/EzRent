/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TenantDashboard.css';
import mockData from '../../data/mockdata.json';

/* ─── Data Fetching ─── */
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = mockData.users.find(u => u.id === storedUser.id) || mockData.users[1];
const currentTenant = mockData.tenants.find(t => (t as any).userId === currentUser.id)
  || (mockData.tenants[0] as any);
const currentRoom = (mockData.rooms.find(r => r.id === currentTenant?.roomId)
  || mockData.rooms[0]) as any;
const myMaintenance = (mockData.maintenanceRequests as any[])
  .filter(m => m.tenantId === currentTenant?.id)
  .slice(0, 3);

/* ─── Helpers ─── */
function parseDate(d: string) {
  if (!d) return new Date();
  const parts = d.split('/');
  if (parts.length === 3) {
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }
  return new Date(d);
}

function getDaysLeft(d: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = parseDate(d); end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}

function fmtDate(d: string) {
  const date = parseDate(d);
  if (isNaN(date.getTime())) return '—';
  // Changed to US locale
  return date.toLocaleDateString('en-US');
}

function fmtMonths(d: string) {
  const date = parseDate(d);
  const diff = Date.now() - date.getTime();
  const months = Math.floor(diff / (30 * 86_400_000));
  return months > 0 ? months : 0;
}

const STATUS_DOT: Record<string, string> = {
  pending:      'dotYellow',
  'in-progress': 'dotBlue',
  resolved:      'dotGreen',
};
const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  pending:      { cls: 'badgeYellow', label: 'Pending'  },
  'in-progress': { cls: 'badgeBlue',   label: 'In Progress' },
  resolved:      { cls: 'badgeGray',   label: 'Resolved'   },
};

export default function TenantDashboard() {
  const navigate = useNavigate();

  const expireDate = currentTenant?.expireDate || '';
  const moveInDate = currentTenant?.moveInDate || '';
  const days = expireDate ? getDaysLeft(expireDate) : 999;

  const stats = [
    {
      label: 'Room No.',
      value: `Rm.${currentRoom.number.replace('R', '')}`,
      sub: `Floor ${currentRoom.floor}`,
      iconBg: '#EFF6FF', iconColor: '#2563EB',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    },
    {
      label: 'Status',
      value: 'In Use',
      sub: 'Contract is active',
      iconBg: '#F0FDF4', iconColor: '#16A34A',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      label: 'Move-in Date',
      value: moveInDate ? fmtDate(moveInDate) : '—',
      sub: moveInDate 
        ? (getDaysLeft(moveInDate) > 0 
        ? `Upcoming (${getDaysLeft(moveInDate)} days left)` 
        : `${fmtMonths(moveInDate)} months ago`) 
        : '',
      iconBg: '#FFFBEB', iconColor: '#D97706',
      icon: <>
        <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2}/>
        <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2}/>
        <line x1="8"  y1="2" x2="8"  y2="6" strokeWidth={2}/>
        <line x1="3"  y1="10" x2="21" y2="10" strokeWidth={2}/>
      </>,
    },
    {
      label: 'Contract Expire',
      value: expireDate ? fmtDate(expireDate) : '—',
      sub: days > 0 ? `${days} days left` : 'Contract expired',
      subColor: (days > 0 && days <= 30) ? '#EA580C' : (days <= 0 ? '#EF4444' : undefined),
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
          <h1 className="pageTitle">Overview</h1>
          <p className="pageSub">Room Details</p>
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
            <p className="alertTitle">Contract Expiring Soon</p>
            <p className="alertDesc">
              Your contract has <strong>{days} days left</strong> (Expires on {fmtDate(expireDate)}). Please contact management for renewal.
            </p>
          </div>
          <button className={`alertBtn ${days <= 7 ? 'alertBtnRed' : 'alertBtnOrange'}`}>
            Contact Now
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
            <span className="panelTitle">Room Information</span>
          </div>

          {[
            { label: 'Room Number',  value: currentRoom.number,  blue: true },
            { label: 'Floor',      value: `Floor ${currentRoom.floor}` },
            { label: 'Capacity',  value: `${currentRoom.capacity} People` },
            { label: 'Area',      value: `${currentRoom.area} m²` },
            { label: 'Status',    badge: true },
          ].map(row => (
            <div key={row.label} className="infoRow">
              <span className="infoLabel">{row.label}</span>
              {row.badge
                ? <span className="badge badgeGreen">Occupied</span>
                : <span className={`infoValue${row.blue ? ' infoValueBlue' : ''}`}>{row.value}</span>
              }
            </div>
          ))}

          <button className="btnPrimary" onClick={() => navigate('/tenant/my-room')}>
            View Room Details
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
              <span className="panelTitle">Recent Maintenance</span>
            </div>

            {myMaintenance.length === 0
              ? <p style={{ fontSize: 12, color: '#9CA3AF', padding: '8px 0' }}>No recent requests found.</p>
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
              + New Request
            </button>
          </div>

          {/* Quick links panel */}
          <div className="panel">
            <div className="panelHeader">
              <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="panelTitle">Quick Access</span>
            </div>
            <div className="quickGrid">
              {[
                { label: 'My Room',    to: '/tenant/my-room',     d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
                { label: 'Profile',    to: '/tenant/profile',     d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
                { label: 'Contract',   to: '/tenant/my-room',     d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6' },
                { label: 'Maintenance', to: '/tenant/maintenance', d: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
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