import React, { useState, useMemo } from 'react';
import { 
  Activity, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown, Battery,
  Bell, Calendar, CheckCircle, ChevronDown, ChevronRight, Clock,
  Download, Eye, Filter, Gauge, Grid, List, MapPin, Menu, MoreHorizontal,
  Package, Radio, RefreshCw, Search, Settings, Shield, Signal, Sliders,
  Truck, User, Wifi, Wrench, X, Zap, Camera, FileText, BarChart3,
  ChevronLeft, ChevronsLeft, ChevronsRight, CircleDot
, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';

// ============================================
// MOCK DATA
// ============================================

const equipmentTypes = [
  { code: 'TSD', name: 'Titan Spike Driver', count: 14 },
  { code: 'GSP', name: 'Gorilla Spike Puller', count: 11 },
  { code: 'DSP', name: 'Dragon Spike Puller', count: 8 },
  { code: 'RRL', name: 'Raptor Rail Lifter', count: 9 },
  { code: 'BTN', name: 'BTN Spike Driver', count: 5 }
];

const locations = [
  'BNSF Southwest Division',
  'UP Denver Region',
  'CSX Southeast',
  'NS Chicago Hub',
  'KCS Southern Region'
];

const generateAssets = () => {
  const assets = [];
  const statuses = ['active', 'idle', 'down'];
  const statusWeights = [0.7, 0.2, 0.1]; // 70% active, 20% idle, 10% down
  
  let id = 1;
  equipmentTypes.forEach(type => {
    for (let i = 0; i < type.count; i++) {
      const rand = Math.random();
      let status = 'active';
      if (rand > statusWeights[0] + statusWeights[1]) status = 'down';
      else if (rand > statusWeights[0]) status = 'idle';
      
      const hasLidar = Math.random() > 0.3;
      const hasCamera = Math.random() > 0.2;
      const hasAutoBrake = hasLidar && hasCamera && Math.random() > 0.4;
      
      assets.push({
        id: `${type.code}-${String(1000 + id).slice(1)}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        type: type.name,
        typeCode: type.code,
        status,
        location: locations[Math.floor(Math.random() * locations.length)],
        mileMarker: `Mile ${Math.floor(Math.random() * 200 + 50)}.${Math.floor(Math.random() * 10)}`,
        operator: status === 'active' ? ['J. Martinez', 'R. Thompson', 'M. Johnson', 'K. Williams', 'S. Garcia', 'L. Davis', 'T. Anderson'][Math.floor(Math.random() * 7)] : null,
        utilization: status === 'down' ? 0 : Math.floor(Math.random() * 30 + 65),
        cyclestoday: status === 'down' ? 0 : Math.floor(Math.random() * 800 + 200),
        engineHours: Math.floor(Math.random() * 8000 + 1000),
        fuelLevel: Math.floor(Math.random() * 60 + 30),
        lastUpdate: status === 'active' ? `${Math.floor(Math.random() * 5 + 1)} min ago` : status === 'idle' ? `${Math.floor(Math.random() * 30 + 5)} min ago` : `${Math.floor(Math.random() * 24 + 1)} hr ago`,
        hasLidar,
        hasCamera,
        hasAutoBrake,
        alertCount: status === 'down' ? Math.floor(Math.random() * 3 + 1) : Math.random() > 0.8 ? 1 : 0,
        nextService: `${Math.floor(Math.random() * 30 + 1)} days`
      });
      id++;
    }
  });
  return assets;
};

const allAssets = generateAssets();

// ============================================
// COMPONENTS
// ============================================

const StatusBadge = ({ status, size = 'sm' }) => {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    idle: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    down: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };
  const labels = { active: 'Active', idle: 'Idle', down: 'Down' };
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  return (
    <span className={`rounded font-medium border ${styles[status]} ${sizeClasses}`}>
      {labels[status]}
    </span>
  );
};

const CapabilityBadge = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
    active 
      ? 'bg-slate-700/50 text-slate-300' 
      : 'bg-slate-800/30 text-slate-600'
  }`}>
    <Icon className="w-3 h-3" />
    <span>{label}</span>
  </div>
);

const NavItem = ({ to, icon: Icon, label, active, badge }) => {
  const location = useLocation();
  const isActive = active !== undefined ? active : (to ? location.pathname === to : false);
  const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive 
      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
  }`;
  const content = (
    <>
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400">
          {badge}
        </span>
      )}
    </>
  );
  if (to) {
    return <Link to={to} className={className}>{content}</Link>;
  }
  return <button className={className}>{content}</button>;
};

const FilterPill = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
    {label}
    <button onClick={onRemove} className="hover:text-amber-300">
      <X className="w-3 h-3" />
    </button>
  </span>
);

const SortHeader = ({ label, sortKey, currentSort, onSort }) => {
  const isActive = currentSort.key === sortKey;
  return (
    <button 
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 hover:text-slate-200 transition-colors"
    >
      {label}
      {isActive ? (
        currentSort.dir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-50" />
      )}
    </button>
  );
};

const AssetRow = ({ asset, onView }) => (
  <tr className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors group">
    <td className="py-3 px-4">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${
          asset.status === 'active' ? 'bg-emerald-500 animate-pulse' :
          asset.status === 'idle' ? 'bg-amber-500' : 'bg-rose-500'
        }`} />
        <div>
          <button 
            onClick={() => onView(asset)}
            className="font-medium text-white hover:text-amber-400 transition-colors"
          >
            {asset.id}
          </button>
          <p className="text-xs text-slate-500">{asset.type}</p>
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <StatusBadge status={asset.status} />
    </td>
    <td className="py-3 px-4">
      <div className="text-sm text-slate-300">{asset.location}</div>
      <div className="text-xs text-slate-500">{asset.mileMarker}</div>
    </td>
    <td className="py-3 px-4">
      {asset.operator ? (
        <span className="text-sm text-slate-300">{asset.operator}</span>
      ) : (
        <span className="text-sm text-slate-600">—</span>
      )}
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              asset.utilization >= 75 ? 'bg-emerald-500' :
              asset.utilization >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${asset.utilization}%` }}
          />
        </div>
        <span className="text-sm text-slate-400 w-10">{asset.utilization}%</span>
      </div>
    </td>
    <td className="py-3 px-4">
      <span className="text-sm text-slate-300">{asset.cyclesToday?.toLocaleString() || asset.cyclestoday?.toLocaleString()}</span>
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-1">
        <CapabilityBadge icon={Radio} label="LiDAR" active={asset.hasLidar} />
        <CapabilityBadge icon={Camera} label="Cam" active={asset.hasCamera} />
        {asset.hasAutoBrake && (
          <CapabilityBadge icon={Shield} label="Auto" active={true} />
        )}
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        {asset.alertCount > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-xs">
            <AlertTriangle className="w-3 h-3" />
            {asset.alertCount}
          </span>
        )}
        <span className="text-xs text-slate-500">{asset.lastUpdate}</span>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onView(asset)}
          className="p-1.5 hover:bg-slate-700 rounded transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-slate-400" />
        </button>
        <button className="p-1.5 hover:bg-slate-700 rounded transition-colors" title="Service Request">
          <Wrench className="w-4 h-4 text-slate-400" />
        </button>
        <button className="p-1.5 hover:bg-slate-700 rounded transition-colors" title="More">
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </td>
  </tr>
);

const AssetCard = ({ asset, onView }) => (
  <div 
    className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-amber-500/30 transition-all cursor-pointer"
    onClick={() => onView(asset)}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          asset.status === 'active' ? 'bg-emerald-500 animate-pulse' :
          asset.status === 'idle' ? 'bg-amber-500' : 'bg-rose-500'
        }`} />
        <span className="font-medium text-white">{asset.id}</span>
        {asset.alertCount > 0 && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded text-xs">
            <AlertTriangle className="w-3 h-3" />
          </span>
        )}
      </div>
      <StatusBadge status={asset.status} />
    </div>
    
    <p className="text-sm text-slate-400 mb-2">{asset.type}</p>
    
    <div className="space-y-2 text-xs text-slate-500 mb-3">
      <div className="flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        <span>{asset.location}</span>
      </div>
      {asset.operator && (
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{asset.operator}</span>
        </div>
      )}
    </div>
    
    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Util:</span>
        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              asset.utilization >= 75 ? 'bg-emerald-500' :
              asset.utilization >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${asset.utilization}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">{asset.utilization}%</span>
      </div>
      <div className="flex items-center gap-1">
        {asset.hasLidar && <Radio className="w-3 h-3 text-slate-500" />}
        {asset.hasCamera && <Camera className="w-3 h-3 text-slate-500" />}
        {asset.hasAutoBrake && <Shield className="w-3 h-3 text-amber-500" />}
      </div>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center gap-2">
    <button 
      onClick={() => onPageChange(1)}
      disabled={currentPage === 1}
      className="p-1.5 hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronsLeft className="w-4 h-4 text-slate-400" />
    </button>
    <button 
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="p-1.5 hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronLeft className="w-4 h-4 text-slate-400" />
    </button>
    
    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      let page;
      if (totalPages <= 5) {
        page = i + 1;
      } else if (currentPage <= 3) {
        page = i + 1;
      } else if (currentPage >= totalPages - 2) {
        page = totalPages - 4 + i;
      } else {
        page = currentPage - 2 + i;
      }
      return (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            currentPage === page 
              ? 'bg-amber-500/20 text-amber-400' 
              : 'text-slate-400 hover:bg-slate-700'
          }`}
        >
          {page}
        </button>
      );
    })}
    
    <button 
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="p-1.5 hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </button>
    <button 
      onClick={() => onPageChange(totalPages)}
      disabled={currentPage === totalPages}
      className="p-1.5 hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronsRight className="w-4 h-4 text-slate-400" />
    </button>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function FleetAssetsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    location: [],
    capabilities: []
  });
  const [sort, setSort] = useState({ key: 'id', dir: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  // Navigate to asset detail
  const handleViewAsset = (asset) => {
    navigate(`/asset/${asset.id}`);
  };

  // Filter and sort logic
  const filteredAssets = useMemo(() => {
    let result = [...allAssets];
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.id.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        (a.operator && a.operator.toLowerCase().includes(q))
      );
    }
    
    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(a => filters.status.includes(a.status));
    }
    
    // Type filter
    if (filters.type.length > 0) {
      result = result.filter(a => filters.type.includes(a.typeCode));
    }
    
    // Location filter
    if (filters.location.length > 0) {
      result = result.filter(a => filters.location.includes(a.location));
    }
    
    // Capabilities filter
    if (filters.capabilities.includes('lidar')) {
      result = result.filter(a => a.hasLidar);
    }
    if (filters.capabilities.includes('camera')) {
      result = result.filter(a => a.hasCamera);
    }
    if (filters.capabilities.includes('autobrake')) {
      result = result.filter(a => a.hasAutoBrake);
    }
    
    // Sort
    result.sort((a, b) => {
      let aVal = a[sort.key];
      let bVal = b[sort.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sort.dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [searchQuery, filters, sort]);

  const totalPages = Math.ceil(filteredAssets.length / pageSize);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ status: [], type: [], location: [], capabilities: [] });
    setCurrentPage(1);
  };

  const activeFilterCount = 
    filters.status.length + 
    filters.type.length + 
    filters.location.length + 
    filters.capabilities.length;

  // Stats
  const stats = {
    total: allAssets.length,
    active: allAssets.filter(a => a.status === 'active').length,
    idle: allAssets.filter(a => a.status === 'idle').length,
    down: allAssets.filter(a => a.status === 'down').length,
    withAlerts: allAssets.filter(a => a.alertCount > 0).length
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`} style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}>
      {/* Header */}
      <header className={`h-16 border-b backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-colors ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-slate-900 font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">MOW-Tel</h1>
                <p className="text-xs text-slate-500 -mt-0.5">Customer Portal</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search assets, tickets, alerts..."
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className={`relative p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}`}>
              <Bell className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}`}>
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-200">Demo User</p>
                <p className="text-xs text-slate-500">BNSF Railway</p>
              </div>
              <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} border-r transition-colors ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-200'} h-[calc(100vh-4rem)] fixed left-0 overflow-hidden transition-all duration-300`}>
          <nav className="p-4 space-y-1">
            <NavItem to="/" icon={Activity} label="Rail Ops Overview" />
            <NavItem to="/fleet" icon={Truck} label="Fleet & Assets" active />
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
            <NavItem to="/safety" icon={Shield} label="Safety Center" badge="2" />
            <NavItem to="/service" icon={Wrench} label="Service & Maintenance" badge="7" />
            <NavItem to="/orders" icon={Package} label="Parts & Orders" />
            <NavItem to="/documents" icon={FileText} label="Documents" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Fleet & Assets</h2>
                <p className="text-slate-400 mt-1">Manage and monitor your rail maintenance equipment</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Total Assets</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="text-slate-400 text-sm">Active</p>
                </div>
                <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <p className="text-slate-400 text-sm">Idle</p>
                </div>
                <p className="text-2xl font-bold text-amber-400">{stats.idle}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <p className="text-slate-400 text-sm">Down</p>
                </div>
                <p className="text-2xl font-bold text-rose-400">{stats.down}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <p className="text-slate-400 text-sm">With Alerts</p>
                </div>
                <p className="text-2xl font-bold text-rose-400">{stats.withAlerts}</p>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search by ID, type, location, operator..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Filter Toggle */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    showFilters || activeFilterCount > 0
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-amber-500 text-slate-900 rounded text-xs font-medium">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* View Toggle */}
                <div className="flex items-center bg-slate-700/50 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded ${viewMode === 'table' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Status */}
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Status</p>
                      <div className="space-y-1">
                        {['active', 'idle', 'down'].map(status => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={filters.status.includes(status)}
                              onChange={() => toggleFilter('status', status)}
                              className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/20"
                            />
                            <span className="text-sm text-slate-300 capitalize">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Equipment Type</p>
                      <div className="space-y-1">
                        {equipmentTypes.map(type => (
                          <label key={type.code} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={filters.type.includes(type.code)}
                              onChange={() => toggleFilter('type', type.code)}
                              className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/20"
                            />
                            <span className="text-sm text-slate-300">{type.code}</span>
                            <span className="text-xs text-slate-500">({type.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Location</p>
                      <div className="space-y-1">
                        {locations.map(loc => (
                          <label key={loc} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={filters.location.includes(loc)}
                              onChange={() => toggleFilter('location', loc)}
                              className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/20"
                            />
                            <span className="text-sm text-slate-300 truncate">{loc}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Safety Capabilities</p>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={filters.capabilities.includes('lidar')}
                            onChange={() => toggleFilter('capabilities', 'lidar')}
                            className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/20"
                          />
                          <Radio className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">LiDAR Equipped</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={filters.capabilities.includes('camera')}
                            onChange={() => toggleFilter('capabilities', 'camera')}
                            className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/20"
                          />
                          <Camera className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">Camera Array</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={filters.capabilities.includes('autobrake')}
                            onChange={() => toggleFilter('capabilities', 'autobrake')}
                            className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500/20"
                          />
                          <Shield className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">Auto-Brake</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                      <span className="text-xs text-slate-500">Active filters:</span>
                      {filters.status.map(s => (
                        <FilterPill key={s} label={s} onRemove={() => toggleFilter('status', s)} />
                      ))}
                      {filters.type.map(t => (
                        <FilterPill key={t} label={t} onRemove={() => toggleFilter('type', t)} />
                      ))}
                      {filters.location.map(l => (
                        <FilterPill key={l} label={l.split(' ')[0]} onRemove={() => toggleFilter('location', l)} />
                      ))}
                      {filters.capabilities.map(c => (
                        <FilterPill key={c} label={c} onRemove={() => toggleFilter('capabilities', c)} />
                      ))}
                      <button 
                        onClick={clearFilters}
                        className="text-xs text-slate-400 hover:text-slate-200 ml-2"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
              {viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">
                          <SortHeader label="Asset ID" sortKey="id" currentSort={sort} onSort={handleSort} />
                        </th>
                        <th className="py-3 px-4">
                          <SortHeader label="Status" sortKey="status" currentSort={sort} onSort={handleSort} />
                        </th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Operator</th>
                        <th className="py-3 px-4">
                          <SortHeader label="Utilization" sortKey="utilization" currentSort={sort} onSort={handleSort} />
                        </th>
                        <th className="py-3 px-4">Cycles Today</th>
                        <th className="py-3 px-4">Capabilities</th>
                        <th className="py-3 px-4">Last Update</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAssets.map(asset => (
                        <AssetRow 
                          key={asset.id} 
                          asset={asset} 
                          onView={handleViewAsset}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-3 gap-4">
                  {paginatedAssets.map(asset => (
                    <AssetCard 
                      key={asset.id} 
                      asset={asset}
                      onView={handleViewAsset}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
                <span className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredAssets.length)} of {filteredAssets.length} assets
                </span>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <p>MOW-Tel Customer Portal Demo • Built with mock data for demonstration purposes</p>
              <p>Data refreshed: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
