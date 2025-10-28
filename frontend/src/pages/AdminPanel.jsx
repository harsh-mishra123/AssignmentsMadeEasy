import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/auth';
import { assignmentsAPI } from '../api/assignments';
import { submissionsAPI } from '../api/submissions';
import { InlineLoader } from '../components/Loader';
import Button from '../components/Button';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({
    grade: '',
    feedback: ''
  });
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (isAdmin()) {
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    try {
      const [usersData, assignmentsData, submissionsData] = await Promise.all([
        authAPI.getAllUsers(),
        assignmentsAPI.getAllAssignments(),
        submissionsAPI.getAllSubmissions()
      ]);
      
      setUsers(usersData);
      setAssignments(assignmentsData);
      setSubmissions(submissionsData || []);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setUsers([]);
      setAssignments([]);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissionsForAssignment = async (assignmentId) => {
    try {
      const data = await assignmentsAPI.getAssignmentSubmissions(assignmentId);
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await assignmentsAPI.updateAssignment(editingAssignment._id, newAssignment);
        setEditingAssignment(null);
        alert('Assignment updated successfully!');
      } else {
        await assignmentsAPI.createAssignment(newAssignment);
        alert('Assignment created successfully!');
      }
      setNewAssignment({ title: '', description: '', dueDate: '' });
      setShowCreateForm(false);
      loadAdminData();
    } catch (error) {
      console.error('Failed to save assignment:', error);
      alert('Failed to save assignment. Please try again.');
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
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      try {
        await assignmentsAPI.deleteAssignment(assignmentId);
        loadAdminData();
        alert('Assignment deleted successfully!');
      } catch (error) {
        console.error('Failed to delete assignment:', error);
        alert('Failed to delete assignment. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setNewAssignment({ title: '', description: '', dueDate: '' });
    setShowCreateForm(false);
  };

  const handleGradeSubmission = (submission) => {
    setGradingSubmission(submission);
    setGradeForm({
      grade: submission.grade || '',
      feedback: submission.feedback || ''
    });
    setShowGradeModal(true);
  };

  const submitGrade = async (e) => {
    e.preventDefault();
    if (!gradeForm.grade.trim()) return;

    setGrading(true);
    try {
      await submissionsAPI.gradeSubmission(gradingSubmission._id, {
        grade: gradeForm.grade,
        feedback: gradeForm.feedback
      });
      
      setShowGradeModal(false);
      setGradingSubmission(null);
      setGradeForm({ grade: '', feedback: '' });
      loadAdminData(); // Reload data to show updated grade
      alert('Submission graded successfully!');
    } catch (error) {
      console.error('Failed to grade submission:', error);
      alert('Failed to grade submission. Please try again.');
    } finally {
      setGrading(false);
    }
  };

  const cancelGrading = () => {
    setShowGradeModal(false);
    setGradingSubmission(null);
    setGradeForm({ grade: '', feedback: '' });
  };

  if (!isAdmin()) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) return <InlineLoader text="Loading admin panel..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
        <Button onClick={() => setShowCreateForm(true)}>
          Create Assignment
        </Button>
      </div>

      {/* Assignment Creation Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
          </h2>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter assignment description..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date & Time *
              </label>
              <input
                type="datetime-local"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <Button type="submit">
                {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grading Modal */}
      {showGradeModal && gradingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Grade Submission
            </h2>
            
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {gradingSubmission.assignment?.title || 'Assignment'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Student: {gradingSubmission.student?.name || gradingSubmission.student?.email || 'Unknown'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Submission: {gradingSubmission.content}
              </p>
              {gradingSubmission.file && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  📎 File attached
                </p>
              )}
            </div>
            
            <form onSubmit={submitGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade (0-100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter grade (e.g., 85)"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Feedback (Optional)
                </label>
                <textarea
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Provide feedback to the student..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" loading={grading} disabled={!gradeForm.grade.trim()}>
                  {gradingSubmission.grade ? 'Update Grade' : 'Submit Grade'}
                </Button>
                <Button variant="outline" onClick={cancelGrading} disabled={grading}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {['users', 'assignments', 'submissions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Registered Users
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <div key={user._id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              All Assignments
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {assignment.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setActiveTab('submissions');
                        loadSubmissionsForAssignment(assignment._id);
                      }}
                    >
                      View Submissions
                    </Button>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                All Submissions
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Total: {submissions.length}</span>
                <span>Graded: {submissions.filter(s => s.grade).length}</span>
                <span>Pending: {submissions.filter(s => !s.grade).length}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {submission.assignment?.title || 'Assignment'}
                          </h3>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {submission.student?.name || submission.student?.email || 'Unknown Student'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          {submission.content}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</span>
                          {submission.file && (
                            <span className="text-blue-600 dark:text-blue-400">📎 File attached</span>
                          )}
                        </div>

                        {submission.feedback && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Feedback:</p>
                            <p className="text-blue-800 dark:text-blue-200 mt-1">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {submission.grade ? (
                          <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                            Grade: {submission.grade}/100
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 rounded-full">
                            Not Graded
                          </span>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={() => handleGradeSubmission(submission)}
                          variant={submission.grade ? "outline" : "primary"}
                        >
                          {submission.grade ? "Update Grade" : "Grade Submission"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No submissions received yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Students will submit assignments here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;