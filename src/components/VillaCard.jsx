import React, { useState } from 'react';
import { MapPin, Users, Bed, Bath, Star, ExternalLink, CheckSquare, Square, Info } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80";

export const VillaCard = ({
  villa,
  userVote,
  onVote,
  isCompared,
  onToggleCompare,
  onOpenDetail
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState(villa.images[0] || FALLBACK_IMAGE);
  const costPerPerson = getCostPerPerson(villa.priceTotal, 20, 2);

  const getFitBadge = () => {
    if (villa.capacity >= 20) {
      return <div className="fit-badge perfect">🟢 {villa.capacity} Khách (Rộng rãi 20 người)</div>;
    } else if (villa.capacity >= 18) {
      return <div className="fit-badge extra_bed">🟡 {villa.capacity} Khách (Kê nệm thêm)</div>;
    }
    return <div className="fit-badge tight">🔴 {villa.capacity} Khách (Thiếu chỗ)</div>;
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const nextIdx = (currentImageIndex + 1) % villa.images.length;
    setCurrentImageIndex(nextIdx);
    setImgSrc(villa.images[nextIdx] || FALLBACK_IMAGE);
  };

  return (
    <div className="villa-card glass-panel">
      {/* Image Container */}
      <div className="card-image-wrapper" onClick={() => onOpenDetail(villa)}>
        <img
          src={imgSrc}
          alt={villa.name}
          className="card-image"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        
        {/* Fit Badge */}
        {getFitBadge()}

        {/* Price Badge */}
        <div className="price-tag">
          <div className="price-main">
            ~{(costPerPerson / 1000).toLocaleString()}k <span style={{ fontSize: '11px', fontWeight: 500 }}>/người</span>
          </div>
          <div className="price-sub">
            {(villa.priceTotal / 1000000).toFixed(1)} triệu / căn / đêm
          </div>
        </div>

        {/* Dots Indicator */}
        {villa.images.length > 1 && (
          <div
            onClick={nextImage}
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              display: 'flex',
              gap: '4px',
              background: 'rgba(0,0,0,0.5)',
              padding: '4px 8px',
              borderRadius: '99px',
              cursor: 'pointer'
            }}
          >
            {villa.images.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: idx === currentImageIndex ? '#38bdf8' : 'rgba(255,255,255,0.4)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h3 className="card-title" onClick={() => onOpenDetail(villa)} style={{ cursor: 'pointer' }}>
            {villa.name}
          </h3>

          {/* Compare Checkbox */}
          <button
            onClick={() => onToggleCompare(villa)}
            style={{
              background: isCompared ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isCompared ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
              color: isCompared ? '#818cf8' : '#94a3b8',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {isCompared ? <CheckSquare size={14} /> : <Square size={14} />} So sánh
          </button>
        </div>

        {/* Location & Maps */}
        <div className="card-location">
          <MapPin size={14} color="#38bdf8" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {villa.location}
          </span>
          {villa.mapsUrl && (
            <a
              href={villa.mapsUrl}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 600 }}
            >
              Bản đồ <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Specs Bar */}
        <div className="card-specs">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bed size={14} color="#a7f3d0" /> {villa.bedrooms} PN
          </span>
          •
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bath size={14} color="#a7f3d0" /> {villa.bathrooms} WC
          </span>
          •
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} color="#fbbf24" /> {villa.rating} ({villa.reviewCount})
          </span>
        </div>

        {/* Amenities Tags */}
        <div className="card-tags">
          {villa.amenities.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="tag-item">{tag}</span>
          ))}
        </div>

        {/* Detail Trigger & Voting Bar */}
        <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
              Bình chọn của bạn:
            </span>
            <button
              onClick={() => onOpenDetail(villa)}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <Info size={12} /> Chi tiết
            </button>
          </div>

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
  );
};
