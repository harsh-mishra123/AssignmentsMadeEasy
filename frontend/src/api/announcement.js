import api from './axios';

export const announcementsAPI = {
  // Get recent announcements
  getRecentAnnouncements: async () => {
    try {
      const response = await api.get('/announcements/recent');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all announcements with pagination
  getAnnouncements: async (params = {}) => {
    try {
      const response = await api.get('/announcements', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create announcement (admin only)
  createAnnouncement: async (announcementData) => {
    try {
      const response = await api.post('/announcements', announcementData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default announcementsAPI;