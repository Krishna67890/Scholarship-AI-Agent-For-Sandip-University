import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const NotificationCenter = ({ notifications: propNotifications }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (propNotifications) {
      setNotifications(propNotifications);
    }
  }, [propNotifications]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} className="text-green-400" />;
      case 'warning': return <AlertTriangle size={14} className="text-orange-400" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 font-mono">
          <Bell size={14} className="text-primary-500" />
          SYSTEM_NOTIFICATIONS
        </h3>
        <span className="bg-primary-600 text-[10px] px-1.5 py-0.5 rounded-sm text-white font-black font-mono animate-pulse">{notifications.length}</span>
      </div>

      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
        {notifications.length === 0 ? (
          <p className="text-[9px] text-slate-700 italic font-mono uppercase tracking-widest">No active logs</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="relative group bg-primary-950/10 border border-white/5 hover:border-primary-500/20 p-3 rounded-sm transition-all duration-300">
              <button
                onClick={() => removeNotification(notif.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-white transition-opacity"
              >
                <X size={10} />
              </button>
              <div className="flex gap-3">
                <div className="mt-0.5">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-200 leading-tight uppercase font-mono">{notif.title}</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-normal font-mono">{notif.message}</p>
                  <p className="text-[8px] text-primary-900 mt-2 font-black uppercase tracking-widest font-mono">{notif.time} // 0x{Math.floor(Math.random()*100).toString(16)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
