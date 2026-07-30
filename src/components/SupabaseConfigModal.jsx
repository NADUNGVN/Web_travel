import React, { useState } from 'react';
import { X, Database, CheckCircle2, Info, Key, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { isSupabaseConnected, saveSupabaseConfig, clearSupabaseConfig } from '../lib/supabase';

export const SupabaseConfigModal = ({ onClose }) => {
  const [url, setUrl] = useState(localStorage.getItem('trip_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '');
  const [key, setKey] = useState(localStorage.getItem('trip_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');

  const handleSave = (e) => {
    e.preventDefault();
    if (url.trim() && key.trim()) {
      saveSupabaseConfig(url, key);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database color="#34d399" size={20} />
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'white' }}>
              Cấu Hình Kết Nối Supabase
            </h2>
          </div>
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

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status Alert */}
          <div style={{
            background: isSupabaseConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${isSupabaseConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <CheckCircle2 color={isSupabaseConnected ? '#34d399' : '#fbbf24'} size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: isSupabaseConnected ? '#34d399' : '#fbbf24' }}>
                {isSupabaseConnected ? 'Đã kết nối với Supabase Live DB!' : 'Đang ở chế độ Demo Mode (Giả lập)'}
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px', lineHeight: 1.4 }}>
                {isSupabaseConnected
                  ? 'Ứng dụng đã sẵn sàng xác thực bằng Google OAuth và lưu vote trực tiếp vào database Supabase.'
                  : 'Ứng dụng hiện đang lưu dữ liệu vote tạm thời bằng LocalStorage để trải nghiệm ngay không cần chờ tạo DB.'}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                <LinkIcon size={14} color="#38bdf8" /> Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyz.supabase.co"
                value={url}
                onChange={e => setUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                <Key size={14} color="#fbbf24" /> Supabase Anon Key (Public)
              </label>
              <input
                type="password"
                placeholder="eyJhYmdj..."
                value={key}
                onChange={e => setKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              {isSupabaseConnected && (
                <button type="button" onClick={clearSupabaseConfig} className="btn-secondary" style={{ color: '#f87171' }}>
                  <RefreshCw size={14} /> Chuyển về Demo Mode
                </button>
              )}
              <button type="submit" className="btn-primary">
                Lưu & Kết Nối Supabase
              </button>
            </div>
          </form>

          {/* Guidelines */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={14} /> Hướng dẫn tạo Supabase DB trong 2 phút:
            </h4>
            <ol style={{ fontSize: '11px', color: '#cbd5e1', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: 1.4 }}>
              <li>Tạo dự án miễn phí tại <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>supabase.com</a>.</li>
              <li>Vào <b>Project Settings → API</b> để copy URL và anon key dán vào đây.</li>
              <li>Vào <b>Authentication → Providers → Google</b> để bật Đăng nhập Gmail bằng Google Client ID.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
