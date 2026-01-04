import React, { useState, useMemo } from 'react';
import { 
  Search, X, Truck, MapPin, User, Clock, Gauge, Battery, 
  AlertTriangle, CheckCircle, Wifi, Camera, Radio, ChevronRight,
  Activity, Zap, Wrench
} from 'lucide-react';

// All fleet assets for lookup
const allAssets = [
  { id: 'TSD-1247', type: 'Titan Spike Driver', status: 'active', location: 'Amarillo, TX', region: 'BNSF Southwest', operator: 'J. Martinez', utilization: 87, cycles: 847, fuelLevel: 72, hasLidar: true, hasCamera: true, alerts: 1 },
  { id: 'TSD-1198', type: 'Titan Spike Driver', status: 'active', location: 'Houston, TX', region: 'UP Gulf', operator: 'S. Garcia', utilization: 81, cycles: 623, fuelLevel: 65, hasLidar: true, hasCamera: true, alerts: 0 },
  { id: 'TSD-1302', type: 'Titan Spike Driver', status: 'active', location: 'Los Angeles, CA', region: 'BNSF Transcon', operator: 'C. Wilson', utilization: 89, cycles: 912, fuelLevel: 54, hasLidar: true, hasCamera: true, alerts: 0 },
  { id: 'GSP-0892', type: 'Gorilla Spike Puller', status: 'active', location: 'Denver, CO', region: 'UP Denver', operator: 'R. Thompson', utilization: 92, cycles: 1203, fuelLevel: 81, hasLidar: true, hasCamera: true, alerts: 1 },
  { id: 'GSP-0445', type: 'Gorilla Spike Puller', status: 'active', location: 'Charlotte, NC', region: 'NS Piedmont', operator: 'L. Davis', utilization: 85, cycles: 756, fuelLevel: 68, hasLidar: false, hasCamera: true, alerts: 0 },
  { id: 'DSP-0421', type: 'Dragon Spike Puller', status: 'active', location: 'Chicago, IL', region: 'NS Chicago Hub', operator: 'K. Williams', utilization: 78, cycles: 534, fuelLevel: 45, hasLidar: true, hasCamera: true, alerts: 1 },
  { id: 'DSP-0567', type: 'Dragon Spike Puller', status: 'active', location: 'Kansas City, MO', region: 'UP Central', operator: 'B. Miller', utilization: 73, cycles: 421, fuelLevel: 88, hasLidar: true, hasCamera: false, alerts: 0 },
  { id: 'RRL-0156', type: 'Raptor Rail Lifter', status: 'idle', location: 'Atlanta, GA', region: 'CSX Southeast', operator: 'M. Johnson', utilization: 0, cycles: 0, fuelLevel: 92, hasLidar: true, hasCamera: true, alerts: 0 },
  { id: 'RRL-0089', type: 'Raptor Rail Lifter', status: 'idle', location: 'Minneapolis, MN', region: 'BNSF Northern', operator: 'T. Anderson', utilization: 0, cycles: 0, fuelLevel: 77, hasLidar: false, hasCamera: true, alerts: 0 },
  { id: 'BTN-0234', type: 'BTN Spike Driver', status: 'down', location: 'Phoenix, AZ', region: 'BNSF Southwest', operator: null, utilization: 0, cycles: 0, fuelLevel: 34, hasLidar: true, hasCamera: true, alerts: 2 },
];

const AssetLookup = ({ isOpen, onClose, onSelectAsset, isDark }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredAssets = useMemo(() => {
    return allAssets.filter(asset => {
      const matchesSearch = !searchQuery || 
        asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.operator && asset.operator.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
      const matchesType = filterType === 'all' || asset.type.includes(filterType);
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, filterStatus, filterType]);

  if (!isOpen) return null;

  const statusColors = {
    active: isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
    idle: isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700',
    down: isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700',
  };

  const statusDot = {
    active: 'bg-emerald-500',
    idle: 'bg-amber-500',
    down: 'bg-rose-500',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-20 px-2 sm:px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className={`relative w-full max-w-3xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
      }`}>
        {/* Header */}
        <div className={`p-3 sm:p-4 border-b flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-amber-500/10' : 'bg-amber-100'}`}>
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </div>
              <div>
                <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Asset Lookup</h2>
                <p className={`text-xs sm:text-sm hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Search individual machines</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search by ID, type, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDark 
                  ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 overflow-x-auto pb-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex-shrink-0 ${
                isDark 
                  ? 'bg-slate-700 border border-slate-600 text-white' 
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="down">Down</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex-shrink-0 ${
                isDark 
                  ? 'bg-slate-700 border border-slate-600 text-white' 
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <option value="all">All Types</option>
              <option value="Titan">Titan</option>
              <option value="Gorilla">Gorilla</option>
              <option value="Dragon">Dragon</option>
              <option value="Raptor">Raptor</option>
              <option value="BTN">BTN</option>
            </select>
            <span className={`text-xs sm:text-sm flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {filteredAssets.length} found
            </span>
          </div>
        </div>
        
        {/* Asset List */}
        <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          {filteredAssets.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <Truck className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No machines found</p>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-100'}`}>
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset.id)}
                  className={`p-3 sm:p-4 cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-slate-700/50 active:bg-slate-700' : 'hover:bg-slate-50 active:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Status Icon */}
                    <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDark ? 'bg-slate-700' : 'bg-slate-100'
                    }`}>
                      <Truck className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        asset.status === 'active' ? 'text-emerald-500' : 
                        asset.status === 'idle' ? 'text-amber-500' : 'text-rose-500'
                      }`} />
                      <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 ${
                        isDark ? 'border-slate-800' : 'border-white'
                      } ${statusDot[asset.status]}`}></span>
                    </div>
                    
                    {/* Asset Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                        <span className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{asset.id}</span>
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold ${statusColors[asset.status]}`}>
                          {asset.status}
                        </span>
                        {asset.alerts > 0 && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700'}`}>
                            {asset.alerts}!
                          </span>
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{asset.type}</p>
                      <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {asset.location} • {asset.region}
                      </p>
                    </div>
                    
                    {/* Stats - Hidden on very small screens */}
                    <div className="hidden sm:flex items-center gap-3 sm:gap-4 flex-shrink-0">
                      {asset.status === 'active' && (
                        <div className="text-center">
                          <div className={`text-sm sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{asset.utilization}%</div>
                          <div className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Util</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className={`text-sm sm:text-lg font-bold ${asset.fuelLevel < 40 ? 'text-amber-500' : isDark ? 'text-white' : 'text-slate-900'}`}>{asset.fuelLevel}%</div>
                        <div className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Fuel</div>
                      </div>
                    </div>
                    
                    <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className={`p-3 sm:p-4 border-t flex-shrink-0 ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs sm:text-sm hidden sm:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Press <kbd className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>ESC</kbd> to close
            </p>
            <button 
              onClick={onClose}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium ${
                isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetLookup;
