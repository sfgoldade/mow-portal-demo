import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Bell, Calendar,
  Camera, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Download, Eye, FileText, Flag, Gauge, History, Info,
  MapPin, Menu, MessageSquare, MoreHorizontal, Package, Pause, Play,
  Radio, RefreshCw, Rewind, FastForward, Search, Send, Settings, Shield,
  Signal, SkipBack, SkipForward, Sliders, Square, Target, Thermometer,
  Truck, User, Video, Volume2, VolumeX, Wrench, X, Zap, 
  AlertCircle, ExternalLink, Copy, Printer, Share2, BarChart3, Maximize2
, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';

// ============================================
// MOCK DATA
// ============================================

const eventData = {
  id: 'EVT-2847',
  assetId: 'TSD-1247',
  assetType: 'Titan Spike Driver',
  timestamp: '2026-01-03T10:23:47Z',
  displayTime: 'Today, 10:23:47 AM',
  type: 'Auto-Stop Triggered',
  severity: 'high',
  status: 'pending_review',
  cause: 'Obstruction detected - Equipment',
  description: 'LiDAR primary sensor detected stationary equipment on track ahead. Auto-brake system engaged at 4.2 mph, achieving full stop in 2.1 feet. No impact occurred.',
  
  location: {
    subdivision: 'BNSF Subdivision 14',
    mileMarker: 'Mile 142.1',
    coordinates: '35.2271° N, 101.8313° W',
    trackType: 'Main Line',
    territory: 'Southwest Division'
  },
  
  operator: {
    name: 'Jorge Martinez',
    id: 'OP-4521',
    shift: 'Day Shift',
    certifications: ['MOW Operator Level 3', 'Safety Certified']
  },
  
  vehicleState: {
    speedAtDetection: 4.2,
    speedUnit: 'mph',
    direction: 'Forward',
    stoppingDistance: 2.1,
    stoppingDistanceUnit: 'ft',
    brakeResponse: '0.3s',
    engineRPM: 1850,
    hydraulicPressure: 2450,
    hydraulicUnit: 'PSI'
  },
  
  detection: {
    primarySensor: 'LiDAR Primary',
    secondarySensor: 'Camera Array',
    confidence: 97.2,
    objectDistance: 12.4,
    objectDistanceUnit: 'ft',
    objectClassification: 'Equipment/Vehicle',
    objectSize: 'Large',
    detectionLatency: '45ms'
  },
  
  video: {
    available: true,
    duration: 47,
    preEventSeconds: 15,
    postEventSeconds: 32,
    cameras: ['Front Wide', 'Front Narrow', 'Left Side', 'Right Side'],
    thumbnail: null
  },
  
  sensorSnapshot: {
    lidar: {
      status: 'triggered',
      pointCloud: 24847,
      detectionZone: 'front_30m',
      obstacleCount: 1
    },
    camera: {
      status: 'active',
      objectsDetected: 1,
      classification: 'equipment',
      boundingBox: { x: 412, y: 186, w: 245, h: 189 }
    },
    gps: {
      lat: 35.2271,
      lon: -101.8313,
      accuracy: 0.8,
      speed: 4.2
    },
    accelerometer: {
      x: -2.4,
      y: 0.1,
      z: 9.8,
      deceleration: 2.4
    }
  },
  
  relatedEvents: [
    { id: 'EVT-2846', time: '08:47 AM', type: 'Proximity Alert', severity: 'medium' },
    { id: 'EVT-2841', time: 'Yesterday', type: 'Auto-Stop', severity: 'high' },
    { id: 'EVT-2838', time: 'Yesterday', type: 'Speed Warning', severity: 'low' }
  ],
  
  notes: [
    { 
      id: 1, 
      author: 'System', 
      time: '10:23:47 AM', 
      text: 'Auto-stop event triggered. Awaiting operator acknowledgment.',
      type: 'system'
    },
    {
      id: 2,
      author: 'J. Martinez',
      time: '10:25:12 AM',
      text: 'Confirmed obstruction was a track geometry car that had stopped unexpectedly. No damage to either unit.',
      type: 'operator'
    }
  ]
};

const auditLog = [
  { time: '10:23:47 AM', action: 'Event created', actor: 'System' },
  { time: '10:23:48 AM', action: 'Alert sent to dispatch', actor: 'System' },
  { time: '10:24:15 AM', action: 'Video recording saved', actor: 'System' },
  { time: '10:25:12 AM', action: 'Note added by operator', actor: 'J. Martinez' },
  { time: '10:31:00 AM', action: 'Event viewed', actor: 'Demo User' }
];

// ============================================
// COMPONENTS
// ============================================

const StatusBadge = ({ status }) => {
  const styles = {
    pending_review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    acknowledged: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    escalated: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };
  const labels = {
    pending_review: 'Pending Review',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
    escalated: 'Escalated'
  };
  return (
    <span className={`px-2.5 py-1 rounded text-xs font-medium border ${styles[status]}`}>
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
    <span className={`px-2.5 py-1 rounded text-xs font-medium border uppercase ${styles[severity]}`}>
      {severity}
    </span>
  );
};

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

const DataRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
    <span className="text-sm text-slate-400">{label}</span>
    <span className={`text-sm ${highlight ? 'text-amber-400 font-medium' : 'text-slate-200'}`}>{value}</span>
  </div>
);

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(15); // Start at event moment
  const [selectedCamera, setSelectedCamera] = useState('Front Wide');
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const totalDuration = eventData.video.duration;
  const eventMoment = eventData.video.preEventSeconds;
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden">
      {/* Video Display Area */}
      <div className="relative aspect-video bg-black flex items-center justify-center">
        {/* Simulated video frame */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          {/* Grid overlay to simulate camera view */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          {/* Simulated detection box */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-36 border-2 border-amber-500 rounded">
            <div className="absolute -top-6 left-0 px-2 py-0.5 bg-amber-500 text-slate-900 text-xs font-medium rounded">
              EQUIPMENT DETECTED - 97.2%
            </div>
            <div className="absolute inset-0 bg-amber-500/10" />
          </div>
          
          {/* Distance indicator */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-amber-400">
            <Target className="w-4 h-4" />
            <span className="text-sm font-mono">12.4 ft</span>
          </div>
        </div>
        
        {/* Camera label */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 rounded text-sm text-white flex items-center gap-2">
          <Camera className="w-4 h-4" />
          {selectedCamera}
        </div>
        
        {/* Timestamp */}
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 rounded text-sm text-white font-mono">
          2026-01-03 10:23:47
        </div>
        
        {/* Speed overlay */}
        <div className="absolute bottom-4 left-4 px-3 py-2 bg-black/60 rounded">
          <div className="text-2xl font-bold text-white font-mono">4.2</div>
          <div className="text-xs text-slate-400">MPH</div>
        </div>
        
        {/* Sensor status */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-xs text-emerald-400 flex items-center gap-1">
            <Radio className="w-3 h-3" /> LiDAR
          </div>
          <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-xs text-emerald-400 flex items-center gap-1">
            <Camera className="w-3 h-3" /> CAM
          </div>
        </div>
        
        {/* Play button overlay */}
        {!isPlaying && (
          <button 
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors group"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </button>
        )}
        
        {/* Event marker flash */}
        {currentTime >= eventMoment && currentTime <= eventMoment + 2 && (
          <div className="absolute inset-0 border-4 border-rose-500 animate-pulse" />
        )}
      </div>
      
      {/* Timeline */}
      <div className="px-4 py-3 bg-slate-800/50">
        <div className="relative h-8">
          {/* Track */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-700 rounded-full">
            {/* Progress */}
            <div 
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>
          
          {/* Event marker */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-rose-500 rounded"
            style={{ left: `${(eventMoment / totalDuration) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-rose-400">
              Event
            </div>
          </div>
          
          {/* Playhead */}
          <input 
            type="range"
            min={0}
            max={totalDuration}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer"
            style={{ left: `calc(${(currentTime / totalDuration) * 100}% - 8px)` }}
          />
        </div>
        
        {/* Time labels */}
        <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
          <span>-0:{String(eventMoment).padStart(2, '0')}</span>
          <span className="text-rose-400">Event</span>
          <span>+0:{String(totalDuration - eventMoment).padStart(2, '0')}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="px-4 py-3 bg-slate-800/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Time display */}
          <span className="text-sm text-slate-400 font-mono w-20">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-slate-700/50 rounded transition-colors">
            <SkipBack className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-700/50 rounded transition-colors">
            <Rewind className="w-4 h-4 text-slate-400" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-slate-900" /> : <Play className="w-5 h-5 text-slate-900 ml-0.5" />}
          </button>
          <button className="p-2 hover:bg-slate-700/50 rounded transition-colors">
            <FastForward className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-700/50 rounded transition-colors">
            <SkipForward className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Playback speed */}
          <select 
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-300"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
          </select>
          
          {/* Volume */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-slate-700/50 rounded transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
          </button>
          
          {/* Fullscreen */}
          <button className="p-2 hover:bg-slate-700/50 rounded transition-colors">
            <Maximize2 className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
      
      {/* Camera selector */}
      <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700/50 flex items-center gap-2">
        <span className="text-xs text-slate-500">Camera:</span>
        {eventData.video.cameras.map(cam => (
          <button
            key={cam}
            onClick={() => setSelectedCamera(cam)}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              selectedCamera === cam 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cam}
          </button>
        ))}
      </div>
    </div>
  );
};

const NoteItem = ({ note }) => (
  <div className={`p-3 rounded-lg ${
    note.type === 'system' 
      ? 'bg-slate-800/50 border border-slate-700/50' 
      : 'bg-blue-500/10 border border-blue-500/20'
  }`}>
    <div className="flex items-center justify-between mb-1">
      <span className={`text-sm font-medium ${note.type === 'system' ? 'text-slate-400' : 'text-blue-400'}`}>
        {note.author}
      </span>
      <span className="text-xs text-slate-500">{note.time}</span>
    </div>
    <p className="text-sm text-slate-300">{note.text}</p>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function EventReviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('details');
  const [newNote, setNewNote] = useState('');
  const [showRawData, setShowRawData] = useState(false);

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
            <NavItem to="/fleet" icon={Truck} label="Fleet & Assets" />
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
            <NavItem to="/safety" icon={Shield} label="Safety Center" active badge="2" />
            <NavItem to="/service" icon={Wrench} label="Service & Maintenance" badge="7" />
            <NavItem to="/orders" icon={Package} label="Parts & Orders" />
            <NavItem to="/documents" icon={FileText} label="Documents" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <button className="flex items-center gap-1 text-slate-400 hover:text-amber-500 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Safety Center
              </button>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-slate-300">{eventData.id}</span>
            </div>

            {/* Event Header */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{eventData.type}</h2>
                    <SeverityBadge severity={eventData.severity} />
                    <StatusBadge status={eventData.status} />
                  </div>
                  <p className="text-slate-400 mb-3">{eventData.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      {eventData.displayTime}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Truck className="w-4 h-4" />
                      {eventData.assetId}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-4 h-4" />
                      {eventData.location.mileMarker}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <User className="w-4 h-4" />
                      {eventData.operator.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Copy Link">
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Print">
                    <Printer className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Share">
                    <Share2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Video */}
              <div className="col-span-2 space-y-6">
                <VideoPlayer />
                
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                    <Gauge className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{eventData.vehicleState.speedAtDetection}</p>
                    <p className="text-xs text-slate-400">Speed (mph)</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                    <Target className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{eventData.vehicleState.stoppingDistance}</p>
                    <p className="text-xs text-slate-400">Stop Dist (ft)</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                    <Signal className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-400">{eventData.detection.confidence}%</p>
                    <p className="text-xs text-slate-400">Confidence</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
                    <Zap className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{eventData.vehicleState.brakeResponse}</p>
                    <p className="text-xs text-slate-400">Response Time</p>
                  </div>
                </div>

                {/* Sensor Data */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Sensor Snapshot</h3>
                    <button 
                      onClick={() => setShowRawData(!showRawData)}
                      className="text-sm text-amber-500 hover:text-amber-400"
                    >
                      {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
                    </button>
                  </div>
                  
                  {showRawData ? (
                    <pre className="text-xs text-slate-400 font-mono bg-slate-900/50 p-4 rounded-lg overflow-x-auto">
{JSON.stringify(eventData.sensorSnapshot, null, 2)}
                    </pre>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Radio className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-white">LiDAR Primary</span>
                          <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded text-xs">TRIGGERED</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Point Cloud</span>
                            <span className="text-slate-300">{eventData.sensorSnapshot.lidar.pointCloud.toLocaleString()} pts</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Detection Zone</span>
                            <span className="text-slate-300">Front 30m</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Obstacles</span>
                            <span className="text-slate-300">{eventData.sensorSnapshot.lidar.obstacleCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Camera className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-white">Camera Array</span>
                          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">ACTIVE</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Objects Detected</span>
                            <span className="text-slate-300">{eventData.sensorSnapshot.camera.objectsDetected}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Classification</span>
                            <span className="text-slate-300 capitalize">{eventData.sensorSnapshot.camera.classification}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Bounding Box</span>
                            <span className="text-slate-300 font-mono">{eventData.sensorSnapshot.camera.boundingBox.w}×{eventData.sensorSnapshot.camera.boundingBox.h}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-white">GPS</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Coordinates</span>
                            <span className="text-slate-300 font-mono">{eventData.sensorSnapshot.gps.lat}, {eventData.sensorSnapshot.gps.lon}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Accuracy</span>
                            <span className="text-slate-300">{eventData.sensorSnapshot.gps.accuracy}m</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-white">Accelerometer</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Deceleration</span>
                            <span className="text-slate-300">{eventData.sensorSnapshot.accelerometer.deceleration} m/s²</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">X / Y / Z</span>
                            <span className="text-slate-300 font-mono">{eventData.sensorSnapshot.accelerometer.x} / {eventData.sensorSnapshot.accelerometer.y} / {eventData.sensorSnapshot.accelerometer.z}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Details & Actions */}
              <div className="space-y-6">
                {/* Actions */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Acknowledge Event
                    </button>
                    <button className="w-full px-4 py-3 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-lg text-rose-400 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Flag className="w-4 h-4" />
                      Escalate to Safety Team
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-colors flex items-center justify-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Create Service Ticket
                    </button>
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Event Details</h3>
                  <div className="space-y-0">
                    <DataRow label="Event ID" value={eventData.id} />
                    <DataRow label="Asset" value={`${eventData.assetId} (${eventData.assetType})`} />
                    <DataRow label="Cause" value={eventData.cause} />
                    <DataRow label="Primary Sensor" value={eventData.detection.primarySensor} />
                    <DataRow label="Detection Confidence" value={`${eventData.detection.confidence}%`} highlight />
                    <DataRow label="Object Distance" value={`${eventData.detection.objectDistance} ${eventData.detection.objectDistanceUnit}`} />
                    <DataRow label="Object Type" value={eventData.detection.objectClassification} />
                    <DataRow label="Detection Latency" value={eventData.detection.detectionLatency} />
                  </div>
                </div>

                {/* Location */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Location</h3>
                  <div className="space-y-0">
                    <DataRow label="Subdivision" value={eventData.location.subdivision} />
                    <DataRow label="Mile Marker" value={eventData.location.mileMarker} />
                    <DataRow label="Coordinates" value={eventData.location.coordinates} />
                    <DataRow label="Track Type" value={eventData.location.trackType} />
                    <DataRow label="Territory" value={eventData.location.territory} />
                  </div>
                </div>

                {/* Operator */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Operator</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{eventData.operator.name}</p>
                      <p className="text-xs text-slate-500">{eventData.operator.id} • {eventData.operator.shift}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {eventData.operator.certifications.map(cert => (
                      <span key={cert} className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Notes & Activity</h3>
                  <div className="space-y-3 mb-4">
                    {eventData.notes.map(note => (
                      <NoteItem key={note.id} note={note} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                    />
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors">
                      <Send className="w-4 h-4 text-slate-900" />
                    </button>
                  </div>
                </div>

                {/* Related Events */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Related Events</h3>
                  <div className="space-y-2">
                    {eventData.relatedEvents.map(event => (
                      <button key={event.id} className="w-full flex items-center justify-between p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-left">
                        <div>
                          <p className="text-sm text-white">{event.id}</p>
                          <p className="text-xs text-slate-500">{event.type} • {event.time}</p>
                        </div>
                        <SeverityBadge severity={event.severity} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audit Log */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Audit Log</h3>
                  <div className="space-y-2">
                    {auditLog.map((entry, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-slate-500 w-20 flex-shrink-0">{entry.time}</span>
                        <span className="text-slate-400">{entry.action}</span>
                        <span className="text-slate-500">by {entry.actor}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
