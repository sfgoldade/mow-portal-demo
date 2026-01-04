import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, ArrowDown, ArrowUp, ArrowUpRight, BarChart3,
  Bell, Calendar, ChevronDown, Clock, Download, FileText, Filter,
  Gauge, Layers, MapPin, Menu, Package, PieChart, RefreshCw, Search,
  Settings, Shield, Sliders, Target, Timer, TrendingDown, TrendingUp,
  Truck, User, Wrench, Zap
, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';

// Mock Data
const kpiData = {
  fleetUtilization: { value: 81, change: 4.2, trend: 'up' },
  totalWorkHours: { value: 12847, change: 8.7, trend: 'up' },
  cyclesCompleted: { value: 284650, change: 12.3, trend: 'up' },
  milesTracked: { value: 18420, change: 5.1, trend: 'up' },
  avgDowntime: { value: 2.4, change: -15.2, trend: 'down' },
  safetyScore: { value: 94.2, change: 2.1, trend: 'up' }
};

const utilizationByType = [
  { type: 'Titan Spike Driver', code: 'TSD', utilization: 86, count: 14, color: '#f59e0b' },
  { type: 'Gorilla Spike Puller', code: 'GSP', utilization: 82, count: 11, color: '#10b981' },
  { type: 'Dragon Spike Puller', code: 'DSP', utilization: 79, count: 8, color: '#3b82f6' },
  { type: 'Raptor Rail Lifter', code: 'RRL', utilization: 77, count: 9, color: '#8b5cf6' },
  { type: 'BTN Spike Driver', code: 'BTN', utilization: 71, count: 5, color: '#ec4899' }
];

const monthlyTrends = [
  { month: 'Jul', workHours: 11200, cycles: 245000, utilization: 74 },
  { month: 'Aug', workHours: 11800, cycles: 258000, utilization: 76 },
  { month: 'Sep', workHours: 12100, cycles: 262000, utilization: 78 },
  { month: 'Oct', workHours: 12400, cycles: 271000, utilization: 79 },
  { month: 'Nov', workHours: 12600, cycles: 278000, utilization: 80 },
  { month: 'Dec', workHours: 12847, cycles: 284650, utilization: 81 }
];

const dailyActivity = [
  { day: 'Mon', work: 1842, idle: 412, down: 86 },
  { day: 'Tue', work: 1756, idle: 498, down: 142 },
  { day: 'Wed', work: 1898, idle: 378, down: 64 },
  { day: 'Thu', work: 1654, idle: 524, down: 218 },
  { day: 'Fri', work: 1812, idle: 445, down: 98 },
  { day: 'Sat', work: 892, idle: 234, down: 42 },
  { day: 'Sun', work: 245, idle: 78, down: 12 }
];

const topPerformers = [
  { id: 'TSD-1247', type: 'Titan Spike Driver', utilization: 94, cycles: 12450, location: 'BNSF Southwest' },
  { id: 'GSP-0892', type: 'Gorilla Spike Puller', utilization: 92, cycles: 11280, location: 'UP Denver' },
  { id: 'TSD-1198', type: 'Titan Spike Driver', utilization: 91, cycles: 11890, location: 'KCS Southern' },
  { id: 'RRL-0156', type: 'Raptor Rail Lifter', utilization: 89, cycles: 8920, location: 'CSX Southeast' },
  { id: 'DSP-0421', type: 'Dragon Spike Puller', utilization: 88, cycles: 10540, location: 'NS Chicago' }
];

const needsAttention = [
  { id: 'BTN-0089', type: 'BTN Spike Driver', utilization: 42, issue: 'Extended downtime - engine repairs', days: 4 },
  { id: 'GSP-0734', type: 'Gorilla Spike Puller', utilization: 51, issue: 'Below target utilization', days: 7 },
  { id: 'RRL-0203', type: 'Raptor Rail Lifter', utilization: 54, issue: 'Frequent idle periods', days: 3 }
];

const safetyTrends = [
  { month: 'Jul', events: 18, autoStops: 12, nearMisses: 4 },
  { month: 'Aug', events: 15, autoStops: 10, nearMisses: 3 },
  { month: 'Sep', events: 14, autoStops: 9, nearMisses: 3 },
  { month: 'Oct', events: 12, autoStops: 8, nearMisses: 2 },
  { month: 'Nov', events: 11, autoStops: 7, nearMisses: 2 },
  { month: 'Dec', events: 12, autoStops: 8, nearMisses: 3 }
];

// Components
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

const KPICard = ({ icon: Icon, label, value, unit, change, trend, color = 'amber' }) => {
  const colors = {
    amber: 'text-amber-500 bg-amber-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    rose: 'text-rose-500 bg-rose-500/10'
  };
  const colorClass = colors[color] || colors.amber;
  
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorClass}`}>
          <Icon className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</span>
        {unit && <span className="text-slate-400">{unit}</span>}
      </div>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
};

const BarChart = ({ data, dataKey, maxValue, color = '#f59e0b', height = 120 }) => {
  const max = maxValue || Math.max(...data.map(d => d[dataKey]));
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className="w-full rounded-t transition-all duration-500 hover:opacity-80"
            style={{ 
              height: `${(item[dataKey] / max) * 100}%`,
              backgroundColor: color,
              minHeight: 4
            }}
          />
          <span className="text-xs text-slate-500">{item.month || item.day}</span>
        </div>
      ))}
    </div>
  );
};

const StackedBarChart = ({ data, height = 140 }) => {
  const max = Math.max(...data.map(d => d.work + d.idle + d.down));
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => {
        const total = item.work + item.idle + item.down;
        const workPct = (item.work / total) * 100;
        const idlePct = (item.idle / total) * 100;
        const downPct = (item.down / total) * 100;
        const barHeight = (total / max) * 100;
        
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full rounded-t overflow-hidden flex flex-col"
              style={{ height: `${barHeight}%`, minHeight: 20 }}
            >
              <div className="bg-emerald-500 transition-all" style={{ height: `${workPct}%` }} />
              <div className="bg-amber-500 transition-all" style={{ height: `${idlePct}%` }} />
              <div className="bg-rose-500 transition-all" style={{ height: `${downPct}%` }} />
            </div>
            <span className="text-xs text-slate-500">{item.day}</span>
          </div>
        );
      })}
    </div>
  );
};

const HorizontalBar = ({ label, value, max, color, showValue = true }) => {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        {showValue && <span className="text-slate-400">{value}%</span>}
      </div>
      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const MiniLineChart = ({ data, dataKey, color = '#f59e0b', height = 40, width = 100 }) => {
  const values = data.map(d => d[dataKey]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 8) - 4;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill={color}
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        );
      })}
    </svg>
  );
};

const DonutChart = ({ segments, size = 120, strokeWidth = 16 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  let offset = 0;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {segments.map((seg, i) => {
          const segmentLength = (seg.value / 100) * circumference;
          const currentOffset = offset;
          offset += segmentLength;
          
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
};

// Main Component
export default function AnalyticsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [timeRange, setTimeRange] = useState('30d');

  const utilizationSegments = [
    { value: 81, color: '#10b981', label: 'Active' },
    { value: 12.5, color: '#f59e0b', label: 'Idle' },
    { value: 6.5, color: '#ef4444', label: 'Down' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`} style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}>
      {/* Header */}
      <header className={`h-16 border-b backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-colors ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
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
              <input type="text" placeholder="Search..." className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
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
            <NavItem to="/analytics" icon={BarChart3} label="Analytics" active />
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
                <h2 className="text-2xl font-bold text-white">Fleet Analytics</h2>
                <p className="text-slate-400 mt-1">Performance insights and operational trends</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1">
                  {['7d', '30d', '90d', 'YTD'].map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 rounded text-sm transition-colors ${
                        timeRange === range 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              <KPICard icon={Gauge} label="Fleet Utilization" value={kpiData.fleetUtilization.value} unit="%" change={kpiData.fleetUtilization.change} trend="up" color="emerald" />
              <KPICard icon={Timer} label="Total Work Hours" value={kpiData.totalWorkHours.value} unit="hrs" change={kpiData.totalWorkHours.change} trend="up" />
              <KPICard icon={Zap} label="Cycles Completed" value={(kpiData.cyclesCompleted.value / 1000).toFixed(0) + 'K'} change={kpiData.cyclesCompleted.change} trend="up" />
              <KPICard icon={MapPin} label="Miles Tracked" value={(kpiData.milesTracked.value / 1000).toFixed(1) + 'K'} unit="mi" change={kpiData.milesTracked.change} trend="up" color="blue" />
              <KPICard icon={Clock} label="Avg Downtime" value={kpiData.avgDowntime.value} unit="hrs/day" change={Math.abs(kpiData.avgDowntime.change)} trend="down" color="emerald" />
              <KPICard icon={Shield} label="Safety Score" value={kpiData.safetyScore.value} unit="%" change={kpiData.safetyScore.change} trend="up" color="emerald" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Utilization by Type */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Utilization by Equipment Type</h3>
                <div className="space-y-4">
                  {utilizationByType.map(item => (
                    <HorizontalBar 
                      key={item.code}
                      label={`${item.code} (${item.count})`}
                      value={item.utilization}
                      max={100}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Utilization Trend</h3>
                  <MiniLineChart data={monthlyTrends} dataKey="utilization" height={30} width={80} color="#10b981" />
                </div>
                <BarChart data={monthlyTrends} dataKey="utilization" maxValue={100} color="#10b981" height={140} />
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
                  <span>6-month trend</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    +7% improvement
                  </span>
                </div>
              </div>

              {/* Fleet Status Breakdown */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Fleet Status Distribution</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <DonutChart segments={utilizationSegments} size={140} strokeWidth={20} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">47</span>
                      <span className="text-xs text-slate-400">Assets</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-slate-300">Active 81%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-slate-300">Idle 12.5%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-sm text-slate-300">Down 6.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Daily Activity Breakdown */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Weekly Activity Breakdown</h3>
                <StackedBarChart data={dailyActivity} height={160} />
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-slate-400">Work Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-slate-400">Idle Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-sm text-slate-400">Down Hours</span>
                  </div>
                </div>
              </div>

              {/* Safety Trends */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Safety Event Trends</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-white">12</p>
                    <p className="text-xs text-slate-400">Total Events</p>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-400">8</p>
                    <p className="text-xs text-slate-400">Auto-Stops</p>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-2xl font-bold text-rose-400">3</p>
                    <p className="text-xs text-slate-400">Near Misses</p>
                  </div>
                </div>
                <BarChart data={safetyTrends} dataKey="events" color="#f59e0b" height={100} />
                <div className="flex items-center justify-center gap-1 mt-3 text-xs text-emerald-400">
                  <TrendingDown className="w-3 h-3" />
                  <span>33% reduction in safety events (6 months)</span>
                </div>
              </div>
            </div>

            {/* Performance Tables */}
            <div className="grid grid-cols-2 gap-6">
              {/* Top Performers */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Top Performers</h3>
                  <span className="text-xs text-emerald-400">Above 85% utilization</span>
                </div>
                <div className="space-y-3">
                  {topPerformers.map((asset, i) => (
                    <div key={asset.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{asset.id}</span>
                          <span className="text-emerald-400 font-medium">{asset.utilization}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{asset.type}</span>
                          <span>{asset.cycles.toLocaleString()} cycles</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Attention */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Needs Attention</h3>
                  <span className="text-xs text-rose-400">Below 60% utilization</span>
                </div>
                <div className="space-y-3">
                  {needsAttention.map(asset => (
                    <div key={asset.id} className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{asset.id}</span>
                          <span className="text-rose-400 font-medium">{asset.utilization}%</span>
                        </div>
                        <p className="text-xs text-slate-400">{asset.issue}</p>
                        <p className="text-xs text-slate-500">{asset.days} days below target</p>
                      </div>
                    </div>
                  ))}
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
