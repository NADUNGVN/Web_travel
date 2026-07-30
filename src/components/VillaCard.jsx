import React, { useState } from 'react';
import { Bed, Bath, Star, ChevronRight } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80";

// Shorten villa title for clean mobile card view
export const getCleanVillaTitle = (name) => {
  if (!name) return '';
  let clean = name
    .replace(/, Vũng Tàu|, Vũng Tàu|Vũng Tàu/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Truncate long descriptions
  if (clean.length > 42) {
    clean = clean.substring(0, 40) + '...';
  }
  return clean;
};

export const VillaCard = ({
  villa,
  userVote,
  onOpenDetail
}) => {
  const [imgSrc, setImgSrc] = useState(villa.images[0] || FALLBACK_IMAGE);
  const costPerPerson = getCostPerPerson(villa.priceTotal, 20, 2);

  const getFitBadge = () => {
    if (villa.capacity >= 20) {
      return <div className="fit-badge perfect">🟢 {villa.capacity} Khách</div>;
    } else if (villa.capacity >= 18) {
      return <div className="fit-badge extra_bed">🟡 {villa.capacity} Khách</div>;
    }
    return <div className="fit-badge tight">🔴 {villa.capacity} Khách</div>;
  };

  const getVoteLabel = () => {
    if (userVote === 'yes') return <span style={{ color: '#34d399', fontSize: '11px', fontWeight: 700 }}>🌟 Bạn đã chọn Ưu tiên</span>;
    if (userVote === 'maybe') return <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 700 }}>🤔 Bạn đang Cân nhắc</span>;
    if (userVote === 'no') return <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 700 }}>❌ Không hợp</span>;
    return <span style={{ color: '#94a3b8', fontSize: '11px' }}>Bấm để xem chi tiết & vote</span>;
  };

  return (
    <div
      className="villa-card glass-panel"
      onClick={() => onOpenDetail(villa)}
      style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
    >
      {/* Image Container */}
      <div className="card-image-wrapper">
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
            ~{(costPerPerson / 1000).toLocaleString()}k <span style={{ fontSize: '10px', fontWeight: 500 }}>/người</span>
          </div>
        </div>
      </div>

      {/* Tinh gọn thông tin thẻ */}
      <div className="card-content" style={{ padding: '12px 14px', gap: '6px' }}>
        <h3 className="card-title" style={{ fontSize: '14px', fontWeight: '700', lineHeight: 1.3 }}>
          {getCleanVillaTitle(villa.name)}
        </h3>

        {/* Specs Bar */}
        <div className="card-specs" style={{ padding: '4px 8px', fontSize: '11px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Bed size={13} color="#a7f3d0" /> {villa.bedrooms} PN
          </span>
          •
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Bath size={13} color="#a7f3d0" /> {villa.bathrooms} WC
          </span>
          •
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={13} color="#fbbf24" /> {villa.rating}
          </span>
        </div>

        {/* Bottom Vote Status Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {getVoteLabel()}
          <ChevronRight size={14} color="#94a3b8" />
        </div>
      </div>
    </div>
  );
};
