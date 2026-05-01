import { useParams, useNavigate } from 'react-router-dom';
import './RoomDetail.css';

type Room = {
  id: number;
  number: string;
  floor: number;
  capacity: number;
  area: number;
  price: number;
  status: 'available' | 'occupied';
  description: string;
  amenities: string[];
};

const ROOMS: Record<string, Room> = {
  '1': {
    id: 1,
    number: '101',
    floor: 1,
    capacity: 2,
    area: 20,
    price: 3_500_000,
    status: 'available',
    description: 'Phòng góc thoáng mát, ánh sáng tự nhiên tốt. Thuận tiện đi lại, gần khu vực ăn uống và siêu thị. Khu vực yên tĩnh phù hợp cho sinh viên và người đi làm.',
    amenities: ['WiFi tốc độ cao', 'Điều hòa', 'Tủ lạnh', 'Bàn học', 'WC riêng', 'Giường ngủ'],
  },
  '2': {
    id: 2,
    number: '202',
    floor: 2,
    capacity: 2,
    area: 25,
    price: 4_200_000,
    status: 'occupied',
    description: 'Phòng tầng 2 có ban công rộng rãi, view thoáng đãng. Khu vực yên tĩnh, an ninh tốt.',
    amenities: ['WiFi tốc độ cao', 'Điều hòa', 'Ban công', 'WC riêng', 'Tủ lạnh'],
  },
  '3': {
    id: 3,
    number: '303',
    floor: 3,
    capacity: 3,
    area: 30,
    price: 5_000_000,
    status: 'available',
    description: 'Phòng rộng rãi phù hợp cho 3 người. Đầy đủ tiện nghi, thoáng mát.',
    amenities: ['WiFi tốc độ cao', 'Điều hòa', 'Tủ lạnh', 'Ban công', 'WC riêng', 'Giường ngủ', 'Bàn học'],
  },
  '4': {
    id: 4,
    number: '404',
    floor: 4,
    capacity: 1,
    area: 18,
    price: 2_800_000,
    status: 'available',
    description: 'Phòng đơn nhỏ gọn, phù hợp cho sinh viên hoặc người độc thân.',
    amenities: ['WiFi tốc độ cao', 'Điều hòa', 'WC riêng', 'Giường ngủ'],
  },
};

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const room: Room | null = id ? ROOMS[id] : null;

  if (!room) {
    return (
      <div className="rd-not-found">
        <p>❌ Không tìm thấy phòng.</p>
        <button onClick={() => navigate('/rooms')}>← Quay lại danh sách</button>
      </div>
    );
  }

  const available = room.status === 'available';

  return (
    <div className="rd-root">
      {/* ── Navbar ── */}
      <nav className="rd-nav">
        <div className="rd-nav-inner">
          <div className="rd-logo" onClick={() => navigate('/')}>
            EzRent
          </div>
          <button onClick={() => navigate('/login')}>
            Đăng nhập
          </button>
        </div>
      </nav>

      <div className="rd-body">
        {/* ── Breadcrumb ── */}
        <div className="rd-breadcrumb">
          <span onClick={() => navigate('/')}>Trang chủ</span>
          <span>›</span>
          <span onClick={() => navigate('/rooms')}>Phòng trọ</span>
          <span>›</span>
          <span>Phòng {room.number}</span>
        </div>

        <div className="rd-grid">
          {/* ── LEFT ── */}
          <div>
            {/* Room image */}
            <div className="rd-img">
              <span className={available ? 'rd-green' : 'rd-red'}>
                {available ? '✅ Còn trống' : '🔴 Đã thuê'}
              </span>
            </div>

            {/* Description */}
            <div className="rd-panel">
              <h3>Mô tả phòng</h3>
              <p>{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="rd-panel">
              <h3>Tiện nghi</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                {room.amenities.map((a) => (
                  <div key={a}>{a}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Sticky detail card ── */}
          <div className="rd-detail-card">
            <h1>Phòng {room.number}</h1>

            <p>{room.price.toLocaleString('vi-VN')}đ</p>

            <div>
              <p>
                <span>Tầng</span>
                <strong>{room.floor}</strong>
              </p>
              <p>
                <span>Sức chứa</span>
                <strong>{room.capacity} người</strong>
              </p>
              <p>
                <span>Diện tích</span>
                <strong>{room.area} m²</strong>
              </p>
              <p>
                <span>Trạng thái</span>
                <strong className={available ? 'rd-green' : 'rd-red'}>
                  {available ? 'Còn trống' : 'Đã thuê'}
                </strong>
              </p>
            </div>

            {available ? (
              <>
                <button onClick={() => navigate('/login')}>
                  📝 Đăng ký thuê phòng
                </button>
                <button
                  style={{
                    background: 'transparent',
                    color: '#2563EB',
                    border: '1px solid #BFDBFE',
                    marginTop: '10px',
                  }}
                  onClick={() => alert('Liên hệ: 0901 234 567')}
                >
                  📞 Liên hệ tư vấn
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/rooms')}>
                🔍 Xem phòng trống khác
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}