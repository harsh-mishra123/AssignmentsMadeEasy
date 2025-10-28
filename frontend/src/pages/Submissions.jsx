import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submissionsAPI } from '../api/submissions';
import { assignmentsAPI } from '../api/assignments';
import { useAuth } from '../hooks/useAuth';
import { InlineLoader } from '../components/Loader';
import Button from '../components/Button';

const Submissions = () => {
  const { isStudent } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submitted');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [submissionsData, assignmentsData] = await Promise.all([
        submissionsAPI.getMySubmissions(),
        assignmentsAPI.getAllAssignments()
      ]);
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setSubmissions([]);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const getUnsubmittedAssignments = () => {
    const submittedAssignmentIds = submissions.map(sub => sub.assignment?._id || sub.assignmentId);
    return assignments.filter(assignment => !submittedAssignmentIds.includes(assignment._id));
  };

  if (loading) return <InlineLoader text="Loading submissions..." />;

  const unsubmittedAssignments = getUnsubmittedAssignments();

  if (loading) return <InlineLoader text="Loading submissions..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Submissions
        </h1>
        {isStudent() && (
          <Link to="/assignments">
            <Button>Submit New Assignment</Button>
          </Link>
        )}
      </div>

      {/* Tabs for Students */}
      {isStudent() && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('submitted')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submitted'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Submitted ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Pending Submission ({unsubmittedAssignments.length})
            </button>
          </nav>
        </div>
      )}

      <div className="grid gap-4">
        {activeTab === 'submitted' ? (
          // Submitted assignments tab
          submissions.length > 0 ? (
            submissions.map((submission) => (
              <div key={submission._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {submission.assignment?.title || 'Assignment'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {submission.content}
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <span>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</span>
                      {submission.file && (
                        <span className="text-blue-600">📎 File attached</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {submission.grade ? (
                      <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                        Grade: {submission.grade}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Pending Review
                      </span>
                    )}
                  </div>
                </div>
                {submission.feedback && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Instructor Feedback:</p>
                    <p className="text-blue-800 dark:text-blue-200">{submission.feedback}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 mb-4">No submissions yet</p>
              <Link to="/assignments">
                <Button>Submit Your First Assignment</Button>
              </Link>
            </div>
          )
        ) : (
          // Pending submissions tab  
          unsubmittedAssignments.length > 0 ? (
            unsubmittedAssignments.map((assignment) => {
              const isOverdue = new Date(assignment.dueDate) < new Date();
              return (
                <div key={assignment._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-red-400">
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
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-sm text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        {isOverdue && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link to="/assignments">
                        <Button 
                          size="sm"
                          variant={isOverdue ? "destructive" : "default"}
                        >
                          {isOverdue ? "Submit Late" : "Submit Now"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">All assignments submitted! 🎉</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Submissions;