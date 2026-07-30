import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Users, Star, ExternalLink, MessageSquare, Send, Check, Sparkles, Clock, Car, Shield } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

export const VillaDetailModal = ({ villa, onClose, userVote, onVote, currentUser }) => {
  const [comments, setComments] = useState([
    { id: 1, name: 'Minh Tuấn', text: 'Căn này bể bơi siêu rộng, ngắm mây thích lắm!', time: '10 phút trước' },
    { id: 2, name: 'Hoàng Nam', text: 'Phòng ngủ rộng rãi vừa đủ cho 20 người chúng mình nè.', time: '1 giờ trước' }
  ]);
  const [newComment, setNewComment] = useState('');

  if (!villa) return null;

  const costPerPerson = getCostPerPerson(villa.priceTotal, 20, 2);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          name: currentUser?.name || 'Bạn',
          text: newComment.trim(),
          time: 'Vừa xong'
        }
      ]);
      setNewComment('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(12px)',
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'white' }}>
            Chi Tiết Nâng Cao Villa
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Gallery Carousel */}
          <div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', snapType: 'x mandatory' }}>
              {villa.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${villa.name} ${idx + 1}`}
                  style={{
                    width: '85%',
                    height: '240px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    flexShrink: 0,
                    snapAlign: 'center'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Title & Price */}
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', lineHeight: 1.3 }}>
              {villa.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
              <MapPin size={16} color="#38bdf8" />
              <span>{villa.location}</span>
            </div>

            {/* Price Table Box for 20 People */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Ước tính cho đoàn 20 người (2 đêm)</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#34d399' }}>
                  {(costPerPerson / 1000).toLocaleString()}k <span style={{ fontSize: '12px', fontWeight: 500 }}>/ người</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Giá thuê tổng nguyên căn</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>
                  {(villa.priceTotal / 1000000).toFixed(1)} triệu <span style={{ fontSize: '11px', color: '#94a3b8' }}>/ đêm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Users size={18} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{villa.capacity} Khách</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Sức chứa tối đa</div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <Bed size={18} color="#34d399" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{villa.bedrooms} Phòng ngủ</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Giường đôi lớn</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Bath size={18} color="#a7f3d0" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{villa.bathrooms} WC</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Vệ sinh khép kín</div>
            </div>
          </div>

          {/* Detailed Bedding Configuration */}
          {villa.bedConfig && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '14px',
              padding: '14px'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#a5b4fc', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bed size={16} /> Cấu Hình Giường Ngủ Cho Đoàn 20 Người:
              </h3>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>
                {villa.bedConfig.summary}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Đảm bảo đủ chỗ nằm thoải mái cho tất cả các gia đình & bạn bè trong đoàn.
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Mô tả & Ưu điểm</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
              {villa.description}
            </p>
          </div>

          {/* Detailed Amenities */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Tiện ích nổi bật</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {villa.amenities.map((item, idx) => (
                <span key={idx} style={{
                  background: 'rgba(51, 65, 85, 0.8)',
                  color: '#e2e8f0',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Check size={14} color="#34d399" /> {item}
                </span>
              ))}
            </div>
          </div>

          {/* House Rules & Parking */}
          {villa.houseRules && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} color="#fbbf24" /> Quy Định & Bãi Đỗ Xe:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                <div><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> Check-in: <b>{villa.houseRules.check_in}</b></div>
                <div><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> Check-out: <b>{villa.houseRules.check_out}</b></div>
              </div>
              <div style={{ fontSize: '12px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Car size={14} /> Bãi xe: <b>{villa.houseRules.parking}</b>
              </div>
            </div>
          )}

          {/* Google Maps Link Button */}
          {villa.mapsUrl && (
            <a
              href={villa.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ justifyContent: 'center', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
            >
              <MapPin size={16} /> Định vị Google Maps chi tiết <ExternalLink size={14} />
            </a>
          )}

          {/* Comments Section */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} color="#38bdf8" /> Ý kiến thảo luận nhóm ({comments.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
              {comments.map((c) => (
                <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>{c.name}</span>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{c.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Viết nhận xét của bạn..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: 'white',
                  fontSize: '13px'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 14px' }}>
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Sticky Bottom Vote Action inside Modal */}
          <div style={{
            position: 'sticky',
            bottom: 0,
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '12px 0 0 0',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div className="vote-bar">
              <button
                className={`btn-vote yes ${userVote === 'yes' ? 'active' : ''}`}
                onClick={() => onVote(villa.id, 'yes')}
              >
                🌟 Ưu tiên
              </button>
              <button
                className={`btn-vote maybe ${userVote === 'maybe' ? 'active' : ''}`}
                onClick={() => onVote(villa.id, 'maybe')}
              >
                🤔 Cân nhắc
              </button>
              <button
                className={`btn-vote no ${userVote === 'no' ? 'active' : ''}`}
                onClick={() => onVote(villa.id, 'no')}
              >
                ❌ Không hợp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
