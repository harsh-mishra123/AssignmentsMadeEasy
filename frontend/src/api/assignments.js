import api from './axios';

// Assignments API endpoints
export const assignmentsAPI = {
  // Get all assignments
  getAllAssignments: async () => {
    try {
      const response = await api.get('/assignments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get assignment by ID
  getAssignmentById: async (id) => {
    try {
      const response = await api.get(`/assignments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get assignments for current student
  getStudentAssignments: async (params = {}) => {
    try {
      const response = await api.get('/assignments/student', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new assignment (admin only)
  createAssignment: async (assignmentData) => {
    try {
      const response = await api.post('/assignments', assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get submissions for an assignment (admin only)
  getAssignmentSubmissions: async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/submissions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update assignment
  updateAssignment: async (id, assignmentData) => {
    try {
      const response = await api.put(`/assignments/${id}`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete assignment
  deleteAssignment: async (id) => {
    try {
      const response = await api.delete(`/assignments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get assignments by course
  getAssignmentsByCourse: async (courseId, params = {}) => {
    try {
      const response = await api.get(`/assignments/course/${courseId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get assignment statistics
  getAssignmentStats: async (id) => {
    try {
      const response = await api.get(`/assignments/${id}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Publish/Unpublish assignment
  toggleAssignmentStatus: async (id, status) => {
    try {
      const response = await api.patch(`/assignments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get assignment submissions count
  getSubmissionsCount: async (id) => {
    try {
      const response = await api.get(`/assignments/${id}/submissions/count`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk update assignments
  bulkUpdateAssignments: async (assignmentIds, updateData) => {
    try {
      const response = await api.patch('/assignments/bulk-update', {
        assignmentIds,
        updateData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get overdue assignments
  getOverdueAssignments: async () => {
    try {
      const response = await api.get('/assignments/overdue');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get upcoming assignments
  getUpcomingAssignments: async (days = 7) => {
    try {
      const response = await api.get(`/assignments/upcoming?days=${days}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default assignmentsAPI;