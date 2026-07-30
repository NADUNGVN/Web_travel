import React from 'react';
import { Home, UtensilsCrossed, Scale, PieChart, Map } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab, compareCount }) => {
  return (
    <nav className="bottom-nav glass-nav">
      <div className="bottom-nav-inner" style={{ maxWidth: '680px' }}>
        <button
          className={`nav-tab ${activeTab === 'stays' ? 'active' : ''}`}
          onClick={() => setActiveTab('stays')}
        >
          <Home size={19} />
          <span>Ở Đâu</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <Map size={19} />
          <span>Bản Đồ</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          <UtensilsCrossed size={19} />
          <span>Ăn Gì</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          <Scale size={19} />
          <span>So Sánh</span>
          {compareCount > 0 && (
            <span className="nav-tab-badge">{compareCount}</span>
          )}
        </button>

        <button
          className={`nav-tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <PieChart size={19} />
          <span>Kết Quả</span>
        </button>
      </div>
    </nav>
  );
};
