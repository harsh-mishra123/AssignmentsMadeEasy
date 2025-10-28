import api from './axios';

// Submissions API endpoints
export const submissionsAPI = {
  // Submit assignment with file upload
  submitAssignment: async (formData) => {
    try {
      const response = await api.post('/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all submissions for an assignment (teacher/admin)
  getSubmissions: async (assignmentId, params = {}) => {
    try {
      const response = await api.get(`/submissions/assignment/${assignmentId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user's submissions
  getMySubmissions: async (params = {}) => {
    try {
      const response = await api.get('/submissions/my-submissions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all submissions (admin only)
  getAllSubmissions: async (params = {}) => {
    try {
      const response = await api.get('/submissions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get specific submission by ID
  getSubmissionById: async (id) => {
    try {
      const response = await api.get(`/submissions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update submission (before deadline)
  updateSubmission: async (id, formData) => {
    try {
      const response = await api.put(`/submissions/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Grade submission (admin only)
  gradeSubmission: async (id, gradeData) => {
    try {
      const response = await api.put(`/submissions/${id}/grade`, gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add feedback to submission
  addFeedback: async (id, feedbackData) => {
    try {
      const response = await api.post(`/submissions/${id}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete submission (student can delete before grading)
  deleteSubmission: async (id) => {
    try {
      const response = await api.delete(`/submissions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Download submission file
  downloadSubmission: async (id) => {
    try {
      const response = await api.get(`/submissions/${id}/download`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'submission_file';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get submission statistics for assignment
  getSubmissionStats: async (assignmentId) => {
    try {
      const response = await api.get(`/submissions/assignment/${assignmentId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk grade submissions
  bulkGradeSubmissions: async (submissionIds, gradeData) => {
    try {
      const response = await api.patch('/submissions/bulk-grade', {
        submissionIds,
        gradeData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get late submissions
  getLateSubmissions: async (assignmentId) => {
    try {
      const response = await api.get(`/submissions/assignment/${assignmentId}/late`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get plagiarism report (if implemented)
  getPlagiarismReport: async (id) => {
    try {
      const response = await api.get(`/submissions/${id}/plagiarism`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Export submissions to CSV/Excel
  exportSubmissions: async (assignmentId, format = 'csv') => {
    try {
      const response = await api.get(`/submissions/assignment/${assignmentId}/export`, {
        params: { format },
        responseType: 'blob',
      });
      
      // Create download link for export file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submissions_${assignmentId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default submissionsAPI;