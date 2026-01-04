import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck, Navigation, MapPin, Activity, Wifi, Battery, Clock } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (status) => {
  const colors = {
    active: '#10b981',
    idle: '#f59e0b', 
    down: '#ef4444'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px; 
        height: 32px; 
        background: ${colors[status]}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
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
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Asset locations with real US coordinates
const assetLocations = [
  { id: 'TSD-1247', lat: 35.199, lng: -101.845, status: 'active', type: 'Titan Spike Driver', location: 'Amarillo, TX', region: 'BNSF Southwest', operator: 'J. Martinez', utilization: 87, lastUpdate: '2 min ago' },
  { id: 'GSP-0892', lat: 39.739, lng: -104.990, status: 'active', type: 'Gorilla Spike Puller', location: 'Denver, CO', region: 'UP Denver', operator: 'R. Thompson', utilization: 92, lastUpdate: '1 min ago' },
  { id: 'RRL-0156', lat: 33.749, lng: -84.388, status: 'idle', type: 'Raptor Rail Lifter', location: 'Atlanta, GA', region: 'CSX Southeast', operator: 'M. Johnson', utilization: 0, lastUpdate: '15 min ago' },
  { id: 'DSP-0421', lat: 41.878, lng: -87.630, status: 'active', type: 'Dragon Spike Puller', location: 'Chicago, IL', region: 'NS Chicago Hub', operator: 'K. Williams', utilization: 78, lastUpdate: '3 min ago' },
  { id: 'TSD-1198', lat: 29.760, lng: -95.370, status: 'active', type: 'Titan Spike Driver', location: 'Houston, TX', region: 'UP Gulf', operator: 'S. Garcia', utilization: 81, lastUpdate: '5 min ago' },
  { id: 'BTN-0234', lat: 33.448, lng: -112.074, status: 'down', type: 'BTN Spike Driver', location: 'Phoenix, AZ', region: 'BNSF Southwest', operator: null, utilization: 0, lastUpdate: '2 hrs ago' },
  { id: 'GSP-0445', lat: 35.227, lng: -80.843, status: 'active', type: 'Gorilla Spike Puller', location: 'Charlotte, NC', region: 'NS Piedmont', operator: 'L. Davis', utilization: 85, lastUpdate: '4 min ago' },
  { id: 'RRL-0089', lat: 44.977, lng: -93.265, status: 'idle', type: 'Raptor Rail Lifter', location: 'Minneapolis, MN', region: 'BNSF Northern', operator: 'T. Anderson', utilization: 0, lastUpdate: '22 min ago' },
  { id: 'DSP-0567', lat: 39.099, lng: -94.578, status: 'active', type: 'Dragon Spike Puller', location: 'Kansas City, MO', region: 'UP Central', operator: 'B. Miller', utilization: 73, lastUpdate: '6 min ago' },
  { id: 'TSD-1302', lat: 34.052, lng: -118.243, status: 'active', type: 'Titan Spike Driver', location: 'Los Angeles, CA', region: 'BNSF Transcon', operator: 'C. Wilson', utilization: 89, lastUpdate: '1 min ago' },
];

// Railroad routes (simplified major routes)
const railroadRoutes = [
  // BNSF Transcon (LA to Chicago)
  [[34.052, -118.243], [33.448, -112.074], [35.199, -101.845], [39.099, -94.578], [41.878, -87.630]],
  // UP Southern (Houston to LA)
  [[29.760, -95.370], [35.199, -101.845], [33.448, -112.074], [34.052, -118.243]],
  // NS Eastern (Chicago to Atlanta to Charlotte)
  [[41.878, -87.630], [33.749, -84.388], [35.227, -80.843]],
  // BNSF Northern (Chicago to Minneapolis)
  [[41.878, -87.630], [44.977, -93.265]],
  // UP Central (Kansas City to Denver)
  [[39.099, -94.578], [39.739, -104.990]],
];

const FleetMap = ({ isDark, onAssetClick }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  const activeCount = assetLocations.filter(a => a.status === 'active').length;
  const idleCount = assetLocations.filter(a => a.status === 'idle').length;
  const downCount = assetLocations.filter(a => a.status === 'down').length;

  return (
    <div className={`rounded-xl overflow-hidden border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className={`w-5 h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Fleet Tracking</h3>
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>Active ({activeCount})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>Idle ({idleCount})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>Down ({downCount})</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="h-80">
        <MapContainer
          center={[39.5, -98.35]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          {/* Dark or light map tiles */}
          {isDark ? (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          
          {/* Railroad routes */}
          {railroadRoutes.map((route, idx) => (
            <Polyline
              key={idx}
              positions={route}
              pathOptions={{
                color: isDark ? '#475569' : '#9ca3af',
                weight: 2,
                opacity: 0.6,
                dashArray: '10, 10'
              }}
            />
          ))}
          
          {/* Asset markers */}
          {assetLocations.map(asset => (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              icon={createCustomIcon(asset.status)}
              eventHandlers={{
                click: () => {
                  setSelectedAsset(asset);
                  if (onAssetClick) onAssetClick(asset.id);
                }
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{asset.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      asset.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      asset.status === 'idle' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                  <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{asset.type}</p>
                  <div className={`text-xs space-y-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {asset.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {asset.region}
                    </div>
                    {asset.operator && (
                      <div className="flex items-center gap-1">
                        <span>👤</span>
                        {asset.operator}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {asset.lastUpdate}
                    </div>
                  </div>
                  {asset.status === 'active' && (
                    <div className="mt-2 pt-2 border-t border-slate-600">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>Utilization</span>
                        <span className="text-emerald-400 font-medium">{asset.utilization}%</span>
                      </div>
                      <div className={`h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div 
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${asset.utilization}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <button 
                    className="w-full mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-medium rounded transition-colors"
                    onClick={() => onAssetClick && onAssetClick(asset.id)}
                  >
                    View Asset Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default FleetMap;
