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

            {/* ── Image gallery ── */}
            <div className="rd-gallery">
              {/* Main image */}
              <div className="rd-gallery-main">
                <img
                  src={ROOM_IMAGES[currentImg]}
                  alt={`Room ${room.number} - Image ${currentImg + 1}`}
                />
                {/* Status badge */}
                <span className={`rd-gallery-badge ${available ? 'rd-green' : 'rd-red'}`}>
                  {available ? '✅ Available' : '🔴 Occupied'}
                </span>
                {/* Prev / Next buttons */}
                <button className="rd-gallery-btn rd-gallery-btn--prev" onClick={prevImg}>
                  ‹
                </button>
                <button className="rd-gallery-btn rd-gallery-btn--next" onClick={nextImg}>
                  ›
                </button>
                {/* Dots indicator */}
                <div className="rd-gallery-dots">
                  {ROOM_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      className={`rd-gallery-dot ${i === currentImg ? 'rd-gallery-dot--active' : ''}`}
                      onClick={e => { e.stopPropagation(); setCurrentImg(i); }}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="rd-gallery-thumbs">
                {ROOM_IMAGES.map((src, i) => (
                  <button
                    key={i}
                    className={`rd-gallery-thumb ${i === currentImg ? 'rd-gallery-thumb--active' : ''}`}
                    onClick={() => setCurrentImg(i)}
                  >
                    <img src={src} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rd-panel">
              <h3>Room Description</h3>
              <p>{room.description}</p>
            </div>

            {/* Amenities */}
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
                  <button className="rd-btn-main" onClick={() => navigate('/login')}>
                    📝 Register for Rent
                  </button>
                  <button className="rd-btn-contact" onClick={() => alert('Contact: 0901 234 567')}>
                    📞 Contact Support
                  </button>
                </>
              ) : (
                <button className="rd-btn-alt" onClick={() => navigate('/rooms')}>
                  🔍 View Other Available Rooms
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}