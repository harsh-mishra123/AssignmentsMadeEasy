import api from './axios';

// Authentication API endpoints
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      const { token, id, name, email, role } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, email, role }));
      
      return response.data;
    } catch (error) {
      console.error('Login API Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register API Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      
      // Clear stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return true;
    } catch (error) {
      // Clear local data even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data || error.message;
    }
  },

  // Get all users (for admin)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refresh authentication token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      // Update stored user data
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authAPI;