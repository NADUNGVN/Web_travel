import React, { useState } from 'react';
import { Bed, Bath, Users, ChevronRight, Sparkles } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80";

export const getCleanVillaTitle = (name) => {
  if (!name) return '';
  let clean = name
    .replace(/, Vũng Tàu|, Vũng Tàu|Vũng Tàu/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
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
  const totalMillion = (villa.priceTotal / 1000000).toFixed(1);

  // Real Vote Counter (0 fake data)
  const baseVotes = (villa.votes?.yes || 0) + (villa.votes?.maybe || 0) + (villa.votes?.no || 0);
  const totalVotesCount = userVote ? baseVotes + 1 : baseVotes;

  const getVoteLabel = () => {
    if (userVote === 'yes') return <span style={{ color: '#34d399', fontSize: '11px', fontWeight: 700 }}>🌟 Bạn đã chọn Ưu tiên</span>;
    if (userVote === 'maybe') return <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 700 }}>🤔 Bạn đang Cân nhắc</span>;
    if (userVote === 'no') return <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 700 }}>❌ Không hợp</span>;
    return <span style={{ color: '#94a3b8', fontSize: '11px' }}>Chưa vote • Bấm xem & vote</span>;
  };

  return (
    <div
      className="villa-card glass-panel"
      onClick={() => onOpenDetail(villa)}
      style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
    >
      {/* 1. Hình ảnh */}
      <div className="card-image-wrapper">
        <img
          src={imgSrc}
          alt={villa.name}
          className="card-image"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        
        {/* Badge Sức Chứa (Top Left) */}
        <div className="fit-badge perfect" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)' }}>
          🟢 {villa.capacity} Khách
        </div>

        {/* Real Vote Count Badge (Top Right) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: totalVotesCount > 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${totalVotesCount > 0 ? '#34d399' : 'rgba(255, 255, 255, 0.15)'}`,
          color: totalVotesCount > 0 ? 'white' : '#94a3b8',
          padding: '4px 10px',
          borderRadius: '99px',
          fontSize: '11px',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
        }}>
          🗳️ {totalVotesCount} vote
        </div>
      </div>

      {/* Content Section */}
      <div className="card-content" style={{ padding: '12px 14px', gap: '8px' }}>
        {/* Title */}
        <h3 className="card-title" style={{ fontSize: '14px', fontWeight: '700', lineHeight: 1.3 }}>
          {getCleanVillaTitle(villa.name)}
        </h3>

        {/* 2. Tổng tiền nguyên căn -> Phần chia 1/người nhỏ ở góc cùng hàng */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '6px 10px',
          borderRadius: '10px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#34d399' }}>
            {totalMillion} triệu <span style={{ fontSize: '11px', fontWeight: '500', color: '#a7f3d0' }}>/đêm</span>
          </div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>
            (~{Math.round(costPerPerson / 1000)}k/người)
          </div>
        </div>

        {/* 3. Thông tin Khách - Phòng ngủ - WC */}
        <div className="card-specs" style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', justifyContent: 'space-around' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Users size={13} color="#38bdf8" /> {villa.capacity} Khách
          </span>
          •
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Bed size={13} color="#a7f3d0" /> {villa.bedrooms} PN
          </span>
          •
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Bath size={13} color="#a7f3d0" /> {villa.bathrooms} WC
          </span>
        </div>

        {/* 4. Điểm đặc biệt */}
        {villa.highlights && villa.highlights.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '2px' }}>
            {villa.highlights.slice(0, 2).map((hl, idx) => (
              <div key={idx} style={{ fontSize: '11px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} color="#fbbf24" style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hl}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {getVoteLabel()}
          <ChevronRight size={14} color="#94a3b8" />
        </div>
      </div>
    </div>
  );
};
