import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { assignmentsAPI } from '../api/assignments';
import { submissionsAPI } from '../api/submissions';
import { InlineLoader } from '../components/Loader';
import Button from '../components/Button';
import { motion } from 'framer-motion'; // npm install framer-motion
import { 
  FiBookOpen, 
  FiCheckCircle, 
  FiClock, 
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiCalendar
} from 'react-icons/fi';

const Dashboard = () => {
  const { user, isAdmin, isStudent } = useAuth();
  const [stats, setStats] = useState({
    assignments: 0,
    submissions: 0,
    pendingAssignments: 0,
    gradedSubmissions: 0,
    averageGrade: 0,
    onTimeRate: 0
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadDashboardData();
    setGreeting(getGreeting());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [assignmentsData, submissionsData] = await Promise.all([
        assignmentsAPI.getAllAssignments(),
        submissionsAPI.getMySubmissions()
      ]);

      setRecentAssignments(assignmentsData?.slice(0, 5) || []);
      setRecentSubmissions(submissionsData?.slice(0, 5) || []);

      const now = new Date();
      const pendingAssignments = assignmentsData?.filter(
        assignment => new Date(assignment.dueDate) > now
      ).length || 0;

      const gradedSubmissions = submissionsData?.filter(
        submission => submission.grade
      ).length || 0;

      // Calculate average grade
      const grades = submissionsData?.filter(s => s.grade).map(s => parseInt(s.grade)) || [];
      const averageGrade = grades.length > 0 
        ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length) 
        : 0;

      // Calculate on-time submission rate
      const onTimeSubmissions = submissionsData?.filter(s => {
        const dueDate = new Date(s.assignment?.dueDate);
        const submitDate = new Date(s.createdAt);
        return submitDate <= dueDate;
      }).length || 0;
      
      const onTimeRate = submissionsData?.length > 0
        ? Math.round((onTimeSubmissions / submissionsData.length) * 100)
        : 0;

      setStats({
        assignments: assignmentsData?.length || 0,
        submissions: submissionsData?.length || 0,
        pendingAssignments,
        gradedSubmissions,
        averageGrade,
        onTimeRate
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

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffDays > 7) return `${Math.ceil(diffDays / 7)} weeks left`;
    if (diffDays > 0) return `${diffDays} days left`;
    if (diffHours > 0) return `${diffHours} hours left`;
    return 'Overdue';
  };

  const getStatusColor = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffMs < 0) return 'bg-red-500';
    if (diffDays <= 2) return 'bg-yellow-500';
    if (diffDays <= 5) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (loading) {
    return <InlineLoader text="Loading your dashboard..." />;
  }

  const statCards = [
    {
      title: isAdmin() ? 'Total Assignments' : 'Available Assignments',
      value: stats.assignments,
      icon: FiBookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: isAdmin() ? 'Total Submissions' : 'My Submissions',
      value: stats.submissions,
      icon: FiCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Pending',
      value: stats.pendingAssignments,
      icon: FiClock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Graded',
      value: stats.gradedSubmissions,
      icon: FiStar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  if (isStudent()) {
    statCards.push({
      title: 'Avg. Grade',
      value: `${stats.averageGrade}%`,
      icon: FiTrendingUp,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400'
    });
    statCards.push({
      title: 'On-Time Rate',
      value: `${stats.onTimeRate}%`,
      icon: FiAward,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    });
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with Animated Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                {isAdmin() 
                  ? 'Manage assignments and track student progress from your central dashboard.'
                  : 'Stay on top of your assignments and track your academic progress.'}
              </p>
            </div>
            {isAdmin() && (
              <Link to="/assignments">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-sm"
                >
                  <FiBookOpen className="mr-2" />
                  Create Assignment
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-blue-200">Today's Date</p>
              <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-blue-200">Role</p>
              <p className="text-xl font-semibold capitalize">{user?.role}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-blue-200">Active Courses</p>
              <p className="text-xl font-semibold">{stats.assignments}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-blue-200">Completion Rate</p>
              <p className="text-xl font-semibold">{stats.onTimeRate}%</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
      </motion.div>

      {/* Stats Grid with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br ${stat.color} opacity-10 transition-all duration-500 group-hover:scale-150`} />
            
            <div className="relative z-10">
              <div className={`inline-flex rounded-lg ${stat.bgColor} p-3 mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
              
              {index < 4 && (
                <div className="mt-3 flex items-center text-xs text-green-600">
                  <FiTrendingUp className="mr-1" />
                  <span>+12% from last month</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout with Enhanced Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Assignments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiCalendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upcoming Assignments
                </h2>
              </div>
              <Link 
                to="/assignments"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
              >
                View all →
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentAssignments.length > 0 ? (
              <div className="space-y-4">
                {recentAssignments.map((assignment, index) => {
                  const timeLeft = getTimeRemaining(assignment.dueDate);
                  const statusColor = getStatusColor(assignment.dueDate);
                  const isOverdue = new Date(assignment.dueDate) < new Date();
                  
                  return (
                    <motion.div
                      key={assignment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${statusColor}`} />
                      
                      <div className="flex-1 ml-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {assignment.title}
                          </h3>
                          {isOverdue && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                              Overdue
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Due: {formatDate(assignment.dueDate)}
                          </p>
                          <p className={`text-xs font-medium ${
                            isOverdue ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {timeLeft}
                          </p>
                        </div>
                      </div>
                      
                      <Link to={`/assignments/${assignment._id}`}>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </Button>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiBookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No assignments available</p>
                {isAdmin() && (
                  <Link to="/assignments">
                    <Button size="sm" className="mt-4">
                      Create First Assignment
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Recent Submissions or Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isStudent() ? 'Recent Activity' : 'Quick Actions'}
                </h2>
              </div>
              {isStudent() && (
                <Link 
                  to="/submissions"
                  className="text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 hover:underline"
                >
                  View all →
                </Link>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {isStudent() ? (
              recentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {recentSubmissions.map((submission, index) => (
                    <motion.div
                      key={submission._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {submission.assignment?.title || 'Assignment'}
                          </h3>
                          {submission.grade && (
                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                              Graded
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Submitted: {formatDate(submission.createdAt)}
                        </p>
                      </div>
                      
                      <div className="text-right ml-4">
                        {submission.grade ? (
                          <div className="flex items-center space-x-1">
                            <FiStar className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {submission.grade}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                            <FiClock className="mr-1 h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No submissions yet</p>
                  <Link to="/assignments">
                    <Button size="sm" className="mt-4">
                      Submit Assignment
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              <div className="space-y-4">
                <Link to="/assignments" className="block">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FiBookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Create Assignment</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Add a new assignment for students</p>
                    </div>
                    <FiTrendingUp className="ml-auto h-5 w-5 text-gray-400" />
                  </motion.div>
                </Link>

                <Link to="/grading" className="block">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Grade Submissions</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Review and grade student work</p>
                    </div>
                    <FiTrendingUp className="ml-auto h-5 w-5 text-gray-400" />
                  </motion.div>
                </Link>

                <Link to="/admin" className="block">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <FiUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Manage Users</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">View and manage student accounts</p>
                    </div>
                    <FiTrendingUp className="ml-auto h-5 w-5 text-gray-400" />
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Achievement Section for Students */}
      {isStudent() && stats.submissions > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎉 Achievement Unlocked!</h3>
              <p className="text-white/90">
                You've submitted {stats.submissions} assignment{stats.submissions !== 1 ? 's' : ''} with a {stats.averageGrade}% average grade. 
                Keep up the great work!
              </p>
            </div>
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <FiAward className="h-8 w-8" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;