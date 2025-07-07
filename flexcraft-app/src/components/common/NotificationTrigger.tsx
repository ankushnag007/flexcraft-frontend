// NotificationTrigger.tsx
import React from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const NotificationTrigger: React.FC = () => {
  const { unreadCount, toggleDrawer } = useNotification();

  return (
    <button
      onClick={toggleDrawer}
      className="relative p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationTrigger;