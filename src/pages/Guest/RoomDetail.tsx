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
  price: number;
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
        <p>❌ Không tìm thấy thông tin phòng.</p>
        <button onClick={() => navigate('/rooms')}>← Quay lại danh sách</button>
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
          <button onClick={() => navigate('/login')}>Đăng nhập</button>
        </div>
      </nav>

      <div className="rd-body">
        {/* ── Breadcrumb ── */}
        <div className="rd-breadcrumb">
          <span onClick={() => navigate('/')}>Trang chủ</span> ›
          <span onClick={() => navigate('/rooms')}> Phòng trọ</span> ›
          <span> Phòng {room.number}</span>
        </div>

        <div className="rd-grid">
          {/* ── CỘT TRÁI ── */}
          <div className="rd-left-col">

            {/* ── Image gallery ── */}
            <div className="rd-gallery">
              {/* Main image */}
              <div className="rd-gallery-main">
                <img
                  src={ROOM_IMAGES[currentImg]}
                  alt={`Phòng ${room.number} - ảnh ${currentImg + 1}`}
                />
                {/* Status badge */}
                <span className={`rd-gallery-badge ${available ? 'rd-green' : 'rd-red'}`}>
                  {available ? '✅ Còn trống' : '🔴 Đã thuê'}
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
                    <img src={src} alt={`Ảnh ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rd-panel">
              <h3>Mô tả phòng</h3>
              <p>{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="rd-panel">
              <h3>Tiện nghi</h3>
              <div className="rd-amenities-list">
                {room.amenities.map(a => (
                  <div key={a} className="rd-amenity-item">{a}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CỘT PHẢI ── */}
          <div className="rd-detail-card">
            <h1>Phòng {room.number}</h1>
            <p className="rd-card-price">{room.price.toLocaleString('vi-VN')}đ</p>

            <div className="rd-info-box">
              <p><span>Tầng</span><strong>{room.floor}</strong></p>
              <p><span>Sức chứa</span><strong>{room.capacity} người</strong></p>
              <p><span>Diện tích</span><strong>{room.area} m²</strong></p>
              <p>
                <span>Trạng thái</span>
                <strong className={available ? 'rd-text-green' : 'rd-text-red'}>
                  {available ? 'Còn trống' : 'Đã thuê'}
                </strong>
              </p>
            </div>

            <div className="rd-action-btns">
              {available ? (
                <>
                  <button className="rd-btn-main" onClick={() => navigate('/login')}>
                    📝 Đăng ký thuê phòng
                  </button>
                  <button className="rd-btn-contact" onClick={() => alert('Liên hệ: 0901 234 567')}>
                    📞 Liên hệ tư vấn
                  </button>
                </>
              ) : (
                <button className="rd-btn-alt" onClick={() => navigate('/rooms')}>
                  🔍 Xem phòng trống khác
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}