import React, { useState, useEffect } from 'react';
import { X, MapPin, Bed, Bath, Users, ExternalLink, MessageSquare, Send, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80";

export const VillaDetailModal = ({ villa, onClose, userVote, onVote, currentUser }) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Safe image list resolution for both Villas and Food Items
  const imagesList = villa?.images && villa.images.length > 0
    ? villa.images
    : (villa?.image ? [villa.image] : [FALLBACK_IMAGE]);

  const isFoodItem = villa?.itemType === 'food' || !villa?.priceTotal;
  const costPerPerson = isFoodItem ? 0 : getCostPerPerson(villa.priceTotal, 20, 2);
  const totalMillion = !isFoodItem && villa?.priceTotal ? (villa.priceTotal / 1000000).toFixed(1) : '0';

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

  const handleNextImg = () => {
    setActiveImgIdx((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImg = () => {
    setActiveImgIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

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
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: 'white' }}>
            {isFoodItem ? 'Chi Tiết Quán Ăn' : 'Chi Tiết Villa & Bộ Sưu Tập Ảnh'}
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
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Main Interactive Gallery Viewer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Main Hero Photo View */}
            <div style={{ position: 'relative', height: '240px', borderRadius: '16px', overflow: 'hidden', background: '#0f172a' }}>
              <img
                src={imagesList[activeImgIdx]}
                alt={`${villa.name} ${activeImgIdx + 1}`}
                onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Photo Counter Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '99px',
                fontSize: '11px',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}>
                📸 {activeImgIdx + 1} / {imagesList.length} ảnh
              </div>

              {/* Prev / Next Arrows */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImg}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255,255,255,0.2)',
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
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextImg}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255,255,255,0.2)',
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
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Selection Bar */}
            {imagesList.length > 1 && (
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {imagesList.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    onClick={() => setActiveImgIdx(idx)}
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: activeImgIdx === idx ? '2px solid #38bdf8' : '2px solid transparent',
                      opacity: activeImgIdx === idx ? 1 : 0.6,
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Row */}
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '6px', lineHeight: 1.3 }}>
              {villa.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>
              <MapPin size={15} color="#38bdf8" />
              <span>{villa.location || 'Vũng Tàu'}</span>
              {(villa.sourceUrl || villa.mapsUrl) && (
                <a
                  href={villa.sourceUrl || villa.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#38bdf8', fontWeight: 600, fontSize: '11px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  {villa.sourceUrl ? 'Link Booking gốc' : 'Xem Google Maps'} <ExternalLink size={11} />
                </a>
              )}
            </div>

            {/* Price Row: Main Total Price + Small Cost per Person on Right */}
            {!isFoodItem && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '14px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Giá tổng nguyên căn</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>
                    {totalMillion} triệu <span style={{ fontSize: '11px', color: '#a7f3d0' }}>/đêm</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Chia 20 người (2 đêm)</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>
                    ~{Math.round(costPerPerson / 1000)}k <span style={{ fontSize: '10px', color: '#94a3b8' }}>/người</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Voting Action Section */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
              🎯 Bình chọn ý kiến của bạn cho địa điểm này:
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

          {/* Specs Grid (If Villa) */}
          {!isFoodItem && (
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
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Khép kín</div>
              </div>
            </div>
          )}

          {/* Highlights */}
          {villa.highlights && villa.highlights.length > 0 && (
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px 12px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#fbbf24', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={13} /> Điểm Đặc Biệt Nổi Bật:
              </div>
              {villa.highlights.map((hl, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#fef08a', marginTop: '2px' }}>
                  • {hl}
                </div>
              ))}
            </div>
          )}

          {/* Real User Comments Section */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={15} color="#38bdf8" /> Thảo luận của đoàn ({comments.length})
            </h3>

            {comments.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginBottom: '12px' }}>
                Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến!
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
