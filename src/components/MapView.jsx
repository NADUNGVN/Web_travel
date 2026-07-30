import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Info } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';

export const MapView = ({ villas, userVotes, onVote, onOpenDetail, onToggleCompare, comparedVillas }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedVilla, setSelectedVilla] = useState(null);

  // Filter villas by area
  const filteredVillas = villas.filter((v) => {
    if (selectedArea === 'all') return true;
    if (selectedArea === 'bai_sau') return v.areaName?.includes('Bãi Sau');
    if (selectedArea === 'doi_ngoc_tuoc') return v.areaName?.includes('Đồi Ngọc Tước');
    if (selectedArea === 'resort') return v.areaName?.includes('Resort');
    if (selectedArea === 'tran_phu') return v.areaName?.includes('Trần Phú');
    return true;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [10.35, 107.09],
        zoom: 13,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CARTO'
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Render price markers for filtered villas
    filteredVillas.forEach((v) => {
      if (!v.lat || !v.lng) return;

      const cpp = getCostPerPerson(v.priceTotal, 20, 2);
      const isSelected = selectedVilla?.id === v.id;
      const userVote = userVotes[v.id];

      let badgeColor = '#10b981';
      if (userVote === 'yes') badgeColor = '#34d399';
      if (userVote === 'no') badgeColor = '#f43f5e';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: ${isSelected ? '#6366f1' : 'rgba(15, 23, 42, 0.9)'};
            border: 2px solid ${isSelected ? '#818cf8' : badgeColor};
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 3px;
            transform: scale(${isSelected ? 1.15 : 1});
            transition: transform 0.2s ease;
          ">
            <span>~${Math.round(cpp / 1000)}k</span>
            ${userVote === 'yes' ? '🌟' : ''}
          </div>
        `,
        iconSize: [60, 26],
        iconAnchor: [30, 13]
      });

      const marker = L.marker([v.lat, v.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedVilla(v);
        map.panTo([v.lat, v.lng], { animate: true });
      });

      markersRef.current.push(marker);
    });

  }, [filteredVillas, selectedVilla, userVotes]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 130px)', overflow: 'hidden' }}>
      {/* Translucent Floating Area Pills over Map */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 1000,
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        padding: '4px',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '99px',
        border: '1px solid rgba(255,255,255,0.12)'
      }}>
        <button
          className={`btn-secondary ${selectedArea === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedArea('all')}
          style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '99px', whiteSpace: 'nowrap', background: selectedArea === 'all' ? 'rgba(56, 189, 248, 0.25)' : 'transparent', border: 'none' }}
        >
          Tất cả ({villas.length})
        </button>
        <button
          className={`btn-secondary ${selectedArea === 'bai_sau' ? 'active' : ''}`}
          onClick={() => setSelectedArea('bai_sau')}
          style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '99px', whiteSpace: 'nowrap', background: selectedArea === 'bai_sau' ? 'rgba(56, 189, 248, 0.25)' : 'transparent', border: 'none' }}
        >
          🏖️ Bãi Sau
        </button>
        <button
          className={`btn-secondary ${selectedArea === 'doi_ngoc_tuoc' ? 'active' : ''}`}
          onClick={() => setSelectedArea('doi_ngoc_tuoc')}
          style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '99px', whiteSpace: 'nowrap', background: selectedArea === 'doi_ngoc_tuoc' ? 'rgba(56, 189, 248, 0.25)' : 'transparent', border: 'none' }}
        >
          ⛰️ Đồi Ngọc Tước
        </button>
        <button
          className={`btn-secondary ${selectedArea === 'resort' ? 'active' : ''}`}
          onClick={() => setSelectedArea('resort')}
          style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '99px', whiteSpace: 'nowrap', background: selectedArea === 'resort' ? 'rgba(56, 189, 248, 0.25)' : 'transparent', border: 'none' }}
        >
          🌴 Chí Linh Resort
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Selected Villa Popup Drawer on Map */}
      {selectedVilla && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '12px',
            right: '12px',
            zIndex: 1000,
            padding: '12px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <img
              src={selectedVilla.images[0]}
              alt={selectedVilla.name}
              style={{ width: '75px', height: '75px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', lineHeight: 1.2, marginBottom: '2px' }}>
                  {selectedVilla.name}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {selectedVilla.bedrooms} PN • {selectedVilla.bathrooms} WC • {selectedVilla.capacity} Khách
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#34d399' }}>
                  ~{(getCostPerPerson(selectedVilla.priceTotal, 20, 2) / 1000).toLocaleString()}k <span style={{ fontSize: '10px', color: '#94a3b8' }}>/người</span>
                </div>
                <button
                  onClick={() => onOpenDetail(selectedVilla)}
                  className="btn-primary"
                  style={{ fontSize: '10px', padding: '4px 8px' }}
                >
                  <Info size={12} /> Chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Quick Vote Bar inside Map Popup */}
          <div className="vote-bar" style={{ paddingTop: '4px' }}>
            <button
              className={`btn-vote yes ${userVotes[selectedVilla.id] === 'yes' ? 'active' : ''}`}
              onClick={() => onVote(selectedVilla.id, 'yes')}
              style={{ fontSize: '10px', padding: '5px 2px' }}
            >
              🌟 Ưu tiên
            </button>
            <button
              className={`btn-vote maybe ${userVotes[selectedVilla.id] === 'maybe' ? 'active' : ''}`}
              onClick={() => onVote(selectedVilla.id, 'maybe')}
              style={{ fontSize: '10px', padding: '5px 2px' }}
            >
              🤔 Cân nhắc
            </button>
            <button
              className={`btn-vote no ${userVotes[selectedVilla.id] === 'no' ? 'active' : ''}`}
              onClick={() => onVote(selectedVilla.id, 'no')}
              style={{ fontSize: '10px', padding: '5px 2px' }}
            >
              ❌ Không hợp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
