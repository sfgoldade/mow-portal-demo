import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, BarChart3, Bell, Book, BookOpen, Calendar,
  CheckCircle, ChevronDown, ChevronRight, Clock, ClipboardCheck, Download,
  Eye, File, FileCheck, FileText, FilePlus, Filter, Folder, FolderOpen,
  Grid, Hash, Image, List, MapPin, Menu, Package, Printer, RefreshCw,
  Search, Settings, Shield, Star, Tag, Truck, Upload, User, Wrench, X
, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';

// Mock Data
const documentStats = {
  totalDocuments: 284,
  recentlyAdded: 12,
  expiringThisMonth: 3,
  pendingReview: 5
};

const folders = [
  { id: 'manuals', name: 'Equipment Manuals', icon: Book, count: 47, color: 'blue' },
  { id: 'inspection', name: 'Inspection Reports', icon: ClipboardCheck, count: 156, color: 'emerald' },
  { id: 'compliance', name: 'Compliance & Certifications', icon: FileCheck, count: 32, color: 'amber' },
  { id: 'safety', name: 'Safety Documentation', icon: Shield, count: 28, color: 'rose' },
  { id: 'maintenance', name: 'Maintenance Records', icon: Wrench, count: 89, color: 'purple' },
  { id: 'training', name: 'Training Materials', icon: BookOpen, count: 18, color: 'cyan' }
];

const recentDocuments = [
  { 
    id: 'DOC-2847',
    name: 'TSD-1247 Annual Inspection Report',
    type: 'PDF',
    folder: 'Inspection Reports',
    asset: 'TSD-1247',
    uploadedBy: 'J. Martinez',
    uploadedAt: 'Jan 2, 2026',
    size: '2.4 MB',
    status: 'current'
  },
  { 
    id: 'DOC-2845',
    name: 'Titan Spike Driver Service Manual v4.2',
    type: 'PDF',
    folder: 'Equipment Manuals',
    asset: null,
    uploadedBy: 'MOW Equipment',
    uploadedAt: 'Dec 28, 2025',
    size: '18.7 MB',
    status: 'current'
  },
  { 
    id: 'DOC-2843',
    name: 'LiDAR Calibration Certificate - RRL-0156',
    type: 'PDF',
    folder: 'Compliance & Certifications',
    asset: 'RRL-0156',
    uploadedBy: 'Safety Team',
    uploadedAt: 'Dec 22, 2025',
    size: '156 KB',
    status: 'current',
    expiresAt: 'Jun 22, 2026'
  },
  { 
    id: 'DOC-2841',
    name: 'GSP-0892 Pre-Operation Checklist',
    type: 'PDF',
    folder: 'Safety Documentation',
    asset: 'GSP-0892',
    uploadedBy: 'R. Thompson',
    uploadedAt: 'Dec 20, 2025',
    size: '342 KB',
    status: 'current'
  },
  { 
    id: 'DOC-2839',
    name: 'Hydraulic System Troubleshooting Guide',
    type: 'PDF',
    folder: 'Equipment Manuals',
    asset: null,
    uploadedBy: 'MOW Equipment',
    uploadedAt: 'Dec 18, 2025',
    size: '5.2 MB',
    status: 'current'
  },
  { 
    id: 'DOC-2837',
    name: 'FRA Compliance Audit Results - Q4 2025',
    type: 'PDF',
    folder: 'Compliance & Certifications',
    asset: null,
    uploadedBy: 'Compliance Officer',
    uploadedAt: 'Dec 15, 2025',
    size: '1.8 MB',
    status: 'current'
  }
];

const expiringCertificates = [
  { id: 'CERT-0124', name: 'Auto-Brake System Certification', asset: 'TSD-1247', expiresAt: 'Jan 15, 2026', daysRemaining: 12 },
  { id: 'CERT-0118', name: 'Operator Safety Certification', asset: 'GSP-0892', expiresAt: 'Jan 22, 2026', daysRemaining: 19 },
  { id: 'CERT-0115', name: 'LiDAR Calibration Certificate', asset: 'DSP-0421', expiresAt: 'Jan 28, 2026', daysRemaining: 25 }
];

const assetDocuments = {
  'TSD-1247': [
    { name: 'Annual Inspection Report 2025', date: 'Jan 2, 2026', type: 'Inspection' },
    { name: 'Service Manual', date: 'Mar 2019', type: 'Manual' },
    { name: 'Auto-Brake Certification', date: 'Jan 15, 2025', type: 'Certificate' },
    { name: 'Maintenance Log', date: 'Ongoing', type: 'Record' }
  ]
};

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

const StatCard = ({ icon: Icon, label, value, color = 'amber', alert }) => {
  const colors = {
    amber: 'text-amber-500 bg-amber-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
    blue: 'text-blue-500 bg-blue-500/10'
  };
  const colorClass = colors[color] || colors.amber;
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
        </div>
        {alert && <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-xs">{alert}</span>}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
};

const FolderCard = ({ folder, onClick }) => {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/20'
  };
  const Icon = folder.icon;
  
  return (
    <button 
      onClick={onClick}
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-amber-500/30 transition-all text-left group"
    >
      <div className={`w-12 h-12 rounded-lg ${colors[folder.color]} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-medium text-white mb-1">{folder.name}</h3>
      <p className="text-sm text-slate-500">{folder.count} documents</p>
    </button>
  );
};

const DocumentRow = ({ doc, view }) => {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText className="w-5 h-5 text-rose-400" />;
      case 'DOC': return <File className="w-5 h-5 text-blue-400" />;
      case 'IMG': return <Image className="w-5 h-5 text-emerald-400" />;
      default: return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  if (view === 'grid') {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-amber-500/30 transition-all cursor-pointer group">
        <div className="flex items-center justify-center h-24 bg-slate-900/50 rounded-lg mb-3">
          <FileText className="w-12 h-12 text-slate-600 group-hover:text-amber-500/50 transition-colors" />
        </div>
        <h4 className="font-medium text-white text-sm truncate mb-1">{doc.name}</h4>
        <p className="text-xs text-slate-500">{doc.uploadedAt} • {doc.size}</p>
        {doc.asset && (
          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">
            <Truck className="w-3 h-3" />
            {doc.asset}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/80 transition-colors cursor-pointer group">
      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
        {getTypeIcon(doc.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate">{doc.name}</h4>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{doc.folder}</span>
          {doc.asset && (
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {doc.asset}
            </span>
          )}
        </div>
      </div>
      <div className="text-right text-sm">
        <p className="text-slate-300">{doc.uploadedAt}</p>
        <p className="text-xs text-slate-500">{doc.uploadedBy}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-400">{doc.size}</p>
        {doc.expiresAt && (
          <p className="text-xs text-amber-400">Expires {doc.expiresAt}</p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-slate-700 rounded transition-colors" title="View">
          <Eye className="w-4 h-4 text-slate-400" />
        </button>
        <button className="p-2 hover:bg-slate-700 rounded transition-colors" title="Download">
          <Download className="w-4 h-4 text-slate-400" />
        </button>
        <button className="p-2 hover:bg-slate-700 rounded transition-colors" title="Print">
          <Printer className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

const CertificateAlert = ({ cert }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg ${
    cert.daysRemaining <= 14 
      ? 'bg-rose-500/10 border border-rose-500/20' 
      : 'bg-amber-500/10 border border-amber-500/20'
  }`}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
      cert.daysRemaining <= 14 ? 'bg-rose-500/20' : 'bg-amber-500/20'
    }`}>
      <AlertTriangle className={`w-5 h-5 ${cert.daysRemaining <= 14 ? 'text-rose-400' : 'text-amber-400'}`} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-white">{cert.name}</p>
      <p className="text-xs text-slate-400">{cert.asset} • Expires {cert.expiresAt}</p>
    </div>
    <div className="text-right">
      <p className={`text-sm font-medium ${cert.daysRemaining <= 14 ? 'text-rose-400' : 'text-amber-400'}`}>
        {cert.daysRemaining} days
      </p>
      <button className="text-xs text-amber-400 hover:text-amber-300">Renew</button>
    </div>
  </div>
);

// Main Component
export default function DocumentsCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState('list');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
              <input 
                type="text" 
                placeholder="Search documents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50" 
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
            <NavItem to="/service" icon={Wrench} label="Service & Maintenance" badge="7" />
            <NavItem to="/orders" icon={Package} label="Parts & Orders" />
            <NavItem to="/documents" icon={FileText} label="Documents" active />
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  {selectedFolder && (
                    <>
                      <button 
                        onClick={() => setSelectedFolder(null)}
                        className="text-slate-400 hover:text-amber-500 transition-colors"
                      >
                        Documents
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </>
                  )}
                  <h2 className="text-2xl font-bold text-white">
                    {selectedFolder ? folders.find(f => f.id === selectedFolder)?.name : 'Documents'}
                  </h2>
                </div>
                <p className="text-slate-400 mt-1">Manage equipment documentation, manuals, and compliance records</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-sm text-slate-900 font-medium transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
              </div>
            </div>

            {!selectedFolder ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <StatCard icon={FileText} label="Total Documents" value={documentStats.totalDocuments} color="blue" />
                  <StatCard icon={FilePlus} label="Recently Added" value={documentStats.recentlyAdded} color="emerald" />
                  <StatCard icon={AlertTriangle} label="Expiring This Month" value={documentStats.expiringThisMonth} color="rose" alert="Action Required" />
                  <StatCard icon={Clock} label="Pending Review" value={documentStats.pendingReview} color="amber" />
                </div>

                {/* Folders Grid */}
                <div className="mb-8">
                  <h3 className="font-semibold text-white mb-4">Document Categories</h3>
                  <div className="grid grid-cols-6 gap-4">
                    {folders.map(folder => (
                      <FolderCard 
                        key={folder.id} 
                        folder={folder} 
                        onClick={() => setSelectedFolder(folder.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Expiring Certificates Alert */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Expiring Certifications
                    </h3>
                    <button className="text-amber-500 text-sm hover:text-amber-400">View All</button>
                  </div>
                  <div className="space-y-3">
                    {expiringCertificates.map(cert => (
                      <CertificateAlert key={cert.id} cert={cert} />
                    ))}
                  </div>
                </div>

                {/* Recent Documents */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Recent Documents</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-700/50 rounded-lg p-1">
                        <button 
                          onClick={() => setViewMode('list')}
                          className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {viewMode === 'list' ? (
                    <div className="space-y-2">
                      {recentDocuments.map(doc => (
                        <DocumentRow key={doc.id} doc={doc} view="list" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-4">
                      {recentDocuments.map(doc => (
                        <DocumentRow key={doc.id} doc={doc} view="grid" />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Folder View
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                      <option>All Types</option>
                      <option>PDF</option>
                      <option>DOC</option>
                      <option>Image</option>
                    </select>
                    <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                      <option>All Assets</option>
                      <option>TSD-1247</option>
                      <option>GSP-0892</option>
                      <option>RRL-0156</option>
                    </select>
                    <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                      <option>Date: Newest First</option>
                      <option>Date: Oldest First</option>
                      <option>Name: A-Z</option>
                      <option>Name: Z-A</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-700/50 rounded-lg p-1">
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {viewMode === 'list' ? (
                  <div className="space-y-2">
                    {recentDocuments
                      .filter(d => d.folder === folders.find(f => f.id === selectedFolder)?.name)
                      .map(doc => (
                        <DocumentRow key={doc.id} doc={doc} view="list" />
                      ))}
                    {recentDocuments.filter(d => d.folder === folders.find(f => f.id === selectedFolder)?.name).length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <p>No documents in this folder</p>
                        <p className="text-sm">Demo content - showing sample structure</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {recentDocuments
                      .filter(d => d.folder === folders.find(f => f.id === selectedFolder)?.name)
                      .map(doc => (
                        <DocumentRow key={doc.id} doc={doc} view="grid" />
                      ))}
                  </div>
                )}
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
