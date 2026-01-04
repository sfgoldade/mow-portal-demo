import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck, Navigation, MapPin, Activity, Clock, Gauge, User, Fuel, ChevronRight } from 'lucide-react';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons with pulse animation for active
const createCustomIcon = (status, isHovered) => {
  const colors = {
    active: '#10b981',
    idle: '#f59e0b', 
    down: '#ef4444'
  };
  
  const size = isHovered ? 40 : 32;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background: ${colors[status]}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 ${isHovered ? '20px' : '0'} ${colors[status]}50;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.2s ease;
        cursor: pointer;
      ">
        <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>
        ${status === 'active' ? `
          <div style="
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: ${colors[status]};
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            opacity: 0.4;
          "></div>
        ` : ''}
      </div>
      <style>
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Asset data
const assetLocations = [
  { id: 'TSD-1247', lat: 35.199, lng: -101.845, status: 'active', type: 'Titan Spike Driver', location: 'Amarillo, TX', region: 'BNSF Southwest', operator: 'J. Martinez', utilization: 87, fuel: 72, cycles: 847, lastUpdate: '2 min ago' },
  { id: 'GSP-0892', lat: 39.739, lng: -104.990, status: 'active', type: 'Gorilla Spike Puller', location: 'Denver, CO', region: 'UP Denver', operator: 'R. Thompson', utilization: 92, fuel: 81, cycles: 1203, lastUpdate: '1 min ago' },
  { id: 'RRL-0156', lat: 33.749, lng: -84.388, status: 'idle', type: 'Raptor Rail Lifter', location: 'Atlanta, GA', region: 'CSX Southeast', operator: 'M. Johnson', utilization: 0, fuel: 65, cycles: 0, lastUpdate: '15 min ago' },
  { id: 'DSP-0421', lat: 41.878, lng: -87.630, status: 'active', type: 'Dragon Spike Puller', location: 'Chicago, IL', region: 'NS Chicago Hub', operator: 'K. Williams', utilization: 78, fuel: 45, cycles: 534, lastUpdate: '3 min ago' },
  { id: 'TSD-1198', lat: 29.760, lng: -95.370, status: 'active', type: 'Titan Spike Driver', location: 'Houston, TX', region: 'UP Gulf', operator: 'S. Garcia', utilization: 81, fuel: 58, cycles: 623, lastUpdate: '5 min ago' },
  { id: 'BTN-0234', lat: 33.448, lng: -112.074, status: 'down', type: 'BTN Spike Driver', location: 'Phoenix, AZ', region: 'BNSF Southwest', operator: null, utilization: 0, fuel: 34, cycles: 0, lastUpdate: '2 hrs ago' },
  { id: 'GSP-0445', lat: 35.227, lng: -80.843, status: 'active', type: 'Gorilla Spike Puller', location: 'Charlotte, NC', region: 'NS Piedmont', operator: 'L. Davis', utilization: 85, fuel: 68, cycles: 756, lastUpdate: '4 min ago' },
  { id: 'RRL-0089', lat: 44.977, lng: -93.265, status: 'idle', type: 'Raptor Rail Lifter', location: 'Minneapolis, MN', region: 'BNSF Northern', operator: 'T. Anderson', utilization: 0, fuel: 77, cycles: 0, lastUpdate: '22 min ago' },
  { id: 'DSP-0567', lat: 39.099, lng: -94.578, status: 'active', type: 'Dragon Spike Puller', location: 'Kansas City, MO', region: 'UP Central', operator: 'B. Miller', utilization: 73, fuel: 88, cycles: 421, lastUpdate: '6 min ago' },
  { id: 'TSD-1302', lat: 34.052, lng: -118.243, status: 'active', type: 'Titan Spike Driver', location: 'Los Angeles, CA', region: 'BNSF Transcon', operator: 'C. Wilson', utilization: 89, fuel: 54, cycles: 912, lastUpdate: '1 min ago' },
];

// Railroad routes
const railroadRoutes = [
  [[34.052, -118.243], [33.448, -112.074], [35.199, -101.845], [39.099, -94.578], [41.878, -87.630]],
  [[29.760, -95.370], [35.199, -101.845], [33.448, -112.074], [34.052, -118.243]],
  [[41.878, -87.630], [33.749, -84.388], [35.227, -80.843]],
  [[41.878, -87.630], [44.977, -93.265]],
  [[39.099, -94.578], [39.739, -104.990]],
];

const FleetMap = ({ isDark, onAssetClick }) => {
  const [hoveredAsset, setHoveredAsset] = useState(null);
  
  const activeCount = assetLocations.filter(a => a.status === 'active').length;
  const idleCount = assetLocations.filter(a => a.status === 'idle').length;
  const downCount = assetLocations.filter(a => a.status === 'down').length;

  const statusColors = {
    active: isDark ? 'text-emerald-400' : 'text-emerald-600',
    idle: isDark ? 'text-amber-400' : 'text-amber-600',
    down: isDark ? 'text-rose-400' : 'text-rose-600',
  };

  const statusBg = {
    active: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100',
    idle: isDark ? 'bg-amber-500/20' : 'bg-amber-100',
    down: isDark ? 'bg-rose-500/20' : 'bg-rose-100',
  };

  return (
    <div className={`rounded-xl overflow-hidden border relative ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200 shadow-sm'}`} style={{ zIndex: 0 }}>
      {/* Header */}
      <div className={`p-3 lg:p-4 border-b relative z-10 ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Navigation className={`w-4 h-4 lg:w-5 lg:h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
            <h3 className={`font-semibold text-sm lg:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Fleet Tracking</h3>
            <span className="flex items-center gap-1 px-1.5 lg:px-2 py-0.5 bg-emerald-500/20 text-emerald-500 rounded-full text-[10px] lg:text-xs font-medium">
              <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="flex items-center gap-2 lg:gap-4 text-[10px] lg:text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-emerald-500"></span>
              <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>Active ({activeCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-amber-500"></span>
              <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>Idle ({idleCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-rose-500"></span>
              <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>Down ({downCount})</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="h-56 sm:h-64 lg:h-80 relative" style={{ zIndex: 1 }}>
        <MapContainer
          center={[39.5, -98.35]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          {isDark ? (
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          )}
          
          {/* Railroad routes */}
          {railroadRoutes.map((route, idx) => (
            <Polyline
              key={idx}
              positions={route}
              pathOptions={{
                color: isDark ? '#475569' : '#94a3b8',
                weight: 2,
                opacity: 0.5,
                dashArray: '8, 8'
              }}
            />
          ))}
          
          {/* Asset markers */}
          {assetLocations.map(asset => (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              icon={createCustomIcon(asset.status, hoveredAsset === asset.id)}
              eventHandlers={{
                click: () => onAssetClick && onAssetClick(asset.id),
                mouseover: () => setHoveredAsset(asset.id),
                mouseout: () => setHoveredAsset(null)
              }}
            >
              <Popup>
                <div className="min-w-[220px] p-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-slate-900">{asset.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      asset.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      asset.status === 'idle' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {asset.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Type */}
                  <p className="text-sm text-slate-600 mb-3">{asset.type}</p>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-slate-900">{asset.utilization}%</div>
                      <div className="text-[10px] text-slate-500 uppercase">Utilization</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <div className={`text-lg font-bold ${asset.fuel < 40 ? 'text-amber-600' : 'text-slate-900'}`}>{asset.fuel}%</div>
                      <div className="text-[10px] text-slate-500 uppercase">Fuel</div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{asset.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-slate-400" />
                      <span>{asset.region}</span>
                    </div>
                    {asset.operator && (
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{asset.operator}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Updated {asset.lastUpdate}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => onAssetClick && onAssetClick(asset.id)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Hover Tooltip */}
        {hoveredAsset && (
          <div className={`absolute bottom-3 left-3 px-3 py-2 rounded-lg shadow-lg pointer-events-none z-20 ${
            isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
          }`}>
            {(() => {
              const asset = assetLocations.find(a => a.id === hoveredAsset);
              if (!asset) return null;
              return (
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusBg[asset.status]}`}>
                    <Truck className={`w-4 h-4 ${statusColors[asset.status]}`} />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{asset.id}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{asset.location}</div>
                  </div>
                  <div className={`text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div className={`text-sm font-bold ${statusColors[asset.status]}`}>{asset.status}</div>
                    {asset.status === 'active' && (
                      <div className="text-xs">{asset.utilization}% util</div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetMap;
