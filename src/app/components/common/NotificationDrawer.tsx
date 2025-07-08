// NotificationDrawer.tsx
import React from 'react';
import { 
  X, Bell, Check, Trash2, Circle, AlertCircle, Info, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { useNotification } from './NotificationContext';

const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeDrawer}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  disabled={notifications.length === 0}
                >
                  Mark all read
                </button>
                <button 
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                  disabled={notifications.length === 0}
                >
                  Clear all
                </button>
                <button 
                  onClick={closeDrawer}
                  className="ml-3 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Empty State */}
            {notifications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                <p className="text-sm text-gray-500">
                  We'll notify you when something arrives.
                </p>
              </div>
            ) : (
              <>
                {/* Notification List */}
                <div className="flex-1 overflow-y-auto">
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200">
                      {notifications.map((notification) => (
                        <li key={notification.id} className="px-4 py-4 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                              {getIcon(notification.type)}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {notification.message}
                              </p>
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <span>
                                  {notification.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <span className="mx-1">•</span>
                                <span>
                                  {notification.timestamp.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                              {!notification.read && (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Mark as read"
                                >
                                  <Circle className="w-4 h-4 text-blue-500" />
                                </button>
                              )}
                              <button 
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-500"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;