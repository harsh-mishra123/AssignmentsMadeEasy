import api from './axios';

export const announcementsAPI = {
  getRecentAnnouncements: async () => {
    try {
      const response = await api.get('/announcements/recent');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getAnnouncements: async (params = {}) => {
    try {
      const response = await api.get('/announcements', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
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
