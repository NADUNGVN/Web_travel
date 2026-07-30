import React, { useState } from 'react';
import { Trophy, CheckCircle, PieChart, Users, ChevronRight } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

export const ResultsSpace = ({ villas, userVotes, onOpenDetail }) => {
  const hasAnyVotes = Object.keys(userVotes).length > 0;

  // Calculate Net Score for each villa based strictly on real votes
  const calculatedVillas = villas.map((v) => {
    const myVote = userVotes[v.id];
    let yes = (v.votes?.yes || 0) + (myVote === 'yes' ? 1 : 0);
    let maybe = (v.votes?.maybe || 0) + (myVote === 'maybe' ? 1 : 0);
    let no = (v.votes?.no || 0) + (myVote === 'no' ? 1 : 0);

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

  // Filter villas with at least 1 vote & sort by netScore descending
  const votedVillas = calculatedVillas.filter(v => v.totalVotes > 0);
  const sortedVillas = [...votedVillas].sort((a, b) => b.netScore - a.netScore);
  const top3 = sortedVillas.slice(0, 3);

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '4px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '14px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', color: 'white' }}>
            <Trophy color="#fbbf24" size={20} /> Kết Quả Bình Chọn Realtime
          </h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Đếm số phiếu bình chọn thực tế từ các thành viên đoàn 20 người
          </p>
        </div>
      </div>

      {!hasAnyVotes || sortedVillas.length === 0 ? (
        <div className="glass-panel" style={{ padding: '36px 20px', borderRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieChart size={28} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
              Chưa có lượt bình chọn nào
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', maxWidth: '320px', lineHeight: 1.4, margin: '0 auto' }}>
              Chưa có ai trong đoàn thực hiện bình chọn. Bạn hãy sang tab <b>"Ở Đâu"</b> hoặc <b>"Bản Đồ"</b> để bấm <b>🌟 Ưu tiên / 🤔 Cân nhắc</b> cho các villa yêu thích nhé!
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Winner */}
          {top3.length > 0 && (
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🏆 Top Căn Được Yêu Thích Nhất
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {top3.map((v, idx) => (
                  <div
                    key={v.id}
                    className="glass-panel"
                    onClick={() => onOpenDetail(v)}
                    style={{
                      padding: '12px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      border: idx === 0 ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#10b981' : idx === 1 ? '#38bdf8' : '#f59e0b',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      #{idx + 1}
                    </div>

                    <img
                      src={v.images[0]}
                      alt={v.name}
                      style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {v.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                        ~{Math.round(getCostPerPerson(v.priceTotal, 20, 2) / 1000)}k/người • {v.bedrooms} PN
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                        🌟 {v.computedVotes.yes} ưu tiên • 🤔 {v.computedVotes.maybe} cân nhắc
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8' }}>
                        {v.netScore}đ
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                        Điểm ròng
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Live Table */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#cbd5e1', marginBottom: '8px' }}>
              📊 Tất Cả Căn Đã Có Bình Chọn ({sortedVillas.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedVillas.map(v => (
                <div
                  key={v.id}
                  className="glass-panel"
                  onClick={() => onOpenDetail(v)}
                  style={{ padding: '10px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                      🌟 {v.computedVotes.yes} | 🤔 {v.computedVotes.maybe} | ❌ {v.computedVotes.no}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#34d399', marginLeft: '8px' }}>
                    {v.netScore}đ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
