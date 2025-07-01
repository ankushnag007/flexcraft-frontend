import React, { useState, useEffect, useRef } from 'react';
import './NotificationDrawer.css';

const NotificationDrawer = ({ notifications, onClose }) => {
  const drawerRef = useRef(null);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="notification-drawer" ref={drawerRef}>
      <div className="drawer-header">
        <h3>Notifications</h3>
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <div className="notification-content">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
              {notification.unread && <div className="unread-dot"></div>}
            </div>
          ))
        ) : (
          <p className="no-notifications">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;