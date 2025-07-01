// NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (type: Notification['type'], title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
    
    // Mark all as read when opening drawer
    if (!isDrawerOpen) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, [isDrawerOpen]);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      isDrawerOpen,
      toggleDrawer,
      openDrawer,
      closeDrawer
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};