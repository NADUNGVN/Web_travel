import React from 'react';
import { X, Check, MapPin, ExternalLink, Trash2 } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

export const CompareDrawer = ({ comparedVillas, onRemoveCompare, onClose, onVote, userVotes }) => {
  if (!comparedVillas || comparedVillas.length === 0) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Chưa chọn Villa nào để so sánh</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
          Hãy chọn tối đa 3 Villa từ trang "Ở Đâu" để đặt lên bàn cân so sánh chi tiết.
        </p>
        <button onClick={onClose} className="btn-primary" style={{ margin: '0 auto' }}>
          Xem danh sách Villa ngay
        </button>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        {/* Header */}
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
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>
            Bảng Ma Trận So Sánh ({comparedVillas.length}/3 Villa)
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

        {/* Matrix Table */}
        <div style={{ padding: '16px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', width: '120px', color: '#94a3b8', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  Tiêu chí
                </th>
                {comparedVillas.map((villa) => (
                  <th key={villa.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', width: `${80 / comparedVillas.length}%` }}>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => onRemoveCompare(villa.id)}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: 'rgba(244, 63, 94, 0.2)',
                          border: '1px solid #f43f5e',
                          color: '#f87171',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                      <img
                        src={villa.images[0]}
                        alt={villa.name}
                        style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '12px', marginBottom: '8px' }}
                      />
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'white', lineHeight: 1.2 }}>
                        {villa.name}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row: Price / person */}
              <tr>
                <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
                  Giá / 20 người
                </td>
                {comparedVillas.map((v) => (
                  <td key={v.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#34d399' }}>
                      ~{(getCostPerPerson(v.priceTotal, 20, 2) / 1000).toLocaleString()}k
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>/người (2 đêm)</div>
                  </td>
                ))}
              </tr>

              {/* Row: Total Price */}
              <tr>
                <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
                  Giá căn / đêm
                </td>
                {comparedVillas.map((v) => (
                  <td key={v.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', fontWeight: '700' }}>
                    {(v.priceTotal / 1000000).toFixed(1)} triệu
                  </td>
                ))}
              </tr>

              {/* Row: Capacity */}
              <tr>
                <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
                  Sức chứa khách
                </td>
                {comparedVillas.map((v) => (
                  <td key={v.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: v.capacity >= 20 ? '#34d399' : '#fbbf24',
                      background: v.capacity >= 20 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      padding: '4px 8px',
                      borderRadius: '8px'
                    }}>
                      {v.capacity} người
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Bedrooms & Baths */}
              <tr>
                <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
                  Phòng ngủ / WC
                </td>
                {comparedVillas.map((v) => (
                  <td key={v.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', fontWeight: '600' }}>
                    {v.bedrooms} PN • {v.bathrooms} WC
                  </td>
                ))}
              </tr>

              {/* Row: Swimming Pool */}
              <tr>
                <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
                  Bể bơi riêng
                </td>
                {comparedVillas.map((v) => {
                  const hasPool = v.amenities.some(a => a.toLowerCase().includes('bể bơi') || a.toLowerCase().includes('hồ bơi'));
                  return (
                    <td key={v.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {hasPool ? <span style={{ color: '#34d399', fontWeight: 700 }}>Có ✓</span> : <span style={{ color: '#64748b' }}>Không</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row: BBQ Grill */}
              <tr>
                <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
                  Sân BBQ
                </td>
                {comparedVillas.map((v) => {
                  const hasBBQ = v.amenities.some(a => a.toLowerCase().includes('bbq') || a.toLowerCase().includes('nướng'));
                  return (
                    <td key={v.id} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {hasBBQ ? <span style={{ color: '#34d399', fontWeight: 700 }}>Có ✓</span> : <span style={{ color: '#64748b' }}>Không</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Votes & Action */}
              <tr>
                <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                  Vote của bạn
                </td>
                {comparedVillas.map((v) => (
                  <td key={v.id} style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        className={`btn-vote yes ${userVotes[v.id] === 'yes' ? 'active' : ''}`}
                        onClick={() => onVote(v.id, 'yes')}
                        style={{ fontSize: '10px', padding: '6px 2px' }}
                      >
                        🌟 Ưu tiên
                      </button>
                      <button
                        className={`btn-vote maybe ${userVotes[v.id] === 'maybe' ? 'active' : ''}`}
                        onClick={() => onVote(v.id, 'maybe')}
                        style={{ fontSize: '10px', padding: '6px 2px' }}
                      >
                        🤔 Cân nhắc
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
