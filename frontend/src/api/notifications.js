import api from './axios';

// Notifications API endpoints
export const notificationsAPI = {
  // Get all notifications for current user
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get notification by ID
  getNotificationById: async (id) => {
    try {
      const response = await api.get(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    try {
      const response = await api.delete('/notifications/clear-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create notification (admin/system use)
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get notifications by type
  getNotificationsByType: async (type, params = {}) => {
    try {
      const response = await api.get(`/notifications/type/${type}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get notification preferences
  getPreferences: async () => {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Subscribe to push notifications
  subscribeToPush: async (subscription) => {
    try {
      const response = await api.post('/notifications/push-subscribe', subscription);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Unsubscribe from push notifications
  unsubscribeFromPush: async () => {
    try {
      const response = await api.post('/notifications/push-unsubscribe');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send bulk notifications (admin only)
  sendBulkNotifications: async (notificationData) => {
    try {
      const response = await api.post('/notifications/bulk-send', notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get notification history/archive
  getNotificationHistory: async (params = {}) => {
    try {
      const response = await api.get('/notifications/history', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Real-time notification polling (alternative to WebSocket)
  pollNotifications: async (lastCheckTime) => {
    try {
      const response = await api.get('/notifications/poll', {
        params: { since: lastCheckTime }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default notificationsAPI;