import React, { useState } from 'react';
import { Search, Utensils, MapPin, ExternalLink } from 'lucide-react';
import { mockFoodPlaces } from '../data/mockFood';

export const FoodSpace = ({ userVotes, onVote }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'seafood', label: '🦐 Hải Sản' },
    { id: 'hotpot', label: '🍲 Lẩu Cá Đuối' },
    { id: 'bbq', label: '🥩 Lẩu Nướng / BBQ' },
    { id: 'breakfast', label: '🥢 Bánh Khọt / Ăn Sáng' }
  ];

  const filteredPlaces = mockFoodPlaces.filter(place => {
    if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return place.name.toLowerCase().includes(q) || place.specialty.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
      {/* Search & Category Pills */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm quán hải sản, lẩu cá đuối Vũng Tàu..."
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
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`btn-secondary ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              fontSize: '11px',
              padding: '6px 12px',
              borderRadius: '99px',
              whiteSpace: 'nowrap',
              background: selectedCategory === cat.id ? 'rgba(245, 158, 11, 0.25)' : undefined,
              borderColor: selectedCategory === cat.id ? '#f59e0b' : undefined,
              color: selectedCategory === cat.id ? '#fbbf24' : undefined
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Food Places List */}
      <div className="villa-grid">
        {filteredPlaces.map(place => (
          <div key={place.id} className="villa-card glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <img
                src={place.image}
                alt={place.name}
                style={{ width: '85px', height: '85px', borderRadius: '12px', objectFit: 'cover' }}
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399' }}>
                    ~{place.priceAvg}
                  </span>
                  <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '10px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    <MapPin size={11} /> Bản đồ <ExternalLink size={10} />
                  </a>
                </div>
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
    </div>
  );
};
