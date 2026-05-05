/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RoomDetail.css';
import mockData from '../../data/mockdata.json';

type Room = {
  id: string;
  number: string;
  floor: number;
  capacity: number;
  area: number;
  status: 'available' | 'occupied';
  description: string;
  amenities: string[];
};

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
];

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);
  
  // Bước 1: Tạo State để quản lý việc đóng/mở Form
  const [isFormOpen, setIsFormOpen] = useState(false);

  const allRooms = (mockData.rooms as unknown as Room[]) || [];
  const room = allRooms.find(r => r.id === id);

  if (!room) {
    return (
      <div className="rd-not-found">
        <p>❌ Room information not found.</p>
        <button onClick={() => navigate('/rooms')}>← Back to Listings</button>
      </div>
    );
  }

  const available = room.status === 'available';

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg(i => (i - 1 + ROOM_IMAGES.length) % ROOM_IMAGES.length);
  };
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg(i => (i + 1) % ROOM_IMAGES.length);
  };

  // Hàm xử lý gửi form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cảm ơn bạn! Yêu cầu hỗ trợ đã được gửi.");
    setIsFormOpen(false);
  };

  return (
    <div className="rd-root">
      {/* ── Navbar ── */}
      <nav className="rd-nav">
        <div className="rd-nav-inner">
          <div className="rd-logo" onClick={() => navigate('/')}>EzRent</div>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>

      <div className="rd-body">
        {/* ── Breadcrumb ── */}
        <div className="rd-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> ›
          <span onClick={() => navigate('/rooms')}> Room Listings</span> ›
          <span> Room {room.number}</span>
        </div>

        <div className="rd-grid">
          {/* ── LEFT COLUMN ── */}
          <div className="rd-left-col">
            <div className="rd-gallery">
              <div className="rd-gallery-main">
                <img
                  src={ROOM_IMAGES[currentImg]}
                  alt={`Room ${room.number}`}
                />
                <span className={`rd-gallery-badge ${available ? 'rd-green' : 'rd-red'}`}>
                  {available ? '✅ Available' : '🔴 Occupied'}
                </span>
                <button className="rd-gallery-btn rd-gallery-btn--prev" onClick={prevImg}>‹</button>
                <button className="rd-gallery-btn rd-gallery-btn--next" onClick={nextImg}>›</button>
              </div>

              <div className="rd-gallery-thumbs">
                {ROOM_IMAGES.map((src, i) => (
                  <button
                    key={i}
                    className={`rd-gallery-thumb ${i === currentImg ? 'rd-gallery-thumb--active' : ''}`}
                    onClick={() => setCurrentImg(i)}
                  >
                    <img src={src} alt="thumb" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rd-panel">
              <h3>Room Description</h3>
              <p>{room.description}</p>
            </div>

            <div className="rd-panel">
              <h3>Amenities</h3>
              <div className="rd-amenities-list">
                {room.amenities.map(a => (
                  <div key={a} className="rd-amenity-item">{a}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="rd-detail-card">
            <h1>Room {room.number}</h1>
            <div className="rd-info-box">
              <p><span>Floor</span><strong>{room.floor}</strong></p>
              <p><span>Capacity</span><strong>{room.capacity} Guests</strong></p>
              <p><span>Area</span><strong>{room.area} m²</strong></p>
              <p>
                <span>Status</span>
                <strong className={available ? 'rd-text-green' : 'rd-text-red'}>
                  {available ? 'Available' : 'Occupied'}
                </strong>
              </p>
            </div>

            <div className="rd-action-btns">
              {available ? (
                <>
                  <button className="rd-btn-main" onClick={() => navigate('/login')}>📝 Register for Rent</button>
                  {/* Bước 2: Khi ấn sẽ mở Form */}
                  <button className="rd-btn-contact" onClick={() => setIsFormOpen(true)}>📞 Contact Support</button>
                </>
              ) : (
                <button className="rd-btn-alt" onClick={() => navigate('/rooms')}>🔍 View Other Available Rooms</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bước 3: Modal Contact Form ── */}
      {isFormOpen && (
        <div className="rd-modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="rd-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="rd-modal-close" onClick={() => setIsFormOpen(false)}>&times;</button>
            <h3>Contact Support</h3>
            <p>Please fill out the form below to receive assistance for Room {room.number}.</p>
            
            <form onSubmit={handleSubmit} className="rd-contact-form">
              <div className="rd-form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your name..." required />
              </div>
              <div className="rd-form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="0901 234 567" required />
              </div>
              <div className="rd-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="email@example.com" required />
              </div>
              <div className="rd-form-group">
                <label>Message</label>
                <textarea rows={4} placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="rd-btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}