import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCleanVillaTitle } from './VillaCard';
import { getCostPerPerson } from '../data/mockVillas';
import { ChevronRight, X, Sparkles } from 'lucide-react';

export const MapView = ({ villas, foodPlaces = [], userVotes = {}, onOpenDetail }) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const [activeLayer, setActiveLayer] = useState('stays'); // 'all', 'stays', 'food'
  const [selectedItem, setSelectedItem] = useState(null);

  // Default center
  const defaultCenter = [10.342, 107.088];

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Invalidate Map size on layer change
  useEffect(() => {
    if (leafletMapRef.current) {
      setTimeout(() => {
        leafletMapRef.current.invalidateSize();
      }, 100);
    }
  }, [activeLayer]);

  // Update Markers on Layer / Items change
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const staysItems = villas.map(v => ({ ...v, itemType: 'stay' }));
    const foodItems = foodPlaces.map(f => ({ ...f, itemType: 'food' }));

    let displayedItems = [];
    if (activeLayer === 'stays') displayedItems = staysItems;
    else if (activeLayer === 'food') displayedItems = foodItems;
    else displayedItems = [...staysItems, ...foodItems];

    displayedItems.forEach((item) => {
      const isSelected = selectedItem?.id === item.id;
      const iconEmoji = item.itemType === 'food' ? '🍽️' : '🏡';
      const bgColor = item.itemType === 'food' ? '#f59e0b' : isSelected ? '#10b981' : '#38bdf8';

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: ${bgColor};
            color: white;
            padding: 6px;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.3)' : 'scale(1)'};
            transition: transform 0.2s ease;
          ">
            <span>${iconEmoji}</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedItem(item);
        map.flyTo([item.lat, item.lng], 15, { duration: 0.8 });
      });

      markersRef.current.push(marker);
    });
  }, [villas, foodPlaces, activeLayer, selectedItem]);

  const staysCount = villas.length;
  const foodCount = foodPlaces.length;

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 125px)', gap: '8px', padding: '4px', position: 'relative' }}>
      {/* Layer Filter Bar */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', zIndex: 10, paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveLayer('all')}
          style={{
            background: activeLayer === 'all' ? '#38bdf8' : 'rgba(30, 41, 59, 0.85)',
            color: activeLayer === 'all' ? '#0f172a' : 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          📍 Tất cả ({staysCount + foodCount})
        </button>
        <button
          onClick={() => setActiveLayer('stays')}
          style={{
            background: activeLayer === 'stays' ? '#10b981' : 'rgba(30, 41, 59, 0.85)',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          🏡 Nơi Ở ({staysCount})
        </button>
        {foodCount > 0 && (
          <button
            onClick={() => setActiveLayer('food')}
            style={{
              background: activeLayer === 'food' ? '#f59e0b' : 'rgba(30, 41, 59, 0.85)',
              color: activeLayer === 'food' ? '#0f172a' : 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🍽️ Quán Ăn ({foodCount})
          </button>
        )}
      </div>

      {/* Map Canvas Container */}
      <div
        ref={mapRef}
        style={{
          flex: 1,
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.12)',
          position: 'relative',
          zIndex: 1
        }}
      />

      {/* High Z-Index Floating Preview Card Overlay (Never Overlapped by Map) */}
      {selectedItem && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '12px',
          right: '12px',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid #38bdf8',
          borderRadius: '20px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 14px 40px rgba(0,0,0,0.8)',
          pointerEvents: 'auto'
        }}>
          {/* Close Button */}
          <button
            onClick={() => setSelectedItem(null)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            <X size={15} />
          </button>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* 1. Hình ảnh */}
            <img
              src={selectedItem.images ? selectedItem.images[0] : selectedItem.image}
              alt={selectedItem.name}
              style={{ width: '85px', height: '85px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }}
            />

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: 'white', lineHeight: 1.2, margin: '0 24px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {getCleanVillaTitle(selectedItem.name)}
              </h4>

              {/* 2. Tổng tiền nguyên căn -> Phần chia 1/người nhỏ ở góc cùng hàng */}
              {selectedItem.priceTotal && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#34d399' }}>
                    {(selectedItem.priceTotal / 1000000).toFixed(1)} triệu <span style={{ fontSize: '10px', color: '#a7f3d0' }}>/đêm</span>
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>
                    (~{Math.round(getCostPerPerson(selectedItem.priceTotal, 20, 2) / 1000)}k/người)
                  </div>
                </div>
              )}

              {/* 3. Thông tin Khách - PN - WC */}
              {selectedItem.capacity && (
                <div style={{ fontSize: '10.5px', color: '#cbd5e1', display: 'flex', gap: '4px' }}>
                  <span>🟢 {selectedItem.capacity} Khách</span> •
                  <span>🛏️ {selectedItem.bedrooms} PN</span> •
                  <span>🚿 {selectedItem.bathrooms} WC</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Điểm đặc biệt */}
          {selectedItem.highlights && selectedItem.highlights.length > 0 && (
            <div style={{ fontSize: '10.5px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>
              <Sparkles size={12} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedItem.highlights[0]}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => onOpenDetail(selectedItem)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              color: 'white',
              border: 'none',
              padding: '9px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            Xem chi tiết & Vote <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
