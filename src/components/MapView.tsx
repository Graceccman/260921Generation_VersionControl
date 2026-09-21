import React, { useEffect, useRef, useState } from 'react';
import { KWAI_HING_COORDINATES } from '../config/kwaiHingConfig';
import type { Restaurant } from '../types/restaurant';
import { Navigation, Star, Footprints, CloudRain, X, Compass } from 'lucide-react';

export interface MapViewProps {
  restaurants: Restaurant[];
  isGoogleLive?: boolean;
  apiKey?: string;
  selectedRestaurant?: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  restaurants,
  isGoogleLive = false,
  apiKey,
  selectedRestaurant,
  onSelectRestaurant,
}) => {
  const googleMapRef = useRef<HTMLDivElement>(null);
  const [selectedPin, setSelectedPin] = useState<Restaurant | null>(
    selectedRestaurant || null
  );

  const hasLiveMap = isGoogleLive || Boolean(apiKey);

  useEffect(() => {
    if (selectedRestaurant) {
      setSelectedPin(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  // Google Maps Live integration
  useEffect(() => {
    if (!hasLiveMap || !window.google?.maps || !googleMapRef.current) return;

    try {
      const map = new window.google.maps.Map(googleMapRef.current, {
        center: { lat: KWAI_HING_COORDINATES.lat, lng: KWAI_HING_COORDINATES.lng },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Central MTR Marker
      new window.google.maps.Marker({
        position: { lat: KWAI_HING_COORDINATES.lat, lng: KWAI_HING_COORDINATES.lng },
        map,
        title: '葵興港鐵站 (Kwai Hing MTR)',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#ea580c',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      });

      // Markers for restaurants
      restaurants.forEach((restaurant) => {
        const lat = restaurant.coordinates?.lat ?? restaurant.lat ?? KWAI_HING_COORDINATES.lat;
        const lng = restaurant.coordinates?.lng ?? restaurant.lng ?? KWAI_HING_COORDINATES.lng;

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: restaurant.name,
        });

        marker.addListener('click', () => {
          setSelectedPin(restaurant);
        });
      });
    } catch (e) {
      console.error('Failed to init live Google Map', e);
    }
  }, [hasLiveMap, restaurants]);

  // Coordinate projection for fallback interactive SVG map
  const minLat = 22.3580;
  const maxLat = 22.3680;
  const minLng = 114.1280;
  const maxLng = 114.1375;

  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 600;
    return { x, y };
  };

  const mtrPos = projectToMap(KWAI_HING_COORDINATES.lat, KWAI_HING_COORDINATES.lng);
  const kccPos = projectToMap(22.3626, 114.1332);
  const skhPos = projectToMap(22.3635, 114.1310);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative w-full h-[580px] sm:h-[640px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-xl">
        {hasLiveMap && window.google?.maps ? (
          <div ref={googleMapRef} className="w-full h-full" />
        ) : (
          <div className="w-full h-full relative overflow-hidden bg-radial from-slate-800 to-slate-950 select-none">
            {/* Map Header / Legend */}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700/80 text-white shadow-lg">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold">葵興美食探索地圖 (互動示意)</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 港鐵站中心
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> 天橋直達
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 街頭步行
                </span>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="w-full h-full flex items-center justify-center">
              <svg
                viewBox="0 0 800 600"
                className="w-full h-full transition-transform duration-200"
              >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                {/* Kwai Chung Road */}
                <line x1="100" y1="550" x2="700" y2="150" stroke="#1e293b" strokeWidth="34" strokeLinecap="round" />
                <line x1="100" y1="550" x2="700" y2="150" stroke="#334155" strokeWidth="26" strokeLinecap="round" />
                <text x="350" y="380" fill="#64748b" fontSize="11" fontWeight="bold" transform="rotate(-33, 350, 380)">
                  葵涌道 Kwai Chung Rd
                </text>

                {/* Tai Lin Pai Road */}
                <line x1="480" y1="580" x2="620" y2="100" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
                <text x="590" y="240" fill="#64748b" fontSize="10" transform="rotate(-75, 590, 240)">
                  大連排道 Tai Lin Pai Rd
                </text>

                {/* Hing Fong Road */}
                <line x1="280" y1="580" x2="330" y2="40" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
                <text x="290" y="320" fill="#64748b" fontSize="10" transform="rotate(-85, 290, 320)">
                  興芳路 Hing Fong Rd
                </text>

                {/* Castle Peak Road */}
                <line x1="120" y1="120" x2="720" y2="140" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
                <text x="240" y="112" fill="#64748b" fontSize="10">
                  青山公路葵涌段 Castle Peak Rd
                </text>

                {/* Sheltered Pedestrian Bridge from MTR to KCC */}
                <path
                  d={`M ${mtrPos.x} ${mtrPos.y} Q 400 320 ${kccPos.x} ${kccPos.y}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeDasharray="4 2"
                  filter="url(#glow)"
                />
                <text x="395" y="330" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  🌧️ 冷氣天橋直達 KCC
                </text>

                {/* Bridge to Sun Kwai Hing */}
                <line
                  x1={mtrPos.x}
                  y1={mtrPos.y}
                  x2={skhPos.x}
                  y2={skhPos.y}
                  stroke="#38bdf8"
                  strokeWidth="5"
                />

                {/* MTR Station Landmark Pin */}
                <g transform={`translate(${mtrPos.x}, ${mtrPos.y})`}>
                  <circle r="22" fill="#f97316" fillOpacity="0.2" className="animate-ping" />
                  <circle r="14" fill="#ea580c" stroke="#ffffff" strokeWidth="3" />
                  <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="black" textAnchor="middle">
                    M
                  </text>
                  <rect x="-65" y="18" width="130" height="22" rx="6" fill="#0f172a" fillOpacity="0.9" />
                  <text x="0" y="33" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    葵興港鐵站 (中心)
                  </text>
                </g>

                {/* Subzone labels */}
                <text x="180" y="240" fill="#94a3b8" fontSize="12" fontWeight="bold">
                  📍 光輝圍 / 葵興邨
                </text>
                <text x="500" y="290" fill="#94a3b8" fontSize="12" fontWeight="bold">
                  📍 KCC 九龍貿易中心
                </text>
                <text x="600" y="460" fill="#94a3b8" fontSize="12" fontWeight="bold">
                  📍 KC100 / 大連排工廈區
                </text>

                {/* Restaurant Markers */}
                {restaurants.map((restaurant) => {
                  const lat = restaurant.coordinates?.lat ?? restaurant.lat ?? KWAI_HING_COORDINATES.lat;
                  const lng = restaurant.coordinates?.lng ?? restaurant.lng ?? KWAI_HING_COORDINATES.lng;
                  const pos = projectToMap(lat, lng);
                  const isSelected = selectedPin?.id === restaurant.id;
                  const isFootbridge = restaurant.isSheltered ?? restaurant.isFootbridgeConnected ?? false;
                  const pinColor = isFootbridge ? '#3b82f6' : '#f59e0b';

                  return (
                    <g
                      key={restaurant.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setSelectedPin(restaurant)}
                    >
                      <circle
                        r={isSelected ? '12' : '7'}
                        fill={pinColor}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all"
                      />
                      {isSelected && (
                        <circle r="18" fill={pinColor} fillOpacity="0.3" className="animate-ping" />
                      )}
                      <text
                        x="0"
                        y="-10"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {restaurant.name.slice(0, 4)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Selected Restaurant Drawer / Popup on Map */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4">
            <button
              onClick={() => setSelectedPin(null)}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3 items-center">
              <img
                src={
                  selectedPin.imageUrl ||
                  selectedPin.photo ||
                  (selectedPin.photos && selectedPin.photos[0]) ||
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
                }
                alt={selectedPin.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700">
                    {selectedPin.zoneName || selectedPin.zoneLabel || selectedPin.zone}
                  </span>
                  {(selectedPin.isSheltered || selectedPin.isFootbridgeConnected) && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 flex items-center gap-0.5">
                      <CloudRain className="w-2.5 h-2.5" />
                      天橋直達
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 truncate mt-0.5">
                  {selectedPin.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <span className="flex items-center gap-0.5 font-bold text-slate-800">
                    <Footprints className="w-3.5 h-3.5 text-orange-600" />
                    步行 {selectedPin.walkingMinutes ?? selectedPin.walkingMinutesFromMTR ?? 3} 分鐘
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {selectedPin.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => onSelectRestaurant(selectedPin)}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer text-center"
              >
                查看詳細資料
              </button>
              <a
                href={
                  selectedPin.googleMapsUrl ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedPin.name + ' 葵興'
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>導航</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
