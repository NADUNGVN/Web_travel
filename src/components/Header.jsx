import React from 'react';
import { Compass, User, LogOut } from 'lucide-react';
import { signInWithGoogle, signOutUser } from '../lib/supabase';

export const Header = ({ currentUser, onOpenSupabaseConfig }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* App Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
            padding: '6px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
          }}>
            <Compass color="white" size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: '800', color: 'white', lineHeight: 1.1 }}>
              Đi Đâu Ở Đâu
            </h1>
            <span style={{ fontSize: '10px', color: '#34d399', fontWeight: '700' }}>
              👥 Đoàn 20 người
            </span>
          </div>
        </div>

        {/* User Status / Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid #10b981' }}
              />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#e2e8f0', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name}
              </span>
              <button
                onClick={signOutUser}
                title="Đăng xuất"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={signInWithGoogle}
              style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '20px' }}
            >
              <User size={13} /> Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
