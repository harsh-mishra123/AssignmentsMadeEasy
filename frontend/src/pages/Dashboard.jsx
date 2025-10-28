import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { assignmentsAPI } from '../api/assignments';
import { submissionsAPI } from '../api/submissions';
import { InlineLoader } from '../components/Loader';
import Button from '../components/Button';

const Dashboard = () => {
  const { user, isAdmin, isStudent } = useAuth();
  const [stats, setStats] = useState({
    assignments: 0,
    submissions: 0,
    pendingAssignments: 0,
    gradedSubmissions: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [assignmentsData, submissionsData] = await Promise.all([
        assignmentsAPI.getAllAssignments(),
        submissionsAPI.getMySubmissions()
      ]);

      // Set recent assignments (first 5)
      setRecentAssignments(assignmentsData.slice(0, 5));

      // Set recent submissions (first 5)
      setRecentSubmissions(submissionsData.slice(0, 5));

      // Calculate stats
      const now = new Date();
      const pendingAssignments = assignmentsData.filter(
        assignment => new Date(assignment.dueDate) > now
      ).length;

      const gradedSubmissions = submissionsData.filter(
        submission => submission.grade
      ).length;

      setStats({
        assignments: assignmentsData.length,
        submissions: submissionsData.length,
        pendingAssignments,
        gradedSubmissions,
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAssignmentStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return { text: 'Overdue', color: 'text-red-600 bg-red-100' };
    } else if (daysDiff === 0) {
      return { text: 'Due Today', color: 'text-orange-600 bg-orange-100' };
    } else if (daysDiff <= 3) {
      return { text: `Due in ${daysDiff} days`, color: 'text-yellow-600 bg-yellow-100' };
    } else {
      return { text: `Due in ${daysDiff} days`, color: 'text-green-600 bg-green-100' };
    }
  };

  if (loading) {
    return <InlineLoader text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          {isAdmin() ? 'Manage assignments and track student progress.' : 'Stay on top of your assignments and submissions.'}
        </p>
        {isAdmin() && (
          <div className="mt-4">
            <Link to="/assignments">
              <Button variant="secondary" size="sm">
                Create New Assignment
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {isAdmin() ? 'Total Assignments' : 'Available Assignments'}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.assignments}
              </p>
            </div>
          </div>
        </div>

        {isStudent() && (
          <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    My Submissions
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.submissions}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.pendingAssignments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Graded
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.gradedSubmissions}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Assignments
              </h2>
              <Link 
                to="/assignments"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                View all
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentAssignments.length > 0 ? (
              <div className="space-y-4">
                {recentAssignments.map((assignment) => {
                  const status = getAssignmentStatus(assignment.dueDate);
                  return (
                    <div key={assignment._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Due: {formatDate(assignment.dueDate)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No assignments available
              </p>
            )}
          </div>
        </div>

        {/* Recent Submissions (Students) or Quick Actions (Admin) */}
        {isStudent() ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Submissions
                </h2>
                <Link 
                  to="/submissions"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  View all
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {recentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {submission.assignment?.title || 'Assignment'}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Submitted: {formatDate(submission.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        {submission.grade ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {submission.grade}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No submissions yet
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <Link to="/assignments" className="block">
                  <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Create Assignment</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Add a new assignment for students</p>
                    </div>
                  </div>
                </Link>

                <Link to="/grading" className="block">
                  <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Grade Submissions</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Review and grade student work</p>
                    </div>
                  </div>
                </Link>

                <button className="w-full">
                  <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">View and manage student accounts</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;