import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

type Room = {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied';
  notes: string;
};

const FEATURES = [
  { icon: '🔒', title: 'An ninh 24/7',        desc: 'Camera giám sát và bảo vệ túc trực toàn thời gian.' },
  { icon: '⚡', title: 'Điện nước đầy đủ',    desc: 'Hệ thống điện nước ổn định, tính phí minh bạch.' },
  { icon: '🌐', title: 'WiFi tốc độ cao',     desc: 'Internet cáp quang miễn phí cho tất cả cư dân.' },
  { icon: '🛠️', title: 'Bảo trì nhanh',      desc: 'Đội ngũ kỹ thuật xử lý sự cố trong vòng 24h.' },
  { icon: '🅿️', title: 'Bãi đỗ xe',          desc: 'Bãi đỗ xe rộng rãi cho xe máy và ô tô.' },
  { icon: '🏪', title: 'Tiện ích xung quanh', desc: 'Gần chợ, siêu thị, trường học và bệnh viện.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch('/mockdata.json')
      .then(res => res.json())
      .then(data => {
        // Lấy 4 phòng đầu tiên để preview
        setRooms(data.rooms.slice(0, 4));
      })
      .catch(err => console.error('Failed to load rooms:', err));
  }, []);

  // Helper: get price based on room number
  const getPrice = (roomNumber: string) => {
    const num = parseInt(roomNumber.replace('R', ''));
    if (num >= 200) return 4_200_000;
    if (num >= 100) return 3_500_000;
    return 3_000_000;
  };

  // Helper: get floor from room number
  const getFloor = (roomNumber: string) => {
    return parseInt(roomNumber.charAt(1));
  };

  return (
    <div className="lp-root">
      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <svg width="22" height="22" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span>EzRent</span>
          </div>
          <div className="lp-nav-links">
            <a href="#rooms">Phòng trọ</a>
            <a href="#features">Tiện ích</a>
            <a href="#contact">Liên hệ</a>
            <button className="lp-btn-outline" onClick={() => navigate('/login')}>Đăng nhập</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div>
          <p className="lp-hero-badge">🏠 Hệ thống quản lý phòng trọ thông minh</p>
          <h1 className="lp-hero-title">Tìm phòng trọ<br /><span>ưng ý ngay hôm nay</span></h1>
          <p className="lp-hero-sub">
            EzRent kết nối người thuê và chủ nhà một cách dễ dàng, minh bạch và hiệu quả.
            Quản lý hợp đồng, thanh toán và bảo trì — tất cả trong một nền tảng.
          </p>
          <div className="lp-hero-btns">
            <button className="lp-btn-primary" onClick={() => navigate('/rooms')}>Xem phòng trống</button>
            <button className="lp-btn-ghost"   onClick={() => navigate('/login')}>Đăng nhập</button>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-stat"><strong>120+</strong><span>Phòng trọ</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><strong>300+</strong><span>Khách thuê</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><strong>98%</strong><span>Hài lòng</span></div>
          </div>
        </div>
        <div className="lp-hero-img">
          <div className="lp-hero-img-placeholder">
            <svg width="80" height="80" fill="none" stroke="#93C5FD" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p>EzRent</p>
          </div>
        </div>
      </section>

      {/* ── Room preview ── */}
      <section id="rooms" className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <h2>Phòng nổi bật</h2>
            <p>Xem trước một số phòng đang có sẵn</p>
          </div>
          <div className="lp-room-grid">
            {rooms.map(room => {
              const floor = getFloor(room.number);
              const price = getPrice(room.number);
              const area = room.capacity === 1 ? 18 : room.capacity === 2 ? 25 : 30;
              
              return (
                <div key={room.id} className="lp-room-card" onClick={() => navigate(`/rooms/${room.id}`)}>
                  <div className="lp-room-img">
                    <svg width="40" height="40" fill="none" stroke="#93C5FD" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span className={`lp-room-badge ${room.status === 'available' ? 'lp-room-badge--green' : 'lp-room-badge--gray'}`}>
                      {room.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                    </span>
                  </div>
                  <div className="lp-room-body">
                    <div className="lp-room-header">
                      <h3>Phòng {room.number}</h3>
                      <span className="lp-room-price">{price.toLocaleString('vi-VN')}đ<small>/tháng</small></span>
                    </div>
                    <div className="lp-room-meta">
                      <span>🏢 Tầng {floor}</span>
                      <span>👤 {room.capacity} người</span>
                      <span>📐 {area}m²</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lp-view-all">
            <button className="lp-btn-outline-blue" onClick={() => navigate('/rooms')}>
              Xem tất cả phòng →
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="lp-section lp-section--gray">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <h2>Tiện ích nổi bật</h2>
            <p>Chúng tôi cung cấp môi trường sống tốt nhất cho cư dân</p>
          </div>
          <div className="lp-feature-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="lp-section">
        <div className="lp-section-inner lp-contact-grid">
          <div className="lp-contact-info">
            <h2>Liên hệ với chúng tôi</h2>
            <p>Có thắc mắc về phòng trọ? Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn.</p>
            <div className="lp-contact-items">
              <div className="lp-contact-item"><span>📍</span><p>123 Đường Lê Lợi, Q.1, TP.HCM</p></div>
              <div className="lp-contact-item"><span>📞</span><p>0901 234 567</p></div>
              <div className="lp-contact-item"><span>✉️</span><p>contact@ezrent.vn</p></div>
              <div className="lp-contact-item"><span>🕐</span><p>Thứ 2 – Thứ 7: 8:00 – 18:00</p></div>
            </div>
          </div>
          <form className="lp-contact-form" onSubmit={e => e.preventDefault()}>
            <h3>Gửi tin nhắn</h3>
            <div className="lp-form-row">
              <div className="lp-form-group">
                <label>Họ và tên</label>
                <input type="text" placeholder="Nguyễn Văn A" />
              </div>
              <div className="lp-form-group">
                <label>Email</label>
                <input type="email" placeholder="email@example.com" />
              </div>
            </div>
            <div className="lp-form-group">
              <label>Số điện thoại</label>
              <input type="tel" placeholder="0901 234 567" />
            </div>
            <div className="lp-form-group">
              <label>Tin nhắn</label>
              <textarea rows={4} placeholder="Nội dung tin nhắn..." />
            </div>
            <button type="submit" className="lp-btn-primary lp-btn-full">Gửi tin nhắn</button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo lp-footer-logo">
            <svg width="18" height="18" fill="none" stroke="#93C5FD" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span>EzRent</span>
          </div>
          <p className="lp-footer-copy">© 2025 EzRent. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}