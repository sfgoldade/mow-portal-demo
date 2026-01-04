import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, CheckCircle, ChevronRight, Clock, 
  Gauge, MapPin, Settings, Truck, Wrench, TrendingUp, TrendingDown,
  Bell, Search, User, Menu, BarChart3, FileText, Package, Shield,
  Calendar, Zap, Timer, Target, ArrowUpRight, ArrowDownRight,
  ChevronDown, MoreHorizontal, Eye, Play, X, Sun, Moon, Video,
  AlertCircle, Tool, Cpu, Navigation
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import FleetMap from '../components/FleetMap';
import AssetLookup from '../components/AssetLookup';

// Mock data
const mockFleetData = {
  totalAssets: 47, activeAssets: 38, idleAssets: 6, downAssets: 3,
  utilizationRate: 81, utilizationTrend: 4.2, totalWorkHours: 1847,
  workHoursTrend: 12.3, cyclesCompleted: 42650, cyclesTrend: 8.7,
  milesTracked: 2341, milesTrend: 5.1
};

const recentAlerts = [
  { id: 1, severity: 'critical', asset: 'TSD-1247', message: 'Hydraulic pressure below threshold', time: '12 min ago' },
  { id: 2, severity: 'critical', asset: 'GSP-0892', message: 'Workhead cycle count exceeded', time: '34 min ago' },
  { id: 3, severity: 'warning', asset: 'RRL-0156', message: 'GPS signal intermittent', time: '1 hr ago' },
  { id: 4, severity: 'warning', asset: 'DSP-0421', message: 'Battery voltage trending low', time: '2 hr ago' },
];

const recentActivity = [
  { id: 1, asset: 'TSD-1247', action: 'Started work session', location: 'BNSF Mile 142.3', time: '8:42 AM' },
  { id: 2, asset: 'GSP-0892', action: 'Completed 450 cycles', location: 'UP Denver Yard', time: '8:38 AM' },
  { id: 3, asset: 'RRL-0156', action: 'Moved to new worksite', location: 'CSX Atlanta', time: '8:21 AM' },
  { id: 4, asset: 'DSP-0421', action: 'Maintenance completed', location: 'NS Chicago Hub', time: '8:15 AM' },
];

const predictiveMaintenance = [
  { id: 1, asset: 'TSD-1247', component: 'Hydraulic Pump', health: 34, daysToFailure: 5, risk: 'high', issue: 'Pressure degradation', savings: '$12,400' },
  { id: 2, asset: 'GSP-0892', component: 'Workhead Assembly', health: 45, daysToFailure: 12, risk: 'high', issue: 'Cycle count limit', savings: '$8,200' },
  { id: 3, asset: 'DSP-0421', component: 'Battery Pack', health: 58, daysToFailure: 21, risk: 'medium', issue: 'Voltage drop', savings: '$3,100' },
];

const videoIncidents = [
  { id: 'EVT-2847', asset: 'TSD-1247', type: 'Near Miss', time: '2 hrs ago', severity: 'critical', description: 'Worker proximity alert', duration: '0:34', reviewed: false },
  { id: 'EVT-2845', asset: 'GSP-0892', type: 'Hard Stop', time: '4 hrs ago', severity: 'warning', description: 'Emergency brake activation', duration: '0:22', reviewed: false },
];

// Components
const Sparkline = ({ data, color, height = 24 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 60},${height - ((d - min) / range) * height}`).join(' ');
  return (
    <svg width="60" height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatCard = ({ icon: Icon, label, value, unit, trend, trendDirection, sparkData, isDark }) => (
  <div className={`rounded-xl p-4 lg:p-5 transition-all duration-200 ${
    isDark 
      ? 'bg-slate-800 border border-slate-700 hover:border-amber-500/50' 
      : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500'
  }`}>
    <div className="flex items-start justify-between mb-2 lg:mb-3">
      <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/10' : 'bg-amber-500/10'}`}>
        <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500" />
      </div>
      <span className="hidden sm:block">{sparkData && <Sparkline data={sparkData} color="#f59e0b" />}</span>
    </div>
    <p className={`text-xs lg:text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</p>
    <div className="flex items-baseline gap-1 lg:gap-2">
      <span className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
      {unit && <span className={`text-xs lg:text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{unit}</span>}
    </div>
    {trend !== undefined && (
      <div className={`flex items-center gap-1 text-xs mt-1 lg:mt-2 font-medium ${trendDirection === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trendDirection === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        <span className="hidden sm:inline">{trend}% vs last week</span>
        <span className="sm:hidden">{trend}%</span>
      </div>
    )}
  </div>
);

const AlertBadge = ({ severity, isDark }) => {
  const styles = {
    critical: isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700',
    warning: isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700',
    info: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
  };
  return <span className={`px-1.5 lg:px-2 py-0.5 rounded text-xs font-semibold ${styles[severity]}`}>{severity}</span>;
};

const NavItem = ({ to, icon: Icon, label, active, badge, isDark, onClick }) => {
  const location = useLocation();
  const isActive = active !== undefined ? active : (to ? location.pathname === to : false);
  const className = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
    isActive 
      ? isDark 
        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
        : 'bg-amber-500 text-white shadow-md'
      : isDark 
        ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
  }`;
  
  const content = (
    <>
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500 text-white'
        }`}>{badge}</span>
      )}
    </>
  );
  
  if (onClick) {
    return <button onClick={onClick} className={className}>{content}</button>;
  }
  return <Link to={to} className={className}>{content}</Link>;
};

const Card = ({ children, className = '', isDark }) => (
  <div className={`rounded-xl p-4 lg:p-5 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'} ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, icon: Icon, iconColor, action, isDark }) => (
  <div className="flex items-center justify-between mb-3 lg:mb-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${iconColor}`} />}
      <h3 className={`font-semibold text-sm lg:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    </div>
    {action}
  </div>
);

const PredictiveMaintenanceCard = ({ items, isDark, onItemClick }) => {
  const totalSavings = items.reduce((sum, item) => sum + parseInt(item.savings.replace(/[$,]/g, '')), 0);
  
  return (
    <Card isDark={isDark}>
      <CardHeader 
        title="AI Predictive Maintenance" 
        icon={Cpu} 
        iconColor="text-purple-500"
        isDark={isDark}
        action={
          <div className="flex items-center gap-2 lg:gap-3">
            <span className={`text-xs font-medium hidden sm:inline ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Save ${totalSavings.toLocaleString()}
            </span>
            <Link to="/service" className="text-amber-500 hover:text-amber-600 text-xs lg:text-sm font-medium flex items-center gap-1">
              <span className="hidden sm:inline">View All</span> <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        }
      />
      <div className="space-y-2 lg:space-y-3">
        {items.map(item => (
          <div 
            key={item.id}
            onClick={() => onItemClick(item.asset)}
            className={`p-3 lg:p-4 rounded-lg cursor-pointer transition-all ${
              isDark 
                ? 'bg-slate-900/50 hover:bg-slate-900 border border-slate-700/50 hover:border-slate-600' 
                : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm lg:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.asset}</span>
                <span className={`px-1.5 lg:px-2 py-0.5 rounded text-xs font-bold ${
                  item.risk === 'high' 
                    ? isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700'
                    : item.risk === 'medium'
                    ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                    : isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}>{item.risk}</span>
              </div>
              <div className="text-right">
                <div className={`text-xs font-bold ${
                  item.daysToFailure <= 7 ? 'text-rose-500' : item.daysToFailure <= 21 ? 'text-amber-500' : isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>{item.daysToFailure}d</div>
                <div className="text-xs text-emerald-500 font-medium hidden sm:block">{item.savings}</div>
              </div>
            </div>
            <p className={`text-xs lg:text-sm mb-2 lg:mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span className="font-semibold">{item.component}:</span> {item.issue}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className={`h-1.5 lg:h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div 
                    className={`h-full rounded-full ${
                      item.health < 50 ? 'bg-rose-500' : item.health < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.health}%` }}
                  />
                </div>
              </div>
              <span className={`text-xs font-bold w-8 ${
                item.health < 50 ? 'text-rose-500' : item.health < 70 ? 'text-amber-500' : 'text-emerald-500'
              }`}>{item.health}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const VideoIncidentsCard = ({ incidents, isDark, onIncidentClick }) => (
  <Card isDark={isDark}>
    <CardHeader 
      title="Safety Video Review" 
      icon={Video} 
      iconColor="text-rose-500"
      isDark={isDark}
      action={
        <div className="flex items-center gap-2 lg:gap-3">
          <span className={`px-1.5 lg:px-2 py-0.5 rounded text-xs font-bold ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700'}`}>
            {incidents.filter(i => !i.reviewed).length} new
          </span>
          <Link to="/safety" className="text-amber-500 hover:text-amber-600 text-xs lg:text-sm font-medium flex items-center gap-1">
            <span className="hidden sm:inline">Review</span> <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      }
    />
    <div className="space-y-2 lg:space-y-3">
      {incidents.map(incident => (
        <div 
          key={incident.id}
          onClick={() => onIncidentClick(incident.id)}
          className={`flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg cursor-pointer transition-all ${
            isDark 
              ? 'bg-slate-900/50 hover:bg-slate-900 border border-slate-700/50 hover:border-slate-600' 
              : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
          } ${!incident.reviewed ? (isDark ? 'ring-2 ring-rose-500/30' : 'ring-2 ring-rose-200') : ''}`}
        >
          <div className={`relative w-16 h-12 lg:w-24 lg:h-16 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${
            isDark ? 'bg-slate-700' : 'bg-slate-300'
          }`}>
            <Play className="w-6 h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
            <span className="absolute bottom-1 right-1 text-[10px] px-1 lg:px-1.5 py-0.5 rounded bg-black/70 text-white font-medium">{incident.duration}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 lg:gap-2 mb-1">
              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{incident.type}</span>
              <AlertBadge severity={incident.severity} isDark={isDark} />
            </div>
            <p className={`text-xs lg:text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{incident.description}</p>
            <div className={`flex items-center gap-2 lg:gap-3 mt-1 lg:mt-2 text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              <span className="flex items-center gap-1"><Truck className="w-3 h-3" />{incident.asset}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{incident.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Mobile Bottom Nav
const MobileBottomNav = ({ isDark }) => {
  const location = useLocation();
  const navItems = [
    { to: '/', icon: Activity, label: 'Overview' },
    { to: '/fleet', icon: Truck, label: 'Fleet' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/safety', icon: Shield, label: 'Safety' },
    { to: '/service', icon: Wrench, label: 'Service' },
  ];
  
  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-around py-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
                isActive 
                  ? 'text-amber-500' 
                  : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default function MOWPortalDemo() {
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assetLookupOpen, setAssetLookupOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  // Keyboard shortcut for asset lookup (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setAssetLookupOpen(true);
      }
      if (e.key === 'Escape') {
        setAssetLookupOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAssetSelect = (assetId) => {
    setAssetLookupOpen(false);
    navigate(`/asset/${assetId}`);
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`} 
      style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}
    >
      {/* Asset Lookup Modal */}
      <AssetLookup 
        isOpen={assetLookupOpen} 
        onClose={() => setAssetLookupOpen(false)} 
        onSelectAsset={handleAssetSelect}
        isDark={isDark}
      />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Header */}
      <header className={`h-14 lg:h-16 border-b fixed top-0 left-0 right-0 z-50 transition-colors ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="h-full flex items-center justify-between px-3 lg:px-4">
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm lg:text-lg">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-base lg:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>MOW-Tel</h1>
                <p className={`text-xs -mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Customer Portal</p>
              </div>
            </Link>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-4 lg:mx-8">
            <button 
              onClick={() => setAssetLookupOpen(true)}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-2 lg:py-2.5 text-sm transition-all text-left ${
                isDark 
                  ? 'bg-slate-700 border border-slate-600 text-slate-400 hover:border-slate-500' 
                  : 'bg-slate-100 border border-slate-200 text-slate-400 hover:border-slate-300'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="flex-1">Search assets, machines...</span>
              <kbd className={`px-2 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-500'}`}>⌘K</kbd>
            </button>
          </div>

          {/* Mobile Search Button */}
          <button 
            onClick={() => setAssetLookupOpen(true)}
            className={`md:hidden p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            <button className={`relative p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <div className={`hidden sm:flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 ml-1 lg:ml-2 border-l ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="text-right hidden lg:block">
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Demo User</p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>BNSF Railway</p>
              </div>
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-amber-100'}`}>
                <User className={`w-4 h-4 lg:w-5 lg:h-5 ${isDark ? 'text-slate-300' : 'text-amber-700'}`} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-14 lg:pt-16">
        {/* Sidebar - Desktop always visible, Mobile slide-in */}
        <aside className={`
          fixed lg:sticky top-14 lg:top-16 left-0 h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] 
          w-64 z-40 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isDark ? 'bg-slate-800 border-r border-slate-700' : 'bg-white border-r border-slate-200'}
        `}>
          <nav className="p-4 space-y-1 overflow-y-auto h-full pb-20 lg:pb-4">
            <NavItem to="/" icon={Activity} label="Rail Ops Overview" isDark={isDark} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/fleet" icon={Truck} label="Fleet & Assets" isDark={isDark} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" isDark={isDark} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/safety" icon={Shield} label="Safety Center" badge="2" isDark={isDark} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/service" icon={Wrench} label="Service & Maintenance" badge="7" isDark={isDark} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/orders" icon={Package} label="Parts & Orders" isDark={isDark} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/documents" icon={FileText} label="Documents" isDark={isDark} onClick={() => setSidebarOpen(false)} />
            
            <div className={`pt-4 mt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <p className={`px-3 py-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Quick Actions
              </p>
              <NavItem to="/service" icon={AlertTriangle} label="Report Issue" isDark={isDark} onClick={() => setSidebarOpen(false)} />
              <NavItem to="/service" icon={Calendar} label="Schedule Service" isDark={isDark} onClick={() => setSidebarOpen(false)} />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          <div className="p-3 lg:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-6">
              <div>
                <h2 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Rail Operations Overview</h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Real-time fleet status and metrics</p>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <select className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isDark 
                    ? 'bg-slate-800 border border-slate-700 text-white' 
                    : 'bg-white border border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
                <button className={`hidden sm:flex px-3 lg:px-4 py-2 rounded-lg text-sm font-medium items-center gap-2 ${
                  isDark 
                    ? 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                }`}>
                  <FileText className="w-4 h-4" /> <span className="hidden lg:inline">Export</span>
                </button>
              </div>
            </div>

            {/* KPI Cards - 2x2 on mobile, 4x1 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
              <StatCard icon={Gauge} label="Utilization" value={mockFleetData.utilizationRate} unit="%" trend={mockFleetData.utilizationTrend} trendDirection="up" sparkData={[65, 72, 78, 74, 81, 79, 81]} isDark={isDark} />
              <StatCard icon={Clock} label="Work Hours" value={mockFleetData.totalWorkHours.toLocaleString()} unit="hrs" trend={mockFleetData.workHoursTrend} trendDirection="up" sparkData={[1200, 1350, 1500, 1650, 1700, 1800, 1847]} isDark={isDark} />
              <StatCard icon={Zap} label="Cycles" value={(mockFleetData.cyclesCompleted / 1000).toFixed(1)} unit="K" trend={mockFleetData.cyclesTrend} trendDirection="up" sparkData={[32, 35, 38, 40, 41, 42, 42.6]} isDark={isDark} />
              <StatCard icon={Target} label="Miles" value={mockFleetData.milesTracked.toLocaleString()} unit="mi" trend={mockFleetData.milesTrend} trendDirection="up" sparkData={[1800, 1950, 2050, 2150, 2250, 2300, 2341]} isDark={isDark} />
            </div>

            {/* Fleet Map + Fleet Status - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
              <div className="lg:col-span-2">
                <FleetMap isDark={isDark} onAssetClick={(id) => navigate(`/asset/${id}`)} />
              </div>
              <Card isDark={isDark}>
                <CardHeader 
                  title="Fleet Status" 
                  isDark={isDark}
                  action={
                    <Link to="/fleet" className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center gap-1">
                      <span className="hidden sm:inline">View All</span> <ChevronRight className="w-4 h-4" />
                    </Link>
                  }
                />
                <div className="flex items-center justify-center mb-4 lg:mb-6">
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${(38/47)*100} 100`} strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${(6/47)*100} 100`} strokeDashoffset={`-${(38/47)*100}`} strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray={`${(3/47)*100} 100`} strokeDashoffset={`-${((38+6)/47)*100}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>47</span>
                      <span className={`text-xs lg:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Active', value: 38, color: 'bg-emerald-500' },
                    { label: 'Idle', value: 6, color: 'bg-amber-500' },
                    { label: 'Down', value: 3, color: 'bg-rose-500' },
                  ].map(item => (
                    <div key={item.label} className={`flex items-center justify-between p-2 lg:p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                      <span className="flex items-center gap-2 lg:gap-3">
                        <span className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full ${item.color}`}></span>
                        <span className={`font-medium text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
                      </span>
                      <span className={`text-lg lg:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Predictive Maintenance + Video Incidents - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
              <PredictiveMaintenanceCard items={predictiveMaintenance} isDark={isDark} onItemClick={(id) => navigate(`/asset/${id}`)} />
              <VideoIncidentsCard incidents={videoIncidents} isDark={isDark} onIncidentClick={(id) => navigate(`/event/${id}`)} />
            </div>

            {/* Alerts + Activity - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
              <Card isDark={isDark}>
                <CardHeader 
                  title="Recent Alerts" 
                  icon={AlertTriangle} 
                  iconColor="text-rose-500"
                  isDark={isDark}
                  action={
                    <Link to="/safety" className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center gap-1">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  }
                />
                <div className="space-y-2">
                  {recentAlerts.slice(0, 3).map(alert => (
                    <div 
                      key={alert.id} 
                      onClick={() => navigate(`/asset/${alert.asset}`)}
                      className={`flex items-start gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg cursor-pointer transition-colors ${
                        isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{alert.asset}</span>
                          <AlertBadge severity={alert.severity} isDark={isDark} />
                        </div>
                        <p className={`text-xs lg:text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card isDark={isDark}>
                <CardHeader 
                  title="Live Activity" 
                  icon={Activity} 
                  iconColor="text-emerald-500"
                  isDark={isDark}
                  action={
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-medium">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Live
                    </span>
                  }
                />
                <div className="space-y-2">
                  {recentActivity.slice(0, 3).map(activity => (
                    <div 
                      key={activity.id}
                      onClick={() => navigate(`/asset/${activity.asset}`)}
                      className={`flex items-start gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg cursor-pointer transition-colors ${
                        isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-700' : 'bg-amber-100'}`}>
                        <Activity className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{activity.asset}</span>
                        </div>
                        <p className={`text-xs lg:text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{activity.action}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{activity.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Footer */}
            <div className={`mt-6 lg:mt-8 pt-4 lg:pt-6 border-t text-xs ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <p>MOW-Tel Customer Portal Demo</p>
                <p>Data refreshed: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav isDark={isDark} />
    </div>
  );
}
