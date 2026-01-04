import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, ArrowLeft, ArrowUpRight, ArrowDownRight,
  BarChart3, Battery, Bell, Calendar, Camera, CheckCircle, ChevronDown, ChevronRight,
  Clock, Download, Eye, FileText, Gauge, History, Info, Layers,
  MapPin, Menu, MoreHorizontal, Package, Play, Radio, Search, Settings,
  Shield, Signal, Thermometer, Timer, Tool, Truck, User, Video,
  Wifi, Wrench, Zap, X, Check, MessageSquare, Flag, RefreshCw,
  AlertCircle, TrendingUp, TrendingDown, CircleDot, Cpu, HardDrive,
  Sun, Moon, Target
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';

// ============================================
// MOCK DATA
// ============================================

const assetData = {
  id: 'TSD-1247',
  name: 'Titan Spike Driver #1247',
  type: 'Titan Spike Driver',
  serialNumber: 'MOW-TSD-2019-1247',
  status: 'active',
  location: 'BNSF Subdivision 14, Mile 142.3',
  coordinates: '35.2271° N, 101.8313° W',
  operator: 'Jorge Martinez',
  shift: 'Day Shift (06:00 - 18:00)',
  lastUpdate: '2 min ago',
  customer: 'BNSF Railway',
  region: 'Southwest Division',
  commissioned: 'March 2019',
  warrantyStatus: 'Active until Mar 2026',
  firmware: 'v4.2.1',
  telematics: 'MOW-Tel v2.3'
};

const opsMetrics = {
  todayWorkHours: 6.4,
  todayIdleHours: 1.2,
  todayDownHours: 0,
  utilizationToday: 84,
  utilizationWeek: 78,
  utilizationMonth: 81,
  totalCyclesToday: 847,
  cyclesPerHour: 132,
  milesTraversed: 12.4,
  fuelLevel: 72,
  engineHours: 4847,
  workheadCycles: 284650,
  nextServiceDue: 'In 847 cycles',
  lastService: '12 days ago'
};

const timelineData = [
  { hour: '06:00', status: 'idle', duration: 15, note: 'Startup & pre-flight check' },
  { hour: '06:15', status: 'work', duration: 120, note: 'Active spiking - Section A' },
  { hour: '08:15', status: 'idle', duration: 20, note: 'Operator break' },
  { hour: '08:35', status: 'work', duration: 90, note: 'Active spiking - Section A cont.' },
  { hour: '10:05', status: 'work', duration: 75, note: 'Active spiking - Section B' },
  { hour: '11:20', status: 'idle', duration: 40, note: 'Lunch break' },
  { hour: '12:00', status: 'work', duration: 110, note: 'Active spiking - Section B cont.' },
  { hour: '13:50', status: 'idle', duration: 15, note: 'Repositioning' },
  { hour: '14:05', status: 'work', duration: 55, note: 'Active spiking - Section C' },
  { hour: '15:00', status: 'active', duration: 0, note: 'Currently working' }
];

const dailyBreakdown = [
  { day: 'Mon', work: 7.2, idle: 1.8, down: 0 },
  { day: 'Tue', work: 6.8, idle: 2.0, down: 0.2 },
  { day: 'Wed', work: 7.5, idle: 1.5, down: 0 },
  { day: 'Thu', work: 5.2, idle: 1.0, down: 2.8 },
  { day: 'Fri', work: 7.0, idle: 2.0, down: 0 },
  { day: 'Sat', work: 4.5, idle: 0.5, down: 0 },
  { day: 'Sun', work: 0, idle: 0, down: 0 }
];

const downtimeEvents = [
  { id: 1, date: 'Thu, Jan 2', duration: '2h 48m', reason: 'Hydraulic line repair', resolved: true, ticket: 'SVC-4521' },
  { id: 2, date: 'Dec 28', duration: '1h 15m', reason: 'Control system reset', resolved: true, ticket: 'SVC-4498' },
  { id: 3, date: 'Dec 21', duration: '45m', reason: 'Operator training pause', resolved: true, ticket: null }
];

const sensorHealth = [
  { name: 'GPS Module', status: 'healthy', signal: 98, lastPing: '2s ago' },
  { name: 'Accelerometer', status: 'healthy', signal: 100, lastPing: '1s ago' },
  { name: 'Hydraulic Pressure', status: 'warning', signal: 87, lastPing: '1s ago' },
  { name: 'Engine Temp', status: 'healthy', signal: 100, lastPing: '3s ago' },
  { name: 'Fuel Level', status: 'healthy', signal: 100, lastPing: '5s ago' },
  { name: 'Workhead Counter', status: 'healthy', signal: 100, lastPing: '1s ago' }
];

const safetyMetrics = {
  totalEvents30Days: 12,
  eventsPer1000Miles: 2.4,
  avgConfidence: 94.2,
  autoStopsTriggered: 8,
  nearMisses: 3,
  falsePositives: 1,
  lidarUptime: 99.7,
  cameraUptime: 98.9,
  lastCalibration: '14 days ago',
  nextCalibration: 'In 16 days'
};

const safetyEvents = [
  { 
    id: 'EVT-2847', 
    timestamp: 'Today, 10:23 AM',
    type: 'Auto-Stop Triggered',
    severity: 'high',
    cause: 'Obstruction detected - Equipment',
    confidence: 97.2,
    speed: 4.2,
    stoppingDistance: '2.1 ft',
    sensor: 'LiDAR Primary',
    hasVideo: true,
    status: 'pending_review',
    location: 'Mile 142.1'
  },
  { 
    id: 'EVT-2846', 
    timestamp: 'Today, 08:47 AM',
    type: 'Proximity Alert',
    severity: 'medium',
    cause: 'Personnel in work zone',
    confidence: 94.8,
    speed: 2.8,
    stoppingDistance: 'N/A - Slowed',
    sensor: 'Camera Array',
    hasVideo: true,
    status: 'acknowledged',
    location: 'Mile 141.8'
  },
  { 
    id: 'EVT-2841', 
    timestamp: 'Yesterday, 3:12 PM',
    type: 'Auto-Stop Triggered',
    severity: 'high',
    cause: 'Track obstruction - Debris',
    confidence: 99.1,
    speed: 5.1,
    stoppingDistance: '2.8 ft',
    sensor: 'LiDAR Primary',
    hasVideo: true,
    status: 'resolved',
    location: 'Mile 140.2'
  },
  { 
    id: 'EVT-2838', 
    timestamp: 'Yesterday, 11:05 AM',
    type: 'Speed Warning',
    severity: 'low',
    cause: 'Exceeded zone limit',
    confidence: 100,
    speed: 6.2,
    stoppingDistance: 'N/A',
    sensor: 'GPS + Geofence',
    hasVideo: false,
    status: 'resolved',
    location: 'Mile 139.5'
  },
  { 
    id: 'EVT-2835', 
    timestamp: 'Jan 1, 9:33 AM',
    type: 'Near Miss',
    severity: 'critical',
    cause: 'Personnel - Unexpected entry',
    confidence: 96.5,
    speed: 3.9,
    stoppingDistance: '1.4 ft',
    sensor: 'Camera + LiDAR',
    hasVideo: true,
    status: 'escalated',
    location: 'Mile 138.7'
  }
];

const alertRules = [
  { id: 1, name: 'Auto-stop events', enabled: true, channels: ['email', 'sms', 'push'] },
  { id: 2, name: 'Near miss incidents', enabled: true, channels: ['email', 'sms', 'push'] },
  { id: 3, name: 'Sensor offline', enabled: true, channels: ['email', 'push'] },
  { id: 4, name: 'Speed violations', enabled: false, channels: ['email'] },
  { id: 5, name: 'Daily safety digest', enabled: true, channels: ['email'] }
];

// ============================================
// COMPONENTS
// ============================================

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    idle: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    down: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    pending_review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    acknowledged: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    escalated: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };
  const labels = {
    active: 'Active',
    idle: 'Idle',
    down: 'Down',
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
    pending_review: 'Pending Review',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
    escalated: 'Escalated'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const SeverityBadge = ({ severity }) => {
  const styles = {
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border uppercase ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const TabButton = ({ active, onClick, children, badge }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
      active 
        ? 'border-amber-500 text-amber-500' 
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
    }`}
  >
    <span className="flex items-center gap-2">
      {children}
      {badge && (
        <span className="px-1.5 py-0.5 rounded text-xs bg-rose-500/20 text-rose-400">
          {badge}
        </span>
      )}
    </span>
  </button>
);

const MetricCard = ({ icon: Icon, label, value, unit, subtext, trend, color = 'amber' }) => {
  const colorClasses = {
    amber: 'text-amber-500 bg-amber-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
    blue: 'text-blue-500 bg-blue-500/10'
  };
  const colorClass = colorClasses[color] || colorClasses.amber;
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
        </div>
        {trend && (
          <span className={`text-xs flex items-center gap-1 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-white">{value}</span>
        {unit && <span className="text-slate-400 text-sm">{unit}</span>}
      </div>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
};

const ProgressRing = ({ value, size = 80, strokeWidth = 8, color = '#f59e0b' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{value}%</span>
      </div>
    </div>
  );
};

const TimelineBar = () => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 6);
  const currentHour = 15; // 3 PM
  
  return (
    <div className="relative">
      {/* Hour labels */}
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        {hours.map(h => (
          <span key={h} className="w-8 text-center">
            {h > 12 ? `${h-12}p` : h === 12 ? '12p' : `${h}a`}
          </span>
        ))}
      </div>
      
      {/* Timeline bar */}
      <div className="h-8 bg-slate-700/50 rounded-lg overflow-hidden flex">
        {timelineData.map((segment, i) => {
          const widthPercent = (segment.duration / 720) * 100; // 720 = 12 hours in minutes
          const colors = {
            work: 'bg-emerald-500',
            idle: 'bg-amber-500',
            down: 'bg-rose-500',
            active: 'bg-emerald-500 animate-pulse'
          };
          if (segment.duration === 0) return null;
          return (
            <div
              key={i}
              className={`${colors[segment.status]} relative group cursor-pointer`}
              style={{ width: `${widthPercent}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-2 text-xs whitespace-nowrap shadow-xl">
                  <p className="font-medium text-white">{segment.note}</p>
                  <p className="text-slate-400">{segment.hour} • {segment.duration}m</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Current time indicator */}
      <div 
        className="absolute top-6 w-0.5 h-10 bg-white/80"
        style={{ left: `${((currentHour - 6) / 12) * 100}%` }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-emerald-500 rounded"></span>
          <span className="text-slate-400">Work</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-amber-500 rounded"></span>
          <span className="text-slate-400">Idle</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-rose-500 rounded"></span>
          <span className="text-slate-400">Down</span>
        </span>
      </div>
    </div>
  );
};

const DailyChart = () => {
  const maxHours = 9;
  return (
    <div className="space-y-2">
      {dailyBreakdown.map((day, i) => {
        const total = day.work + day.idle + day.down;
        return (
          <div key={day.day} className="flex items-center gap-3">
            <span className="w-8 text-xs text-slate-500">{day.day}</span>
            <div className="flex-1 h-6 bg-slate-700/30 rounded overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${(day.work / maxHours) * 100}%` }}
              />
              <div 
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${(day.idle / maxHours) * 100}%` }}
              />
              <div 
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${(day.down / maxHours) * 100}%` }}
              />
            </div>
            <span className="w-12 text-xs text-slate-400 text-right">{total.toFixed(1)}h</span>
          </div>
        );
      })}
    </div>
  );
};

const SensorStatusRow = ({ sensor }) => {
  const statusColors = {
    healthy: 'text-emerald-400',
    warning: 'text-amber-400',
    critical: 'text-rose-400'
  };
  const statusIcons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    critical: X
  };
  const StatusIcon = statusIcons[sensor.status];
  
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-700/50 last:border-0">
      <StatusIcon className={`w-4 h-4 ${statusColors[sensor.status]}`} />
      <span className="flex-1 text-sm text-slate-300">{sensor.name}</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Signal className="w-3 h-3 text-slate-500" />
          <span className="text-xs text-slate-400">{sensor.signal}%</span>
        </div>
        <span className="text-xs text-slate-500">{sensor.lastPing}</span>
      </div>
    </div>
  );
};

const SafetyEventRow = ({ event, onViewDetails }) => (
  <div 
    className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/80 transition-colors cursor-pointer border border-slate-700/30 hover:border-slate-600/50"
    onClick={() => onViewDetails(event)}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          event.severity === 'critical' ? 'bg-rose-500/20' :
          event.severity === 'high' ? 'bg-orange-500/20' :
          event.severity === 'medium' ? 'bg-amber-500/20' : 'bg-blue-500/20'
        }`}>
          <Shield className={`w-5 h-5 ${
            event.severity === 'critical' ? 'text-rose-400' :
            event.severity === 'high' ? 'text-orange-400' :
            event.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
          }`} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">{event.type}</span>
            <SeverityBadge severity={event.severity} />
            <StatusBadge status={event.status} />
          </div>
          <p className="text-sm text-slate-400">{event.cause}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500">{event.id}</p>
        <p className="text-xs text-slate-400">{event.timestamp}</p>
      </div>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1 text-slate-400">
          <Gauge className="w-3 h-3" />
          {event.speed} mph
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <Target className="w-3 h-3" />
          {event.stoppingDistance}
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <Radio className="w-3 h-3" />
          {event.sensor}
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <MapPin className="w-3 h-3" />
          {event.location}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Confidence:</span>
        <span className={`text-sm font-medium ${event.confidence >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {event.confidence}%
        </span>
        {event.hasVideo && (
          <button className="ml-2 flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300 hover:bg-slate-700 transition-colors">
            <Video className="w-3 h-3" />
            Video
          </button>
        )}
      </div>
    </div>
  </div>
);

// Navigation item (reused from overview)
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

// ============================================
// MAIN COMPONENT
// ============================================

export default function AssetDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('ops');
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`} style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}>
      {/* Top Header Bar */}
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
            {/* Breadcrumb & Back */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <button className="flex items-center gap-1 text-slate-400 hover:text-amber-500 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Fleet & Assets
              </button>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-slate-300">{assetData.id}</span>
            </div>

            {/* Asset Header */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                    <Truck className="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-white">{assetData.id}</h2>
                      <StatusBadge status={assetData.status} />
                    </div>
                    <p className="text-slate-400">{assetData.type}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-4 h-4" />
                        {assetData.location}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <User className="w-4 h-4" />
                        {assetData.operator}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CircleDot className="w-3 h-3 animate-pulse" />
                        Updated {assetData.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2">
                    <History className="w-4 h-4" />
                    History
                  </button>
                  <button className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents
                  </button>
                  <button className="px-3 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Service Request
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700/50 mb-6">
              <div className="flex gap-1">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                  <Info className="w-4 h-4" /> Overview
                </TabButton>
                <TabButton active={activeTab === 'ops'} onClick={() => setActiveTab('ops')}>
                  <BarChart3 className="w-4 h-4" /> Operations
                </TabButton>
                <TabButton active={activeTab === 'safety'} onClick={() => setActiveTab('safety')} badge="2">
                  <Shield className="w-4 h-4" /> Safety
                </TabButton>
                <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
                  <FileText className="w-4 h-4" /> Documents
                </TabButton>
                <TabButton active={activeTab === 'service'} onClick={() => setActiveTab('service')}>
                  <Wrench className="w-4 h-4" /> Service History
                </TabButton>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'ops' && (
              <div className="space-y-6">
                {/* Today's Metrics Row */}
                <div className="grid grid-cols-6 gap-4">
                  <MetricCard icon={Timer} label="Work Hours" value={opsMetrics.todayWorkHours} unit="hrs" color="emerald" />
                  <MetricCard icon={Clock} label="Idle Hours" value={opsMetrics.todayIdleHours} unit="hrs" color="amber" />
                  <MetricCard icon={AlertCircle} label="Down Hours" value={opsMetrics.todayDownHours} unit="hrs" color="rose" />
                  <MetricCard icon={Zap} label="Cycles Today" value={opsMetrics.totalCyclesToday} subtext={`${opsMetrics.cyclesPerHour}/hr avg`} />
                  <MetricCard icon={MapPin} label="Miles Today" value={opsMetrics.milesTraversed} unit="mi" />
                  <MetricCard icon={Battery} label="Fuel Level" value={opsMetrics.fuelLevel} unit="%" color={opsMetrics.fuelLevel > 50 ? 'emerald' : 'amber'} />
                </div>

                {/* Utilization + Timeline Row */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Utilization */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-4">Utilization Rate</h3>
                    <div className="flex items-center justify-around">
                      <div className="text-center">
                        <ProgressRing value={opsMetrics.utilizationToday} color="#10b981" />
                        <p className="text-xs text-slate-400 mt-2">Today</p>
                      </div>
                      <div className="text-center">
                        <ProgressRing value={opsMetrics.utilizationWeek} color="#f59e0b" />
                        <p className="text-xs text-slate-400 mt-2">This Week</p>
                      </div>
                      <div className="text-center">
                        <ProgressRing value={opsMetrics.utilizationMonth} color="#3b82f6" />
                        <p className="text-xs text-slate-400 mt-2">This Month</p>
                      </div>
                    </div>
                  </div>

                  {/* 24-Hour Timeline */}
                  <div className="col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Today's Activity Timeline</h3>
                      <span className="text-xs text-slate-500">Shift: 06:00 - 18:00</span>
                    </div>
                    <TimelineBar />
                  </div>
                </div>

                {/* Weekly Breakdown + Lifetime Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-4">Weekly Breakdown</h3>
                    <DailyChart />
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-4">Lifetime Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Engine Hours</p>
                        <p className="text-xl font-bold text-white">{opsMetrics.engineHours.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Workhead Cycles</p>
                        <p className="text-xl font-bold text-white">{opsMetrics.workheadCycles.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Next Service Due</p>
                        <p className="text-lg font-semibold text-amber-400">{opsMetrics.nextServiceDue}</p>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Last Service</p>
                        <p className="text-lg font-semibold text-slate-300">{opsMetrics.lastService}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Downtime Events + Sensor Health */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Recent Downtime Events</h3>
                      <button className="text-amber-500 text-sm hover:text-amber-400">View All</button>
                    </div>
                    <div className="space-y-3">
                      {downtimeEvents.map(event => (
                        <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                          <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-rose-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{event.reason}</p>
                            <p className="text-xs text-slate-500">{event.date} • {event.duration}</p>
                          </div>
                          {event.ticket && (
                            <span className="text-xs text-amber-400">{event.ticket}</span>
                          )}
                          {event.resolved && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Sensor Health</h3>
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <CircleDot className="w-3 h-3 animate-pulse" />
                        Live
                      </span>
                    </div>
                    <div>
                      {sensorHealth.map(sensor => (
                        <SensorStatusRow key={sensor.name} sensor={sensor} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-6">
                {/* Safety KPIs */}
                <div className="grid grid-cols-5 gap-4">
                  <MetricCard 
                    icon={Shield} 
                    label="Events (30 Days)" 
                    value={safetyMetrics.totalEvents30Days} 
                    color="amber"
                  />
                  <MetricCard 
                    icon={Target} 
                    label="Events per 1K Miles" 
                    value={safetyMetrics.eventsPer1000Miles} 
                    color="blue"
                  />
                  <MetricCard 
                    icon={Zap} 
                    label="Auto-Stops" 
                    value={safetyMetrics.autoStopsTriggered} 
                    subtext={`${safetyMetrics.nearMisses} near misses`}
                    color="rose"
                  />
                  <MetricCard 
                    icon={Radio} 
                    label="LiDAR Uptime" 
                    value={safetyMetrics.lidarUptime} 
                    unit="%"
                    color="emerald"
                  />
                  <MetricCard 
                    icon={Camera} 
                    label="Camera Uptime" 
                    value={safetyMetrics.cameraUptime} 
                    unit="%"
                    color="emerald"
                  />
                </div>

                {/* Safety System Status */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-4">Safety System Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Radio className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm text-slate-200">LiDAR Primary</span>
                        </div>
                        <StatusBadge status="healthy" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Camera className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm text-slate-200">Camera Array</span>
                        </div>
                        <StatusBadge status="healthy" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Cpu className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm text-slate-200">Auto-Brake Controller</span>
                        </div>
                        <StatusBadge status="healthy" />
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Last Calibration</span>
                          <span className="text-slate-200">{safetyMetrics.lastCalibration}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-slate-400">Next Calibration</span>
                          <span className="text-amber-400">{safetyMetrics.nextCalibration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Detection Confidence</h3>
                      <span className="text-sm text-slate-400">30-day average: <span className="text-emerald-400 font-medium">{safetyMetrics.avgConfidence}%</span></span>
                    </div>
                    <div className="h-32 flex items-end gap-1">
                      {[92, 95, 88, 97, 94, 99, 91, 96, 93, 98, 94, 97, 95, 92, 99, 94, 96, 93, 97, 95, 98, 94, 96, 91, 99, 95, 97, 93, 96, 94].map((val, i) => (
                        <div 
                          key={i}
                          className={`flex-1 rounded-t transition-all ${val >= 95 ? 'bg-emerald-500' : val >= 90 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ height: `${(val - 85) * 6}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>

                {/* Safety Events List */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Safety Events</h3>
                    <div className="flex items-center gap-2">
                      <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                        <option>All Severities</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                      <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                        <option>All Statuses</option>
                        <option>Pending Review</option>
                        <option>Acknowledged</option>
                        <option>Escalated</option>
                        <option>Resolved</option>
                      </select>
                      <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors">
                        Export
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {safetyEvents.map(event => (
                      <SafetyEventRow key={event.id} event={event} onViewDetails={setSelectedEvent} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                    <span className="text-sm text-slate-500">Showing 5 of 12 events</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-slate-700/50 rounded text-sm text-slate-400">Previous</button>
                      <button className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded text-sm">1</button>
                      <button className="px-3 py-1 bg-slate-700/50 rounded text-sm text-slate-400">2</button>
                      <button className="px-3 py-1 bg-slate-700/50 rounded text-sm text-slate-400">3</button>
                      <button className="px-3 py-1 bg-slate-700/50 rounded text-sm text-slate-400">Next</button>
                    </div>
                  </div>
                </div>

                {/* Alert Rules */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Alert Configuration</h3>
                    <button className="text-amber-500 text-sm hover:text-amber-400">+ Add Rule</button>
                  </div>
                  <div className="space-y-2">
                    {alertRules.map(rule => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-5 rounded-full relative cursor-pointer transition-colors ${rule.enabled ? 'bg-amber-500' : 'bg-slate-600'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${rule.enabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                          </div>
                          <span className="text-sm text-slate-200">{rule.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {rule.channels.includes('email') && <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">Email</span>}
                          {rule.channels.includes('sms') && <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">SMS</span>}
                          {rule.channels.includes('push') && <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">Push</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Asset Information</h3>
                  <div className="space-y-3">
                    {[
                      ['Serial Number', assetData.serialNumber],
                      ['Equipment Type', assetData.type],
                      ['Customer', assetData.customer],
                      ['Region', assetData.region],
                      ['Commissioned', assetData.commissioned],
                      ['Warranty Status', assetData.warrantyStatus],
                      ['Firmware Version', assetData.firmware],
                      ['Telematics Version', assetData.telematics]
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                        <span className="text-sm text-slate-400">{label}</span>
                        <span className="text-sm text-slate-200">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Current Assignment</h3>
                  <div className="space-y-3">
                    {[
                      ['Location', assetData.location],
                      ['Coordinates', assetData.coordinates],
                      ['Operator', assetData.operator],
                      ['Shift', assetData.shift],
                      ['Last Update', assetData.lastUpdate]
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                        <span className="text-sm text-slate-400">{label}</span>
                        <span className="text-sm text-slate-200">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'documents' || activeTab === 'service') && (
              <div className="flex items-center justify-center h-64 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">This tab would display {activeTab === 'documents' ? 'equipment documents, manuals, and inspection reports' : 'service history, maintenance records, and repair tickets'}.</p>
                  <p className="text-slate-500 text-sm mt-1">Demo content - not yet implemented</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <p>MOW-Tel Customer Portal Demo • Built with mock data for demonstration purposes</p>
              <p>Data refreshed: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </main>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{selectedEvent.type}</h3>
                    <SeverityBadge severity={selectedEvent.severity} />
                    <StatusBadge status={selectedEvent.status} />
                  </div>
                  <p className="text-slate-400">{selectedEvent.id} • {selectedEvent.timestamp}</p>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Video Placeholder */}
              {selectedEvent.hasVideo && (
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play className="w-8 h-8 text-amber-500 ml-1" />
                    </div>
                    <p className="text-slate-400">Video Playback</p>
                    <p className="text-slate-500 text-sm">Demo placeholder - actual footage would appear here</p>
                  </div>
                </div>
              )}

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Cause</p>
                  <p className="text-white">{selectedEvent.cause}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Detection Sensor</p>
                  <p className="text-white">{selectedEvent.sensor}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Speed at Detection</p>
                  <p className="text-white">{selectedEvent.speed} mph</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Stopping Distance</p>
                  <p className="text-white">{selectedEvent.stoppingDistance}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="text-white">{selectedEvent.location}</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Confidence Score</p>
                  <p className={`text-lg font-semibold ${selectedEvent.confidence >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedEvent.confidence}%
                  </p>
                </div>
              </div>

              {/* Sensor Snapshot */}
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">Sensor Snapshot (Raw Data)</p>
                <pre className="text-xs text-slate-400 font-mono overflow-x-auto">
{`{
  "event_id": "${selectedEvent.id}",
  "timestamp": "${new Date().toISOString()}",
  "sensors": {
    "lidar_primary": { "status": "triggered", "distance": 2.4, "confidence": ${selectedEvent.confidence} },
    "camera_array": { "status": "active", "objects_detected": 1, "classification": "equipment" },
    "gps": { "lat": 35.2271, "lon": -101.8313, "accuracy": 0.8 }
  },
  "vehicle_state": {
    "speed_mph": ${selectedEvent.speed},
    "brake_applied": true,
    "stopping_distance_ft": ${parseFloat(selectedEvent.stoppingDistance) || 0}
  }
}`}
                </pre>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200 transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Acknowledge
                </button>
                <button className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-lg text-sm text-rose-400 transition-colors flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Escalate
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
