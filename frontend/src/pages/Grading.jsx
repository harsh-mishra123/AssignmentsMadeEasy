import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { submissionsAPI } from '../api/submissions';
import { assignmentsAPI } from '../api/assignments';
import Button from '../components/Button';
import { InlineLoader } from '../components/Loader';

const Grading = () => {
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (isAdmin()) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [submissionsData, assignmentsData] = await Promise.all([
        submissionsAPI.getAllSubmissions(),
        assignmentsAPI.getAllAssignments()
      ]);
      setSubmissions(submissionsData || []);
      setAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Failed to load grading data:', error);
      setSubmissions([]);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
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
      loadData(); // Reload to show updated grades
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

  const filteredSubmissions = selectedAssignment === 'all' 
    ? (submissions || [])
    : (submissions || []).filter(sub => sub.assignment?._id === selectedAssignment);

  const pendingCount = (submissions || []).filter(s => !s.grade).length;
  const gradedCount = (submissions || []).filter(s => s.grade).length;

  if (!isAdmin()) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return <InlineLoader text="Loading submissions for grading..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Grade Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and grade student submissions
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 px-3 py-1 rounded-full">
            {pendingCount} Pending
          </div>
          <div className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full">
            {gradedCount} Graded
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Assignment:
          </label>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Assignments ({(submissions || []).length})</option>
            {(assignments || []).map((assignment) => {
              const count = (submissions || []).filter(s => s.assignment?._id === assignment._id).length;
              return (
                <option key={assignment._id} value={assignment._id}>
                  {assignment.title} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Grading Modal */}
      {showGradeModal && gradingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Grade Submission
            </h2>
            
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {gradingSubmission.assignment?.title || 'Assignment'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                <strong>Student:</strong> {gradingSubmission.student?.name || gradingSubmission.student?.email || 'Unknown'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                <strong>Submitted:</strong> {new Date(gradingSubmission.createdAt).toLocaleDateString()}
              </p>
              
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submission Content:</h4>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{gradingSubmission.content}</p>
              </div>
              
              {gradingSubmission.file && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span className="text-sm text-blue-600 dark:text-blue-400">📎 File attachment included</span>
                </div>
              )}
            </div>
            
            <form onSubmit={submitGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade (0-100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter grade (0-100)"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Feedback for Student
                </label>
                <textarea
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Provide constructive feedback to help the student improve..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={cancelGrading} disabled={grading}>
                  Cancel
                </Button>
                <Button type="submit" loading={grading} disabled={!gradeForm.grade.trim()}>
                  {gradingSubmission.grade ? 'Update Grade' : 'Submit Grade'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <div key={submission._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {submission.assignment?.title || 'Assignment'}
                    </h3>
                    {submission.grade ? (
                      <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                        {submission.grade}/100
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 rounded-full">
                        Needs Grading
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Student</p>
                      <p className="text-gray-900 dark:text-white">
                        {submission.student?.name || submission.student?.email || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Submitted</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submission Content</p>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                        {(submission.content || '').length > 200 
                          ? `${(submission.content || '').substring(0, 200)}...` 
                          : (submission.content || 'No content')
                        }
                      </p>
                      {submission.file && (
                        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                          📎 File attachment included
                        </div>
                      )}
                    </div>
                  </div>

                  {submission.feedback && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Previous Feedback</p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200">{submission.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="ml-6">
                  <Button
                    onClick={() => handleGradeSubmission(submission)}
                    variant={submission.grade ? "outline" : "primary"}
                    size="sm"
                  >
                    {submission.grade ? "Update Grade" : "Grade Now"}
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No submissions to grade</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedAssignment === 'all' 
                ? 'No student submissions have been received yet.'
                : 'No submissions for this assignment yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grading;