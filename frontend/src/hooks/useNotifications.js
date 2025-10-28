import { useState, useEffect } from 'react';
import { notificationsAPI } from '../api/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await notificationsAPI.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsAPI.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
    }
  };

  // Polling for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};

export default useNotifications;