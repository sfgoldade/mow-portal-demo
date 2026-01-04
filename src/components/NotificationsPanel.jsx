import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, Wrench, Bell, Clock, ChevronRight } from 'lucide-react';

const notifications = [
  { id: 1, type: 'critical', title: 'Hydraulic Alert', message: 'TSD-1247 pressure below threshold', time: '12 min ago', unread: true },
  { id: 2, type: 'critical', title: 'Maintenance Overdue', message: 'GSP-0892 exceeded service interval', time: '34 min ago', unread: true },
  { id: 3, type: 'warning', title: 'GPS Signal Weak', message: 'RRL-0156 intermittent connection', time: '1 hr ago', unread: true },
  { id: 4, type: 'warning', title: 'Low Battery', message: 'DSP-0421 voltage trending low', time: '2 hr ago', unread: false },
  { id: 5, type: 'success', title: 'Service Complete', message: 'BTN-0234 maintenance finished', time: '3 hr ago', unread: false },
  { id: 6, type: 'info', title: 'Shift Change', message: 'Day shift operators logged in', time: '5 hr ago', unread: false },
];

const NotificationsPanel = ({ isOpen, onClose, isDark, onNavigate }) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type) => {
    switch(type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBgColor = (type, isDark) => {
    if (isDark) {
      switch(type) {
        case 'critical': return 'bg-rose-500/10 border-rose-500/20';
        case 'warning': return 'bg-amber-500/10 border-amber-500/20';
        case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
        default: return 'bg-blue-500/10 border-blue-500/20';
      }
    } else {
      switch(type) {
        case 'critical': return 'bg-rose-50 border-rose-200';
        case 'warning': return 'bg-amber-50 border-amber-200';
        case 'success': return 'bg-emerald-50 border-emerald-200';
        default: return 'bg-blue-50 border-blue-200';
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50" onClick={onClose} />
      
      {/* Panel */}
      <div className={`absolute top-14 right-4 w-96 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl border overflow-hidden z-50 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => {
                onNavigate('/safety');
                onClose();
              }}
              className={`p-3 border-b cursor-pointer transition-colors ${
                isDark ? 'border-slate-700/50 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'
              } ${notification.unread ? (isDark ? 'bg-slate-700/30' : 'bg-amber-50/50') : ''}`}
            >
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg border flex-shrink-0 ${getBgColor(notification.type, isDark)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {notification.title}
                    </span>
                    {notification.unread && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {notification.message}
                  </p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Clock className="w-3 h-3" />
                    {notification.time}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
          <button 
            onClick={() => {
              onNavigate('/safety');
              onClose();
            }}
            className="w-full py-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
