import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomListing.css';

type Status = 'all' | 'available' | 'occupied';

type Room = {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied';
  notes: string;
};

export default function RoomListing() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status>('all');

  useEffect(() => {
    fetch('/mockdata.json')
      .then(res => res.json())
      .then(data => setRooms(data.rooms))
      .catch(err => console.error('Failed to load rooms:', err));
  }, []);

  const filtered = rooms.filter(r => {
    const matchSearch = r.number.toLowerCase().includes(search.toLowerCase()) || 
                       r.number.includes(search);
    const matchStatus = status === 'all' || r.status === status;
    return matchSearch && matchStatus;
  });

  // Helper functions
  const getPrice = (roomNumber: string) => {
    const num = parseInt(roomNumber.replace('R', ''));
    if (num >= 200) return 4_200_000;
    if (num >= 100) return 3_500_000;
    return 3_000_000;
  };

  const getFloor = (roomNumber: string) => {
    return parseInt(roomNumber.charAt(1));
  };

  const getArea = (capacity: number) => {
    if (capacity === 1) return 18;
    if (capacity === 2) return 25;
    return 30;
  };

  const getAmenities = (capacity: number) => {
    const base = ['WiFi', 'Điều hòa'];
    if (capacity >= 2) base.push('Tủ lạnh');
    if (capacity >= 3) base.push('Ban công');
    return base;
  };

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
          <button className="rl-btn-login" onClick={() => navigate('/login')}>Đăng nhập</button>
        </div>
      </nav>

      <div className="rl-body">
        {/* ── Page header ── */}
        <div className="rl-page-header">
          <h1>Danh sách phòng trọ</h1>
          <p>Tìm phòng phù hợp với nhu cầu của bạn</p>
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
              placeholder="Tìm theo số phòng, tầng..."
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
                {s === 'all' ? 'Tất cả' : s === 'available' ? '✅ Còn trống' : '🔴 Đã thuê'}
              </button>
            ))}
          </div>
        </div>

        <p className="rl-count">{filtered.length} phòng</p>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="rl-empty">
            <svg width="52" height="52" fill="none" stroke="#D1D5DB" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p>Không tìm thấy phòng nào</p>
            <span>Thử thay đổi bộ lọc hoặc từ khóa</span>
          </div>
        ) : (
          <div className="rl-grid">
            {filtered.map(room => {
              const price = getPrice(room.number);
              const floor = getFloor(room.number);
              const area = getArea(room.capacity);
              const amenities = getAmenities(room.capacity);

              return (
                <div key={room.id} className="rl-card" onClick={() => navigate(`/rooms/${room.id}`)}>
                  {/* Image */}
                  <div className="rl-card-img">
                    <svg width="36" height="36" fill="none" stroke="#93C5FD" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span className={`rl-status-badge ${room.status === 'available' ? 'rl-status-badge--green' : 'rl-status-badge--gray'}`}>
                      {room.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="rl-card-body">
                    <div className="rl-card-top">
                      <h3>Phòng {room.number}</h3>
                      <span className="rl-card-price">
                        {price.toLocaleString('vi-VN')}đ<small>/tháng</small>
                      </span>
                    </div>
                    <div className="rl-card-meta">
                      <span>🏢 Tầng {floor}</span>
                      <span>👤 {room.capacity} người</span>
                      <span>📐 {area}m²</span>
                    </div>
                    <div className="rl-card-amenities">
                      {amenities.slice(0, 3).map(a => (
                        <span key={a} className="rl-amenity-tag">{a}</span>
                      ))}
                    </div>
                    <button className="rl-card-btn">Xem chi tiết →</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}