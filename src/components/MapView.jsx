import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCleanVillaTitle } from './VillaCard';

export const MapView = ({ villas, foodPlaces = [], userVotes = {}, onOpenDetail }) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const [activeLayer, setActiveLayer] = useState('stays'); // 'all', 'stays', 'food'
  const [selectedItem, setSelectedItem] = useState(null);

  // Vũng Tàu default center
  const defaultCenter = [10.346, 107.084];

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CartoDB'
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

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
      const baseVotes = (item.votes?.yes || 0) + (item.votes?.maybe || 0) + (item.votes?.no || 0);
      const userVote = userVotes[item.id];
      const realVoteCount = userVote ? baseVotes + 1 : baseVotes;

      const iconEmoji = item.itemType === 'food' ? '🍽️' : '🏡';
      const bgColor = item.itemType === 'food' ? '#f59e0b' : isSelected ? '#10b981' : '#38bdf8';

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: ${bgColor};
            color: white;
            padding: 5px 8px;
            border-radius: 99px;
            font-size: 13px;
            font-weight: 800;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            border: 2px solid white;
            display: flex;
            align-items: center;
            gap: 3px;
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: transform 0.2s ease;
          ">
            <span>${iconEmoji}</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      // Popup Content Card
      const cleanTitle = getCleanVillaTitle(item.name);
      const imgSrc = item.images ? item.images[0] : item.image;

      const popupHtml = document.createElement('div');
      popupHtml.style.width = '200px';
      popupHtml.style.padding = '4px';
      popupHtml.style.display = 'flex';
      popupHtml.style.flexDirection = 'column';
      popupHtml.style.gap = '8px';

      popupHtml.innerHTML = `
        <div style="position: relative; height: 110px; border-radius: 12px; overflow: hidden;">
          <img src="${imgSrc}" alt="${cleanTitle}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="
            position: absolute;
            top: 6px;
            right: 6px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(6px);
            color: #38bdf8;
            padding: 3px 8px;
            border-radius: 99px;
            font-size: 10px;
            font-weight: 800;
          ">
            🗳️ ${realVoteCount} vote
          </div>
        </div>
        <div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.3; margin-bottom: 2px;">
            ${cleanTitle}
          </div>
          <div style="font-size: 11px; color: #64748b;">
            📍 ${item.location}
          </div>
        </div>
      `;

      const btn = document.createElement('button');
      btn.style.width = '100%';
      btn.style.background = '#0f172a';
      btn.style.color = 'white';
      btn.style.border = 'none';
      btn.style.padding = '8px';
      btn.style.borderRadius = '10px';
      btn.style.fontSize = '11px';
      btn.style.fontWeight = '700';
      btn.style.cursor = 'pointer';
      btn.innerText = 'Xem chi tiết & Vote ›';
      btn.onclick = () => onOpenDetail(item);

      popupHtml.appendChild(btn);

      marker.bindPopup(popupHtml, { closeButton: false });
      marker.on('click', () => setSelectedItem(item));

      markersRef.current.push(marker);
    });
  }, [villas, foodPlaces, activeLayer, userVotes, selectedItem]);

  const staysCount = villas.length;
  const foodCount = foodPlaces.length;

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 125px)', gap: '8px', padding: '4px' }}>
      {/* Sleek Layer Filter Bar */}
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

      {/* Pure Leaflet Map Container */}
      <div
        ref={mapRef}
        style={{
          flex: 1,
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.12)',
          position: 'relative'
        }}
      />
    </div>
  );
};
