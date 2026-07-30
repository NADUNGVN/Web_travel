import React, { useState } from 'react';
import { Trophy, CheckCircle, Clock, Users, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

export const ResultsSpace = ({ villas, userVotes, onOpenDetail }) => {
  const [isLocked, setIsLocked] = useState(false);

  // Calculate Net Score for each villa: 2 * yes + 1 * maybe - 2 * no
  const calculatedVillas = villas.map((v) => {
    // If current user voted, adjust seed votes dynamically
    const myVote = userVotes[v.id];
    let yes = v.votes.yes + (myVote === 'yes' ? 1 : 0);
    let maybe = v.votes.maybe + (myVote === 'maybe' ? 1 : 0);
    let no = v.votes.no + (myVote === 'no' ? 1 : 0);

    const netScore = (2 * yes) + (1 * maybe) - (2 * no);
    const totalVotes = yes + maybe + no;
    const approvalRate = totalVotes > 0 ? Math.round(((yes + maybe) / totalVotes) * 100) : 0;

    return {
      ...v,
      computedVotes: { yes, maybe, no },
      netScore,
      totalVotes,
      approvalRate
    };
  });

  // Sort by netScore descending
  const sortedVillas = [...calculatedVillas].sort((a, b) => b.netScore - a.netScore);
  const top3 = sortedVillas.slice(0, 3);

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy color="#fbbf24" size={24} /> Bảng Kết Quả Bình Chọn
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              Cập nhật realtime từ các thành viên đoàn 20 người
            </p>
          </div>

          <button
            onClick={() => setIsLocked(!isLocked)}
            style={{
              background: isLocked ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${isLocked ? '#f43f5e' : 'rgba(255,255,255,0.2)'}`,
              color: isLocked ? '#f87171' : 'white',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isLocked ? <ShieldAlert size={14} /> : <Clock size={14} />}
            {isLocked ? 'Đã khóa phiếu' : 'Đang mở vote'}
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>18 / 20</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Đã hoàn tất vote</div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fbbf24' }}>{top3[0]?.name.split('—')[0]}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Dẫn đầu Vòng 1</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#818cf8' }}>2 ngày</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Thời gian còn lại</div>
          </div>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award color="#fbbf24" size={18} /> Top 3 Lựa Chọn Hàng Đầu Đoàn 20 Người
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {top3.map((v, idx) => {
            const medals = ['🥇', '🥈', '🥉'];
            const costPerPerson = getCostPerPerson(v.priceTotal, 20, 2);
            return (
              <div
                key={v.id}
                onClick={() => onOpenDetail(v)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  border: idx === 0 ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ fontSize: '28px', width: '36px', textAlign: 'center' }}>
                  {medals[idx]}
                </div>
                <img
                  src={v.images[0]}
                  alt={v.name}
                  style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                    {v.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    ~{(costPerPerson / 1000).toLocaleString()}k/người • {v.capacity} khách ({v.bedrooms} PN)
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '11px', fontWeight: 600 }}>
                    <span style={{ color: '#34d399' }}>🌟 {v.computedVotes.yes} Ưu tiên</span>
                    <span style={{ color: '#fbbf24' }}>🤔 {v.computedVotes.maybe} Cân nhắc</span>
                    <span style={{ color: '#f87171' }}>❌ {v.computedVotes.no} Phản đối</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>
                    +{v.netScore}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Tổng điểm</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>
          Tất cả Villa theo Thứ Tự Điểm Số
        </h3>

        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {sortedVillas.map((v, idx) => (
            <div
              key={v.id}
              onClick={() => onOpenDetail(v)}
              style={{
                padding: '14px 16px',
                borderBottom: idx === sortedVillas.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', width: '20px' }}>
                  #{idx + 1}
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>{v.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {(v.priceTotal / 1000000).toFixed(1)} tr/đêm • Đồng thuận {v.approvalRate}%
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#34d399' }}>
                    +{v.netScore} đ
                  </span>
                </div>
                <ChevronRight size={16} color="#64748b" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
