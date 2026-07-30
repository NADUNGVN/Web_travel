import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Info, Utensils, Home, Navigation, ExternalLink } from 'lucide-react';
import { getCostPerPerson } from '../data/mockVillas';
import { mockFoodPlaces } from '../data/mockFood';

// Calculate exact distance in meters between two lat/lng points
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export const MapView = ({ villas, userVotes, onVote, onOpenDetail }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [activeLayer, setActiveLayer] = useState('all'); // 'all' | 'stays' | 'food'
  const [selectedItem, setSelectedItem] = useState(null); // villa or food object
  const [selectedType, setSelectedType] = useState(null); // 'villa' | 'food'

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [10.348, 107.085],
        zoom: 13,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CARTO'
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // 1. Render Villa Pins (Green / Indigo)
    if (activeLayer === 'all' || activeLayer === 'stays') {
      villas.forEach((v) => {
        if (!v.lat || !v.lng) return;

        const cpp = getCostPerPerson(v.priceTotal, 20, 2);
        const isSelected = selectedType === 'villa' && selectedItem?.id === v.id;
        const userVote = userVotes[v.id];

        let borderColor = '#10b981';
        if (userVote === 'yes') borderColor = '#34d399';
        if (userVote === 'no') borderColor = '#f43f5e';

        const customIcon = L.divIcon({
          className: 'custom-map-pin-villa',
          html: `
            <div style="
              background: ${isSelected ? '#6366f1' : 'rgba(15, 23, 42, 0.92)'};
              border: 2px solid ${isSelected ? '#818cf8' : borderColor};
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
              <span>🏡 ~${Math.round(cpp / 1000)}k</span>
            </div>
          `,
          iconSize: [65, 26],
          iconAnchor: [32, 13]
        });

        const marker = L.marker([v.lat, v.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedItem(v);
          setSelectedType('villa');
          map.panTo([v.lat, v.lng], { animate: true });
        });
        markersRef.current.push(marker);
      });
    }

    // 2. Render Food Pins (Amber / Gold)
    if (activeLayer === 'all' || activeLayer === 'food') {
      mockFoodPlaces.forEach((f) => {
        if (!f.lat || !f.lng) return;

        const isSelected = selectedType === 'food' && selectedItem?.id === f.id;

        const customIcon = L.divIcon({
          className: 'custom-map-pin-food',
          html: `
            <div style="
              background: ${isSelected ? '#d97706' : 'rgba(30, 41, 59, 0.95)'};
              border: 2px solid ${isSelected ? '#fbbf24' : '#f59e0b'};
              color: #fbbf24;
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
              <span>🍽️ ${f.name.split('—')[0].substring(0, 14)}</span>
            </div>
          `,
          iconSize: [110, 26],
          iconAnchor: [55, 13]
        });

        const marker = L.marker([f.lat, f.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedItem(f);
          setSelectedType('food');
          map.panTo([f.lat, f.lng], { animate: true });
        });
        markersRef.current.push(marker);
      });
    }

  }, [activeLayer, selectedItem, selectedType, userVotes, villas]);

  // Calculate nearby food places for selected Villa
  const getNearbyFoodPlaces = (villa) => {
    if (!villa || !villa.lat || !villa.lng) return [];
    return mockFoodPlaces
      .map(food => {
        const dist = getDistanceInMeters(villa.lat, villa.lng, food.lat, food.lng);
        return { ...food, distanceMeters: dist };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .slice(0, 3);
  };

  const nearbyFood = selectedType === 'villa' ? getNearbyFoodPlaces(selectedItem) : [];

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 130px)', overflow: 'hidden' }}>
      {/* Floating Layer Control Pills over Map */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 1000,
        display: 'flex',
        gap: '6px',
        padding: '4px',
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        borderRadius: '99px',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        <button
          onClick={() => { setActiveLayer('all'); setSelectedItem(null); }}
          style={{
            flex: 1,
            fontSize: '11px',
            fontWeight: 700,
            padding: '6px 4px',
            borderRadius: '99px',
            background: activeLayer === 'all' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
            border: activeLayer === 'all' ? '1px solid #38bdf8' : 'none',
            color: activeLayer === 'all' ? '#38bdf8' : '#94a3b8',
            cursor: 'pointer'
          }}
        >
          📍 Tất cả ({villas.length + mockFoodPlaces.length})
        </button>

        <button
          onClick={() => { setActiveLayer('stays'); setSelectedItem(null); }}
          style={{
            flex: 1,
            fontSize: '11px',
            fontWeight: 700,
            padding: '6px 4px',
            borderRadius: '99px',
            background: activeLayer === 'stays' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            border: activeLayer === 'stays' ? '1px solid #10b981' : 'none',
            color: activeLayer === 'stays' ? '#34d399' : '#94a3b8',
            cursor: 'pointer'
          }}
        >
          🏡 Nơi Ở ({villas.length})
        </button>

        <button
          onClick={() => { setActiveLayer('food'); setSelectedItem(null); }}
          style={{
            flex: 1,
            fontSize: '11px',
            fontWeight: 700,
            padding: '6px 4px',
            borderRadius: '99px',
            background: activeLayer === 'food' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
            border: activeLayer === 'food' ? '1px solid #f59e0b' : 'none',
            color: activeLayer === 'food' ? '#fbbf24' : '#94a3b8',
            cursor: 'pointer'
          }}
        >
          🍽️ Đi Ăn ({mockFoodPlaces.length})
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Selected Item Drawer on Map */}
      {selectedItem && (
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
            gap: '10px'
          }}
        >
          {/* Main Selected Info */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <img
              src={selectedItem.images ? selectedItem.images[0] : selectedItem.image}
              alt={selectedItem.name}
              style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', lineHeight: 1.2, marginBottom: '2px' }}>
                  {selectedType === 'villa' ? '🏡 ' : '🍽️ '}{selectedItem.name}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {selectedType === 'villa'
                    ? `${selectedItem.bedrooms} PN • ${selectedItem.bathrooms} WC • ${selectedItem.capacity} Khách`
                    : `${selectedItem.specialty}`}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: selectedType === 'villa' ? '#34d399' : '#fbbf24' }}>
                  {selectedType === 'villa'
                    ? `~${Math.round(getCostPerPerson(selectedItem.priceTotal, 20, 2) / 1000)}k /người`
                    : `~${selectedItem.priceAvg}`}
                </div>
                {selectedType === 'villa' && (
                  <button
                    onClick={() => onOpenDetail(selectedItem)}
                    className="btn-primary"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    Chi tiết & Vote
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Feature: Nearby Food Places around this Villa! */}
          {selectedType === 'villa' && nearbyFood.length > 0 && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '8px 10px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#fbbf24', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Utensils size={12} /> Các quán ăn gần căn này nhất:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {nearbyFood.map(food => (
                  <div
                    key={food.id}
                    onClick={() => { setSelectedItem(food); setSelectedType('food'); mapRef.current.panTo([food.lat, food.lng]); }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '11px',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '3px 6px',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.2)'
                    }}
                  >
                    <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      🍽️ {food.name}
                    </span>
                    <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '10px' }}>
                      📍 cách {food.distanceMeters < 1000 ? `${food.distanceMeters}m` : `${(food.distanceMeters / 1000).toFixed(1)}km`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
