import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { assignmentsAPI } from '../api/assignments';
import { submissionsAPI } from '../api/submissions';
import Button from '../components/Button';
import { InlineLoader } from '../components/Loader';

const Assignments = () => {
  const { isAdmin } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [submissionForm, setSubmissionForm] = useState({
    assignmentId: null,
    content: '',
    file: null
  });
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await assignmentsAPI.getAllAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await assignmentsAPI.updateAssignment(editingAssignment._id, newAssignment);
        setEditingAssignment(null);
      } else {
        await assignmentsAPI.createAssignment(newAssignment);
      }
      setNewAssignment({ title: '', description: '', dueDate: '' });
      setShowCreateForm(false);
      loadAssignments();
    } catch (error) {
      console.error('Failed to save assignment:', error);
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setNewAssignment({
      title: assignment.title,
      description: assignment.description || '',
      dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16)
    });
    setShowCreateForm(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentsAPI.deleteAssignment(assignmentId);
        loadAssignments();
      } catch (error) {
        console.error('Failed to delete assignment:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setNewAssignment({ title: '', description: '', dueDate: '' });
    setShowCreateForm(false);
  };

  const handleSubmitAssignment = (assignment) => {
    setSubmissionForm({
      assignmentId: assignment._id,
      assignmentTitle: assignment.title,
      content: '',
      file: null
    });
    setShowSubmissionModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSubmissionForm(prev => ({ ...prev, file }));
  };

  const submitAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('assignmentId', submissionForm.assignmentId);
      formData.append('content', submissionForm.content);
      
      if (submissionForm.file) {
        formData.append('file', submissionForm.file);
      }

      await submissionsAPI.submitAssignment(formData);
      
      setShowSubmissionModal(false);
      setSubmissionForm({ assignmentId: null, content: '', file: null });
      alert('Assignment submitted successfully!');
      
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelSubmission = () => {
    setShowSubmissionModal(false);
    setSubmissionForm({ assignmentId: null, content: '', file: null });
  };

  if (loading) return <InlineLoader text="Loading assignments..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Assignments
        </h1>
        {isAdmin() && (
          <Button onClick={() => setShowCreateForm(true)}>
            Create Assignment
          </Button>
        )}
      </div>

      {showCreateForm && isAdmin() && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
          </h2>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                {editingAssignment ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Submit Assignment: {submissionForm.assignmentTitle}
            </h2>
            
            <form onSubmit={submitAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Submission Text
                </label>
                <textarea
                  value={submissionForm.content}
                  onChange={(e) => setSubmissionForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter your submission text here..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload File (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                {submissionForm.file && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {submissionForm.file.name}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" loading={submitting} disabled={!submissionForm.content.trim()}>
                  Submit Assignment
                </Button>
                <Button variant="outline" onClick={cancelSubmission} disabled={submitting}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {assignment.title}
                  </h3>
                  {assignment.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {assignment.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  <span className="text-xs text-gray-500">
                    Created: {new Date(assignment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-2 ml-4">
                  {isAdmin() ? (
                    <>
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="Edit Assignment"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        title="Delete Assignment"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleSubmitAssignment(assignment)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Submit Assignment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No assignments available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;