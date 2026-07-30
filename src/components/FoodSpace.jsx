import React, { useState } from 'react';
import { Utensils, Plus, MapPin, Send } from 'lucide-react';
import { mockFoodPlaces } from '../data/mockFood';

export const FoodSpace = ({ userVotes, onVote }) => {
  const [customPlaces, setCustomPlaces] = useState([]);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const allFood = [...mockFoodPlaces, ...customPlaces];

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const newFood = {
        id: `custom-food-${Date.now()}`,
        name: name.trim(),
        specialty: specialty.trim() || 'Hải sản / Lẩu nướng Vũng Tàu',
        priceAvg: 'Theo thực đơn',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name.trim() + ' Vũng Tàu')}`
      };
      setCustomPlaces([...customPlaces, newFood]);
      setName('');
      setSpecialty('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
      {/* Top Header Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Utensils color="#fbbf24" size={18} /> Không Gian 2: Ăn Gì?
        </h2>
        <button
          className="btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ fontSize: '11px', padding: '6px 12px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
        >
          <Plus size={13} /> {showAddForm ? 'Đóng' : 'Đề xuất quán ăn'}
        </button>
      </div>

      {/* Add Custom Food Form */}
      {showAddForm && (
        <form onSubmit={handleAddCustom} className="glass-panel" style={{ padding: '14px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#fbbf24' }}>
            ➕ Thêm quán ăn bạn muốn đề xuất cho cả đoàn 20 người:
          </div>
          <input
            type="text"
            placeholder="Tên quán ăn (ví dụ: Hải sản Gành Hào, Lẩu cá đuối 7 Lượm...)"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '12px'
            }}
          />
          <input
            type="text"
            placeholder="Món đặc sắc (ví dụ: Lẩu cá đuối măng chua, Tôm hùm nướng...)"
            value={specialty}
            onChange={e => setSpecialty(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '12px'
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '8px', fontSize: '12px', justifyContent: 'center', background: '#f59e0b' }}>
            <Send size={13} /> Lưu quán ăn đề xuất
          </button>
        </form>
      )}

      {/* List or Empty State */}
      {allFood.length === 0 ? (
        <div className="glass-panel" style={{ padding: '32px 20px', borderRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Utensils size={28} color="#fbbf24" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
              Chưa có danh sách quán ăn
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', maxWidth: '320px', lineHeight: 1.4, margin: '0 auto' }}>
              Bạn chưa gửi link danh sách nhà hàng/quán ăn Vũng Tàu. Bạn có thể gửi link Google Sheet hoặc bấm nút <b>"+ Đề xuất quán ăn"</b> ở trên để thêm vào!
            </p>
          </div>
        </div>
      ) : (
        <div className="villa-grid">
          {allFood.map(place => (
            <div key={place.id} className="villa-card glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <img
                  src={place.image}
                  alt={place.name}
                  style={{ width: '75px', height: '75px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>
                      {place.name}
                    </h3>
                    <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600' }}>
                      {place.specialty}
                    </div>
                  </div>

                  <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    <MapPin size={11} /> Bản đồ Google Maps
                  </a>
                </div>
              </div>

              {/* Voting Bar */}
              <div className="vote-bar" style={{ paddingTop: '6px' }}>
                <button
                  className={`btn-vote yes ${userVotes[place.id] === 'yes' ? 'active' : ''}`}
                  onClick={() => onVote(place.id, 'yes')}
                  style={{ fontSize: '10px', padding: '6px 2px' }}
                >
                  🌟 Muốn ăn (+2)
                </button>
                <button
                  className={`btn-vote maybe ${userVotes[place.id] === 'maybe' ? 'active' : ''}`}
                  onClick={() => onVote(place.id, 'maybe')}
                  style={{ fontSize: '10px', padding: '6px 2px' }}
                >
                  🤔 Thử xem (+1)
                </button>
                <button
                  className={`btn-vote no ${userVotes[place.id] === 'no' ? 'active' : ''}`}
                  onClick={() => onVote(place.id, 'no')}
                  style={{ fontSize: '10px', padding: '6px 2px' }}
                >
                  ❌ Không ăn (-2)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
