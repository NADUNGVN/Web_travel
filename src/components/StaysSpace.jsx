import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { VillaCard } from './VillaCard';
import { getCostPerPerson } from '../data/mockVillas';

export const StaysSpace = ({
  villas,
  userVotes,
  onVote,
  comparedVillas,
  onToggleCompare,
  onOpenDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fitFilter, setFitFilter] = useState('all');
  const [maxPricePerson, setMaxPricePerson] = useState('all');
  const [poolOnly, setPoolOnly] = useState(false);
  const [bbqOnly, setBbqOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter logic
  const filteredVillas = villas.filter((v) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchLoc = v.location.toLowerCase().includes(q);
      const matchTag = v.amenities.some(a => a.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchTag) return false;
    }

    if (fitFilter === 'perfect' && v.capacity < 20) return false;
    if (fitFilter === 'extra_bed' && (v.capacity < 18 || v.capacity >= 20)) return false;

    const cpp = getCostPerPerson(v.priceTotal, 20, 2);
    if (maxPricePerson === '350' && cpp > 350000) return false;
    if (maxPricePerson === '450' && cpp > 450000) return false;

    if (poolOnly && !v.amenities.some(a => a.toLowerCase().includes('bể bơi') || a.toLowerCase().includes('hồ bơi'))) {
      return false;
    }

    if (bbqOnly && !v.amenities.some(a => a.toLowerCase().includes('bbq') || a.toLowerCase().includes('nướng'))) {
      return false;
    }

    return true;
  });

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
      {/* Sleek 1-Line Search & Quick Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm villa Vũng Tàu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '14px',
              padding: '9px 12px 9px 34px',
              color: 'white',
              fontSize: '13px'
            }}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: showFilters ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.85)',
            border: `1px solid ${showFilters ? '#38bdf8' : 'rgba(255,255,255,0.12)'}`,
            color: showFilters ? '#38bdf8' : 'white',
            padding: '9px 12px',
            borderRadius: '14px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <SlidersHorizontal size={14} /> Lọc
        </button>
      </div>

      {/* Expandable Minimal Filter Box */}
      {showFilters && (
        <div className="glass-panel" style={{ padding: '12px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              className={`btn-secondary ${fitFilter === 'all' ? 'active' : ''}`}
              onClick={() => setFitFilter('all')}
              style={{ fontSize: '11px', padding: '5px 10px', background: fitFilter === 'all' ? 'rgba(56, 189, 248, 0.2)' : undefined }}
            >
              Tất cả ({villas.length})
            </button>
            <button
              className={`btn-secondary ${fitFilter === 'perfect' ? 'active' : ''}`}
              onClick={() => setFitFilter('perfect')}
              style={{ fontSize: '11px', padding: '5px 10px', color: '#34d399', background: fitFilter === 'perfect' ? 'rgba(16, 185, 129, 0.2)' : undefined }}
            >
              🟢 Rộng rãi (20+ người)
            </button>
            <button
              className="btn-secondary"
              onClick={() => setMaxPricePerson(maxPricePerson === '350' ? 'all' : '350')}
              style={{ fontSize: '11px', padding: '5px 10px', background: maxPricePerson === '350' ? 'rgba(56, 189, 248, 0.2)' : undefined }}
            >
              &lt; 350k/người
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#cbd5e1', cursor: 'pointer' }}>
              <input type="checkbox" checked={poolOnly} onChange={e => setPoolOnly(e.target.checked)} />
              Hồ bơi riêng
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#cbd5e1', cursor: 'pointer' }}>
              <input type="checkbox" checked={bbqOnly} onChange={e => setBbqOnly(e.target.checked)} />
              Sân BBQ
            </label>
          </div>
        </div>
      )}

      {/* Subheader Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8', padding: '0 2px' }}>
        <span>Hiển thị <b>{filteredVillas.length}</b> villa</span>
        <span>🟢 <b>50 căn</b> chứa đủ 20 người</span>
      </div>

      {/* Responsive Villa Grid Container */}
      <div className="villa-grid">
        {filteredVillas.map((villa) => (
          <VillaCard
            key={villa.id}
            villa={villa}
            userVote={userVotes[villa.id]}
            onVote={onVote}
            isCompared={comparedVillas.some(c => c.id === villa.id)}
            onToggleCompare={onToggleCompare}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </div>
  );
};
