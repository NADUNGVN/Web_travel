import React, { useState, useEffect } from 'react';
import { X, MapPin, Bed, Bath, Users, ExternalLink, MessageSquare, Send, Check, Clock, Car } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

export const VillaDetailModal = ({ villa, onClose, userVote, onVote, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Load real comments from local storage for this villa
  useEffect(() => {
    if (!villa) return;
    const saved = localStorage.getItem(`trip_comments_${villa.id}`);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading comments', err);
      }
    } else {
      setComments([]);
    }
  }, [villa]);

  if (!villa) return null;

  const costPerPerson = getCostPerPerson(villa.priceTotal, 20, 2);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const updated = [
        ...comments,
        {
          id: Date.now(),
          name: currentUser?.name || 'Thành viên đoàn',
          avatar: currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          text: newComment.trim(),
          time: 'Vừa xong'
        }
      ];
      setComments(updated);
      localStorage.setItem(`trip_comments_${villa.id}`, JSON.stringify(updated));
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
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'white' }}>
            Chi Tiết Villa & Bình Chọn
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
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    height: '220px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    flexShrink: 0,
                    snapAlign: 'center'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Title & Location */}
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px', lineHeight: 1.3 }}>
              {villa.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
              <MapPin size={15} color="#38bdf8" />
              <span>{villa.location}</span>
              {villa.sourceUrl && (
                <a
                  href={villa.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#38bdf8', fontWeight: 600, fontSize: '11px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  Link Booking.com gốc <ExternalLink size={11} />
                </a>
              )}
            </div>

            {/* Price Box for 20 People */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '14px',
              padding: '14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Chia đều đoàn 20 người (2 đêm)</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>
                  ~{(costPerPerson / 1000).toLocaleString()}k <span style={{ fontSize: '11px', fontWeight: 500 }}>/ người</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Giá tổng nguyên căn</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>
                  {(villa.priceTotal / 1000000).toFixed(1)} triệu <span style={{ fontSize: '10px', color: '#94a3b8' }}>/ đêm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Action Section */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '14px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
              🎯 Bình chọn ý kiến của bạn cho căn này:
            </div>
            <div className="vote-bar">
              <button
                className={`btn-vote yes ${userVote === 'yes' ? 'active' : ''}`}
                onClick={() => onVote(villa.id, 'yes')}
              >
                🌟 Ưu tiên (+2đ)
              </button>
              <button
                className={`btn-vote maybe ${userVote === 'maybe' ? 'active' : ''}`}
                onClick={() => onVote(villa.id, 'maybe')}
              >
                🤔 Cân nhắc (+1đ)
              </button>
              <button
                className={`btn-vote no ${userVote === 'no' ? 'active' : ''}`}
                onClick={() => onVote(villa.id, 'no')}
              >
                ❌ Không hợp (-2đ)
              </button>
            </div>
          </div>

          {/* Specs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Users size={16} color="#38bdf8" style={{ margin: '0 auto 2px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{villa.capacity} Khách</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Sức chứa thực tế</div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <Bed size={16} color="#34d399" style={{ margin: '0 auto 2px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{villa.bedrooms} Phòng ngủ</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Giường đôi</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Bath size={16} color="#a7f3d0" style={{ margin: '0 auto 2px' }} />
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{villa.bathrooms} WC</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Vệ sinh khép kín</div>
            </div>
          </div>

          {/* Bedding Configuration */}
          {villa.bedConfig && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '14px',
              padding: '12px'
            }}>
              <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#a5b4fc', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bed size={14} /> Cấu Hình Giường Ngủ Cho Đoàn 20 Người:
              </h3>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>
                {villa.bedConfig.summary}
              </div>
            </div>
          )}

          {/* Real User Comments Section */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={15} color="#38bdf8" /> Thảo luận của đoàn ({comments.length})
            </h3>

            {comments.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginBottom: '12px' }}>
                Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến cho căn này!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {comments.map(c => (
                  <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>{c.name}</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#e2e8f0', margin: 0 }}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Nhập ý kiến thảo luận..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '12px'
                }}
              />
              <button className="btn-primary" type="submit" style={{ padding: '8px 14px', fontSize: '12px' }}>
                <Send size={13} /> Gửi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
