import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import mockData from '../../data/mockdata.json';

type Room = {
  id: string;
  number: string;
  capacity: number;
  area: number;
  floor: number;
  status: string;
  description: string;
  amenities: string[];
  tenantIds: string[];
};

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
];

const FEATURES = [
  { icon: '🔒', title: '24/7 Security',        desc: 'Surveillance cameras and guards on duty full-time.' },
  { icon: '⚡', title: 'Utilities Included',    desc: 'Stable electricity and water systems with transparent billing.' },
  { icon: '🌐', title: 'High-speed WiFi',      desc: 'Free fiber optic internet for all residents.' },
  { icon: '🛠️', title: 'Quick Maintenance',    desc: 'Technical team handles issues within 24 hours.' },
  { icon: '🅿️', title: 'Parking Lot',          desc: 'Spacious basement with secure keycard access.' },
  { icon: '🧹', title: 'General Cleaning',     desc: 'Public areas are cleaned thoroughly every day.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const featuredRooms = (mockData.rooms as unknown as Room[]).slice(0, 4);

  return (
    <div className="lp-root">
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
            <a href="#features">Amenities</a>
            <a href="#rooms">Available Rooms</a>
            <a href="#contact">Contact</a>
            <button className="lp-btn-outline" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </nav>

      <section className="lp-hero">
        <div>
          <p className="lp-hero-badge">🏠 Smart Rental Management System</p>
          <h1 className="lp-hero-title">Find your<br /><span>perfect room today</span></h1>
          <p className="lp-hero-sub">
            EzRent connects tenants and landlords easily, transparently, and efficiently.
          </p>
          <div className="lp-hero-btns">
            <button className="lp-btn-primary" onClick={() => navigate('/rooms')}>View Vacancies</button>
            <button className="lp-btn-ghost"   onClick={() => navigate('/login')}>Login</button>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-stat"><strong>120+</strong><span>Rooms</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><strong>300+</strong><span>Tenants</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><strong>98%</strong><span>Satisfaction</span></div>
          </div>
        </div>
        <div className="lp-hero-img">
          <div className="lp-hero-img-placeholder">
            <img
              src={ROOM_IMAGES[0]}
              alt="EzRent Hero"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }}
            />
          </div>
        </div>
      </section>

      <section id="features" className="lp-section lp-section--gray">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <h2>Why choose EzRent?</h2>
            <p>We provide the best living experience for every resident.</p>
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

      <section id="rooms" className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <h2>Featured Rooms</h2>
            <p>Check out our latest updated listings.</p>
          </div>
          <div className="lp-room-grid">
            {featuredRooms.map((room, idx) => (
              <div key={room.id} className="lp-room-card" onClick={() => navigate(`/rooms/${room.id}`)}>
                <div className="lp-room-img">
                  <img
                    src={ROOM_IMAGES[idx % ROOM_IMAGES.length]}
                    alt={`Room ${room.number}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className={`lp-room-badge ${room.status === 'available' ? 'lp-room-badge--green' : 'lp-room-badge--gray'}`}>
                    {room.status === 'available' ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <div className="lp-room-body">
                  <div className="lp-room-header">
                    <h3>Room {room.number}</h3>
                  </div>
                  <div className="lp-room-meta">
                    <span>🏢 Floor {room.floor}</span>
                    <span>👤 {room.capacity} Guests</span>
                    <span>📐 {room.area}m²</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-view-all">
            <button className="lp-btn-outline-blue" onClick={() => navigate('/rooms')}>
              View all rooms →
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="lp-section lp-section--gray">
        <div className="lp-section-inner lp-contact-grid">
          <div className="lp-contact-info">
            <h2>Get in touch</h2>
            <p>Need advice about our rooms or want to schedule a viewing?</p>
            <div className="lp-contact-items">
              <div className="lp-contact-item"><span>📍</span><p>123 ABC Street, District X, HCMC</p></div>
              <div className="lp-contact-item"><span>📞</span><p>0901 234 567</p></div>
              <div className="lp-contact-item"><span>✉️</span><p>support@ezrent.vn</p></div>
            </div>
          </div>
          <form className="lp-contact-form" onSubmit={e => e.preventDefault()}>
            <h3>Send a Message</h3>
            <div className="lp-form-row">
              <div className="lp-form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="lp-form-group">
                <label>Email</label>
                <input type="email" placeholder="email@example.com" />
              </div>
            </div>
            <div className="lp-form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="0901 234 567" />
            </div>
            <div className="lp-form-group">
              <label>Message</label>
              <textarea rows={4} placeholder="How can we help you?" />
            </div>
            <button type="submit" className="lp-btn-primary lp-btn-full">Send Message</button>
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
          <p className="lp-footer-copy">© 2026 EzRent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}