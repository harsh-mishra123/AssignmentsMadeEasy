import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  FiBookOpen, 
  FiCheckCircle, 
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiClock,
  FiArrowRight,
  FiStar,
  FiCalendar,
  FiBarChart2
} from 'react-icons/fi';

const Welcome = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const quotes = [
      "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
      "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
      "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi",
      "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss",
      "Education is not preparation for life; education is life itself. - John Dewey"
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // 5 seconds ke baad dashboard pe redirect
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const stats = [
    { icon: FiBookOpen, label: 'Assignments', value: '24' },
    { icon: FiCheckCircle, label: 'Completed', value: '18' },
    { icon: FiStar, label: 'Average Grade', value: '85%' },
    { icon: FiTrendingUp, label: 'Rank', value: '#42' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiBookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AssignMaster
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {greeting}, {user.name.split(' ')[0]}! 👋
              </span>
            </div>
          </div>
        </motion.div>

        {/* Welcome Hero Section */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              🎉 Welcome Back to Your Learning Journey
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Hello, 
              </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {user.name}!
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {quote}
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Access Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: FiBookOpen,
                title: 'Continue Learning',
                desc: 'Pick up where you left off',
                color: 'from-blue-600 to-cyan-600',
                link: '/assignments'
              },
              {
                icon: FiBarChart2,
                title: 'Track Progress',
                desc: 'View your achievements',
                color: 'from-purple-600 to-pink-600',
                link: '/dashboard'
              },
              {
                icon: FiUsers,
                title: 'Collaborate',
                desc: 'Join study groups',
                color: 'from-green-600 to-emerald-600',
                link: '/announcements'
              }
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <Link to={card.link} key={index}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`bg-gradient-to-br ${card.color} p-6 rounded-2xl shadow-xl cursor-pointer group`}
                  >
                    <Icon className="h-8 w-8 text-white mb-4 opacity-90 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{card.desc}</p>
                    <div className="flex items-center text-white/90 text-sm font-medium">
                      Get Started <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>

          {/* Auto-redirect message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Redirecting to dashboard in 5 seconds...
            </p>
            <Link to="/dashboard" className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline">
              Click here to go now →
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Welcome;