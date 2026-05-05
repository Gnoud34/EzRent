/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomListing.css';
import mockData from '../../data/mockdata.json';

type Status = 'all' | 'available' | 'occupied';

type Room = {
  id: string;
  number: string;
  capacity: number;
  area: number;
  floor: number;
  status: 'available' | 'occupied';
  description: string;
  amenities: string[];
  tenantIds: string[];
};

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
];

export default function RoomListing() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status>('all');

  const allRooms: Room[] = (mockData.rooms as unknown as Room[]) || [];

  const filtered = allRooms.filter(r => {
    const matchSearch = r.number.toLowerCase().includes(search.toLowerCase()) ||
                        r.floor.toString().includes(search);
    const matchStatus = status === 'all' || r.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="rl-root">
      {/* ── Navbar ── */}
      <nav className="rl-nav">
        <div className="rl-nav-inner">
          <div className="rl-logo" onClick={() => navigate('/')}>
            <svg width="20" height="20" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            EzRent
          </div>
          <button className="rl-btn-login" onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>

      <div className="rl-body">
        <div className="rl-page-header">
          <h1>Room Listings</h1>
          <p>Find the perfect room that fits your needs</p>
        </div>

        {/* ── Toolbar ── */}
        <div className="rl-toolbar">
          <div className="rl-search-box">
            <svg width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by room number, floor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="rl-filter-btns">
            {(['all', 'available', 'occupied'] as Status[]).map(s => (
              <button
                key={s}
                className={`rl-filter-btn ${status === s ? 'rl-filter-btn--active' : ''}`}
                onClick={() => setStatus(s)}
              >
                {s === 'all' ? 'All Rooms' : s === 'available' ? '✅ Available' : '🔴 Occupied'}
              </button>
            ))}
          </div>
        </div>

        <p className="rl-count"><strong>{filtered.length}</strong> rooms found</p>

        {filtered.length === 0 ? (
          <div className="rl-empty">
            <svg width="52" height="52" fill="none" stroke="#D1D5DB" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p>No rooms found</p>
            <span>Try adjusting your filters or keywords</span>
          </div>
        ) : (
          <div className="rl-grid">
            {filtered.map((room, idx) => (
              <div key={room.id} className="rl-card" onClick={() => navigate(`/rooms/${room.id}`)}>
                {/* ── Room Image: Default first image, rotates by index ── */}
                <div className="rl-card-img">
                  <img
                    src={ROOM_IMAGES[idx % ROOM_IMAGES.length]}
                    alt={`Room ${room.number}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className={`rl-status-badge ${room.status === 'available' ? 'rl-status-badge--green' : 'rl-status-badge--gray'}`}>
                    {room.status === 'available' ? 'Available' : 'Occupied'}
                  </span>
                </div>

                <div className="rl-card-body">
                  <div className="rl-card-top">
                    <h3>Room {room.number}</h3>
                    <span className="rl-card-price">
                    </span>
                  </div>
                  <div className="rl-card-meta">
                    <span>🏢 Floor {room.floor}</span>
                    <span>👤 {room.capacity} Guests</span>
                    <span>📐 {room.area}m²</span>
                  </div>
                  <div className="rl-card-amenities">
                    {room.amenities.slice(0, 3).map(a => (
                      <span key={a} className="rl-amenity-tag">{a}</span>
                    ))}
                  </div>
                  <button className="rl-card-btn">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}