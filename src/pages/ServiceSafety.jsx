import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, ArrowUpRight, Bell, Calendar, Check, CheckCircle,
  ChevronDown, ChevronLeft, ChevronRight, Clock, Download, Eye, FileText,
  Filter, Flag, Gauge, Hash, Inbox, Layers, MapPin, Menu, MessageSquare,
  MoreHorizontal, Package, PauseCircle, Phone, PlayCircle, Plus, Radio,
  RefreshCw, Search, Send, Settings, Shield, Sliders, Tag, Target,
  Thermometer, Tool, Truck, User, Users, Wrench, X, Zap, 
  AlertCircle, BarChart3, CalendarDays, ClipboardList, CircleDot,
  Timer, UserCheck, Workflow, CheckCircle2, XCircle, HelpCircle
, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';

// ============================================
// MOCK DATA
// ============================================

const serviceStats = {
  openTickets: 7,
  inProgress: 4,
  awaitingParts: 2,
  closedThisWeek: 12,
  avgResolutionTime: '2.4 days',
  slaCompliance: 94
};

const safetyStats = {
  openEvents: 2,
  pendingReview: 2,
  escalated: 0,
  resolvedThisWeek: 8,
  avgResponseTime: '18 min',
  eventsPer1000Miles: 2.4
};

const maintenanceStats = {
  scheduledThisWeek: 6,
  overdueCount: 1,
  completedThisMonth: 23,
  upcomingCalibrations: 3
};

const serviceTickets = [
  {
    id: 'SVC-4527',
    asset: 'TSD-1247',
    assetType: 'Titan Spike Driver',
    title: 'Hydraulic pressure fluctuation',
    status: 'in_progress',
    priority: 'high',
    category: 'Hydraulic System',
    created: '2 hours ago',
    assignee: 'Mike Chen',
    location: 'BNSF Southwest Division',
    description: 'Intermittent pressure drops during operation. May require seal replacement.',
    updates: 3
  },
  {
    id: 'SVC-4525',
    asset: 'GSP-0892',
    assetType: 'Gorilla Spike Puller',
    title: 'Workhead cycle counter malfunction',
    status: 'awaiting_parts',
    priority: 'medium',
    category: 'Telematics',
    created: '1 day ago',
    assignee: 'Sarah Johnson',
    location: 'UP Denver Region',
    description: 'Counter showing incorrect readings. Sensor replacement ordered.',
    updates: 5
  },
  {
    id: 'SVC-4523',
    asset: 'RRL-0156',
    assetType: 'Raptor Rail Lifter',
    title: 'GPS signal intermittent',
    status: 'open',
    priority: 'low',
    category: 'Telematics',
    created: '2 days ago',
    assignee: null,
    location: 'CSX Southeast',
    description: 'GPS dropping signal in certain areas. Antenna inspection needed.',
    updates: 1
  },
  {
    id: 'SVC-4521',
    asset: 'TSD-1247',
    assetType: 'Titan Spike Driver',
    title: 'Hydraulic line repair',
    status: 'resolved',
    priority: 'critical',
    category: 'Hydraulic System',
    created: '3 days ago',
    assignee: 'Mike Chen',
    location: 'BNSF Southwest Division',
    description: 'Emergency repair completed. Line replaced and tested.',
    updates: 8,
    resolvedAt: '12 hours ago'
  },
  {
    id: 'SVC-4519',
    asset: 'DSP-0421',
    assetType: 'Dragon Spike Puller',
    title: 'Control panel display flickering',
    status: 'in_progress',
    priority: 'medium',
    category: 'Electrical',
    created: '3 days ago',
    assignee: 'Tom Wilson',
    location: 'NS Chicago Hub',
    description: 'Display intermittently flickering. Checking connections.',
    updates: 4
  },
  {
    id: 'SVC-4517',
    asset: 'BTN-0089',
    assetType: 'BTN Spike Driver',
    title: 'Engine temperature warning',
    status: 'open',
    priority: 'high',
    category: 'Engine',
    created: '4 days ago',
    assignee: 'Sarah Johnson',
    location: 'KCS Southern Region',
    description: 'Temp gauge showing elevated readings. Coolant system check required.',
    updates: 2
  },
  {
    id: 'SVC-4515',
    asset: 'GSP-0734',
    assetType: 'Gorilla Spike Puller',
    title: 'Annual inspection due',
    status: 'scheduled',
    priority: 'low',
    category: 'Inspection',
    created: '5 days ago',
    assignee: 'Field Team Alpha',
    location: 'BNSF Southwest Division',
    description: 'Routine annual inspection. Scheduled for next week.',
    updates: 1,
    scheduledFor: 'Jan 8, 2026'
  }
];

const safetyEvents = [
  {
    id: 'EVT-2847',
    asset: 'TSD-1247',
    assetType: 'Titan Spike Driver',
    type: 'Auto-Stop Triggered',
    severity: 'high',
    status: 'pending_review',
    timestamp: 'Today, 10:23 AM',
    cause: 'Obstruction detected - Equipment',
    location: 'Mile 142.1',
    hasVideo: true
  },
  {
    id: 'EVT-2846',
    asset: 'TSD-1247',
    assetType: 'Titan Spike Driver',
    type: 'Proximity Alert',
    severity: 'medium',
    status: 'pending_review',
    timestamp: 'Today, 8:47 AM',
    cause: 'Personnel in work zone',
    location: 'Mile 141.8',
    hasVideo: true
  }
];

const scheduledMaintenance = [
  {
    id: 'MNT-1247',
    asset: 'TSD-1198',
    assetType: 'Titan Spike Driver',
    type: 'Workhead Service',
    date: 'Jan 6, 2026',
    time: '8:00 AM',
    location: 'KCS Laredo Yard',
    assignee: 'Field Team Beta',
    status: 'scheduled',
    cyclesBased: true,
    cyclesRemaining: 847
  },
  {
    id: 'MNT-1246',
    asset: 'GSP-0892',
    assetType: 'Gorilla Spike Puller',
    type: 'Hydraulic Fluid Change',
    date: 'Jan 7, 2026',
    time: '9:00 AM',
    location: 'UP Denver Yard',
    assignee: 'Mike Chen',
    status: 'scheduled',
    cyclesBased: false
  },
  {
    id: 'MNT-1245',
    asset: 'RRL-0156',
    assetType: 'Raptor Rail Lifter',
    type: 'LiDAR Calibration',
    date: 'Jan 8, 2026',
    time: '7:30 AM',
    location: 'CSX Atlanta Terminal',
    assignee: 'Safety Team',
    status: 'scheduled',
    cyclesBased: false
  },
  {
    id: 'MNT-1244',
    asset: 'DSP-0421',
    assetType: 'Dragon Spike Puller',
    type: 'Annual Inspection',
    date: 'Jan 8, 2026',
    time: '10:00 AM',
    location: 'NS Chicago Hub',
    assignee: 'Field Team Alpha',
    status: 'scheduled',
    cyclesBased: false
  },
  {
    id: 'MNT-1243',
    asset: 'TSD-1247',
    assetType: 'Titan Spike Driver',
    type: 'Safety System Check',
    date: 'Jan 10, 2026',
    time: '8:00 AM',
    location: 'BNSF Mile 142',
    assignee: 'Safety Team',
    status: 'scheduled',
    cyclesBased: false
  },
  {
    id: 'MNT-1240',
    asset: 'BTN-0089',
    assetType: 'BTN Spike Driver',
    type: 'Engine Service',
    date: 'Dec 28, 2025',
    time: '8:00 AM',
    location: 'KCS Laredo Yard',
    assignee: 'Field Team Beta',
    status: 'overdue',
    cyclesBased: false
  }
];

const alertConfigurations = [
  { id: 1, name: 'Critical equipment down', enabled: true, channels: ['email', 'sms', 'push'], recipients: 12 },
  { id: 2, name: 'Safety event - Auto-stop', enabled: true, channels: ['email', 'sms', 'push'], recipients: 8 },
  { id: 3, name: 'Safety event - Near miss', enabled: true, channels: ['email', 'sms', 'push'], recipients: 8 },
  { id: 4, name: 'Maintenance overdue', enabled: true, channels: ['email', 'push'], recipients: 5 },
  { id: 5, name: 'Low fuel alert (<25%)', enabled: true, channels: ['email'], recipients: 3 },
  { id: 6, name: 'Sensor offline', enabled: true, channels: ['email', 'push'], recipients: 4 },
  { id: 7, name: 'Daily fleet summary', enabled: true, channels: ['email'], recipients: 15 },
  { id: 8, name: 'Weekly safety digest', enabled: true, channels: ['email'], recipients: 20 }
];

// ============================================
// COMPONENTS
// ============================================

const StatusBadge = ({ status }) => {
  const styles = {
    open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    in_progress: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    awaiting_parts: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    scheduled: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    pending_review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    acknowledged: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    escalated: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    overdue: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };
  const labels = {
    open: 'Open',
    in_progress: 'In Progress',
    awaiting_parts: 'Awaiting Parts',
    scheduled: 'Scheduled',
    resolved: 'Resolved',
    closed: 'Closed',
    pending_review: 'Pending Review',
    acknowledged: 'Acknowledged',
    escalated: 'Escalated',
    overdue: 'Overdue'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    critical: 'bg-rose-500/20 text-rose-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-slate-500/20 text-slate-400'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${styles[priority]}`}>
      {priority}
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

const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
      active 
        ? 'border-amber-500 text-amber-500' 
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
    }`}
  >
    {children}
    {count !== undefined && (
      <span className={`px-1.5 py-0.5 rounded text-xs ${active ? 'bg-amber-500/20' : 'bg-slate-700'}`}>
        {count}
      </span>
    )}
  </button>
);

const StatCard = ({ icon: Icon, label, value, subtext, color = 'amber', trend }) => {
  const colorClasses = {
    amber: 'text-amber-500 bg-amber-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    cyan: 'text-cyan-500 bg-cyan-500/10'
  };
  const colorClass = colorClasses[color] || colorClasses.amber;
  const textColor = colorClass.split(' ')[0];
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className={`w-4 h-4 ${textColor}`} />
        </div>
        {trend && (
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
      {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
    </div>
  );
};

const TicketRow = ({ ticket }) => (
  <div className="p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/80 transition-colors cursor-pointer border border-slate-700/30 hover:border-slate-600/50">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          ticket.priority === 'critical' ? 'bg-rose-500/20' :
          ticket.priority === 'high' ? 'bg-orange-500/20' :
          ticket.priority === 'medium' ? 'bg-amber-500/20' : 'bg-slate-700/50'
        }`}>
          <Wrench className={`w-5 h-5 ${
            ticket.priority === 'critical' ? 'text-rose-400' :
            ticket.priority === 'high' ? 'text-orange-400' :
            ticket.priority === 'medium' ? 'text-amber-400' : 'text-slate-400'
          }`} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">{ticket.id}</span>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-sm text-slate-300">{ticket.title}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500">{ticket.created}</p>
        {ticket.updates > 0 && (
          <p className="text-xs text-amber-400 mt-1">{ticket.updates} updates</p>
        )}
      </div>
    </div>
    <div className="flex items-center justify-between text-xs text-slate-500">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Truck className="w-3 h-3" />
          {ticket.asset}
        </span>
        <span className="flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {ticket.category}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {ticket.location}
        </span>
      </div>
      {ticket.assignee ? (
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {ticket.assignee}
        </span>
      ) : (
        <span className="text-amber-400">Unassigned</span>
      )}
    </div>
  </div>
);

const SafetyEventRow = ({ event }) => (
  <div className="p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/80 transition-colors cursor-pointer border border-slate-700/30 hover:border-slate-600/50">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          event.severity === 'critical' ? 'bg-rose-500/20' :
          event.severity === 'high' ? 'bg-orange-500/20' : 'bg-amber-500/20'
        }`}>
          <Shield className={`w-5 h-5 ${
            event.severity === 'critical' ? 'text-rose-400' :
            event.severity === 'high' ? 'text-orange-400' : 'text-amber-400'
          }`} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">{event.id}</span>
            <SeverityBadge severity={event.severity} />
            <StatusBadge status={event.status} />
          </div>
          <p className="text-sm text-slate-300">{event.type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500">{event.timestamp}</p>
        {event.hasVideo && (
          <span className="text-xs text-amber-400">Video available</span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-4 text-xs text-slate-500">
      <span className="flex items-center gap-1">
        <Truck className="w-3 h-3" />
        {event.asset}
      </span>
      <span className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {event.cause}
      </span>
      <span className="flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {event.location}
      </span>
    </div>
  </div>
);

const MaintenanceRow = ({ item }) => (
  <div className={`p-4 rounded-lg border transition-colors cursor-pointer ${
    item.status === 'overdue' 
      ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50' 
      : 'bg-slate-900/50 border-slate-700/30 hover:border-slate-600/50'
  }`}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          item.status === 'overdue' ? 'bg-rose-500/20' : 'bg-cyan-500/20'
        }`}>
          <Calendar className={`w-5 h-5 ${item.status === 'overdue' ? 'text-rose-400' : 'text-cyan-400'}`} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">{item.type}</span>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-sm text-slate-400">{item.asset} • {item.assetType}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${item.status === 'overdue' ? 'text-rose-400' : 'text-white'}`}>
          {item.date}
        </p>
        <p className="text-xs text-slate-500">{item.time}</p>
      </div>
    </div>
    <div className="flex items-center justify-between text-xs text-slate-500">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {item.location}
        </span>
        {item.cyclesBased && (
          <span className="flex items-center gap-1 text-amber-400">
            <Zap className="w-3 h-3" />
            {item.cyclesRemaining} cycles remaining
          </span>
        )}
      </div>
      <span className="flex items-center gap-1">
        <Users className="w-3 h-3" />
        {item.assignee}
      </span>
    </div>
  </div>
);

const AlertConfigRow = ({ config }) => (
  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-5 rounded-full relative cursor-pointer transition-colors ${
        config.enabled ? 'bg-amber-500' : 'bg-slate-600'
      }`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          config.enabled ? 'translate-x-3.5' : 'translate-x-0.5'
        }`} />
      </div>
      <span className="text-sm text-slate-200">{config.name}</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {config.channels.includes('email') && (
          <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">Email</span>
        )}
        {config.channels.includes('sms') && (
          <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">SMS</span>
        )}
        {config.channels.includes('push') && (
          <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">Push</span>
        )}
      </div>
      <span className="text-xs text-slate-500">{config.recipients} recipients</span>
      <button className="p-1 hover:bg-slate-700 rounded">
        <Settings className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function ServiceSafetyCenterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('tickets');
  const [ticketFilter, setTicketFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ asset: '', issue: '', priority: 'medium', description: '' });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredTickets = ticketFilter === 'all' 
    ? serviceTickets 
    : serviceTickets.filter(t => t.status === ticketFilter);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setSubmitSuccess(false);
      setReportForm({ asset: '', issue: '', priority: 'medium', description: '' });
    }, 1500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`} style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}>
      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="relative bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Report an Issue</h2>
                <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            {submitSuccess ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Issue Reported!</h3>
                <p className="text-slate-400">Your ticket has been created and assigned.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Asset ID</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                    value={reportForm.asset}
                    onChange={(e) => setReportForm({...reportForm, asset: e.target.value})}
                    required
                  >
                    <option value="">Select an asset...</option>
                    <option value="TSD-1247">TSD-1247 - Titan Spike Driver</option>
                    <option value="GSP-0892">GSP-0892 - Gorilla Spike Puller</option>
                    <option value="RRL-0156">RRL-0156 - Raptor Rail Lifter</option>
                    <option value="DSP-0421">DSP-0421 - Dragon Spike Puller</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Issue Type</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                    value={reportForm.issue}
                    onChange={(e) => setReportForm({...reportForm, issue: e.target.value})}
                    required
                  >
                    <option value="">Select issue type...</option>
                    <option value="mechanical">Mechanical Issue</option>
                    <option value="electrical">Electrical Issue</option>
                    <option value="hydraulic">Hydraulic Issue</option>
                    <option value="safety">Safety Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <div className="flex gap-3">
                    {['low', 'medium', 'high', 'critical'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setReportForm({...reportForm, priority: p})}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          reportForm.priority === p 
                            ? p === 'critical' ? 'bg-rose-500 text-white' :
                              p === 'high' ? 'bg-orange-500 text-white' :
                              p === 'medium' ? 'bg-amber-500 text-slate-900' :
                              'bg-blue-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none h-24 resize-none"
                    placeholder="Describe the issue..."
                    value={reportForm.description}
                    onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-medium transition-colors">
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
                placeholder="Search tickets, events, maintenance..."
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
            <NavItem to="/fleet" icon={Truck} label="Fleet & Assets" />
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
            <NavItem to="/safety" icon={Shield} label="Safety Center" badge="2" />
            <NavItem to="/service" icon={Wrench} label="Service & Maintenance" active badge="7" />
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
                <h2 className="text-2xl font-bold text-white">Service & Safety Center</h2>
                <p className="text-slate-400 mt-1">Manage service tickets, safety events, and maintenance schedules</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Ticket
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard 
                icon={Inbox} 
                label="Open Service Tickets" 
                value={serviceStats.openTickets}
                color="amber"
              />
              <StatCard 
                icon={Shield} 
                label="Safety Events Pending" 
                value={safetyStats.openEvents}
                color="rose"
              />
              <StatCard 
                icon={Calendar} 
                label="Scheduled Maintenance" 
                value={maintenanceStats.scheduledThisWeek}
                subtext={maintenanceStats.overdueCount > 0 ? `${maintenanceStats.overdueCount} overdue` : undefined}
                color="cyan"
              />
              <StatCard 
                icon={CheckCircle2} 
                label="SLA Compliance" 
                value={`${serviceStats.slaCompliance}%`}
                color="emerald"
                trend="+2%"
              />
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700/50 mb-6">
              <div className="flex gap-1">
                <TabButton active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} count={serviceStats.openTickets}>
                  <Wrench className="w-4 h-4" /> Service Tickets
                </TabButton>
                <TabButton active={activeTab === 'safety'} onClick={() => setActiveTab('safety')} count={safetyStats.openEvents}>
                  <Shield className="w-4 h-4" /> Safety Events
                </TabButton>
                <TabButton active={activeTab === 'maintenance'} onClick={() => setActiveTab('maintenance')} count={maintenanceStats.scheduledThisWeek}>
                  <Calendar className="w-4 h-4" /> Scheduled Maintenance
                </TabButton>
                <TabButton active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')}>
                  <Bell className="w-4 h-4" /> Alert Configuration
                </TabButton>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setTicketFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        ticketFilter === 'all' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      All ({serviceTickets.length})
                    </button>
                    <button 
                      onClick={() => setTicketFilter('open')}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        ticketFilter === 'open' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Open ({serviceTickets.filter(t => t.status === 'open').length})
                    </button>
                    <button 
                      onClick={() => setTicketFilter('in_progress')}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        ticketFilter === 'in_progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      In Progress ({serviceTickets.filter(t => t.status === 'in_progress').length})
                    </button>
                    <button 
                      onClick={() => setTicketFilter('awaiting_parts')}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        ticketFilter === 'awaiting_parts' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Awaiting Parts ({serviceTickets.filter(t => t.status === 'awaiting_parts').length})
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                      <option>All Priorities</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                      <option>All Categories</option>
                      <option>Hydraulic System</option>
                      <option>Telematics</option>
                      <option>Electrical</option>
                      <option>Engine</option>
                    </select>
                  </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-3">
                  {filteredTickets.map(ticket => (
                    <TicketRow key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-6">
                {/* Safety Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <StatCard icon={AlertTriangle} label="Pending Review" value={safetyStats.pendingReview} color="amber" />
                  <StatCard icon={Flag} label="Escalated" value={safetyStats.escalated} color="rose" />
                  <StatCard icon={Timer} label="Avg Response Time" value={safetyStats.avgResponseTime} color="blue" />
                  <StatCard icon={Target} label="Events per 1K Miles" value={safetyStats.eventsPer1000Miles} color="purple" />
                </div>

                {/* Events List */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Events Requiring Attention</h3>
                  <div className="space-y-3">
                    {safetyEvents.map(event => (
                      <SafetyEventRow key={event.id} event={event} />
                    ))}
                  </div>
                  {safetyEvents.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                      <p>All safety events have been reviewed</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                {/* Maintenance Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <StatCard icon={Calendar} label="Scheduled This Week" value={maintenanceStats.scheduledThisWeek} color="cyan" />
                  <StatCard icon={AlertCircle} label="Overdue" value={maintenanceStats.overdueCount} color="rose" />
                  <StatCard icon={CheckCircle} label="Completed This Month" value={maintenanceStats.completedThisMonth} color="emerald" />
                  <StatCard icon={Radio} label="Upcoming Calibrations" value={maintenanceStats.upcomingCalibrations} color="purple" />
                </div>

                {/* Calendar View Toggle */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Upcoming Maintenance</h3>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-sm">List</button>
                    <button className="px-3 py-1.5 bg-slate-700/50 text-slate-400 rounded-lg text-sm hover:bg-slate-700">Calendar</button>
                  </div>
                </div>

                {/* Maintenance List */}
                <div className="space-y-3">
                  {scheduledMaintenance.map(item => (
                    <MaintenanceRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Alert Rules</h3>
                    <button className="text-amber-500 text-sm hover:text-amber-400 flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Add Rule
                    </button>
                  </div>
                  <div className="space-y-2">
                    {alertConfigurations.map(config => (
                      <AlertConfigRow key={config.id} config={config} />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Escalation Contacts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Operations Manager</p>
                          <p className="text-xs text-slate-500">Primary escalation contact</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">On-call</span>
                        <button className="p-2 hover:bg-slate-700 rounded">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Safety Team</p>
                          <p className="text-xs text-slate-500">Safety event escalations</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Available</span>
                        <button className="p-2 hover:bg-slate-700 rounded">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">MOW Equipment Support</p>
                          <p className="text-xs text-slate-500">Technical support hotline</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">855-669-4264</span>
                        <button className="p-2 hover:bg-slate-700 rounded">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
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
    </div>
  );
}
