import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Submissions from './pages/Submissions';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/AdminPanel';
import Grading from './pages/Grading';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';

// Error Pages
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import Unauthorized from './pages/Unauthorized';

// Wrapper component for providers with animations
const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Route configuration with metadata
const routes = [
  {
    path: '/',
    element: <AppProviders><Home /></AppProviders>,
    metadata: {
      title: 'Home - Assignment Portal',
      description: 'Welcome to Assignment Portal - Your complete assignment management solution'
    }
  },
  {
    path: '/auth',
    element: <AppProviders><AuthLayout /></AppProviders>,
    metadata: {
      title: 'Authentication - Assignment Portal',
      description: 'Login or register to access your account'
    },
    children: [
      {
        path: 'login',
        element: <Login />,
        metadata: {
          title: 'Login - Assignment Portal',
          description: 'Sign in to your account'
        }
      },
      {
        path: 'register',
        element: <Register />,
        metadata: {
          title: 'Register - Assignment Portal',
          description: 'Create a new account'
        }
      }
    ]
  },
  {
    path: '/login',
    element: <AppProviders><AuthLayout /></AppProviders>,
    metadata: {
      title: 'Login - Assignment Portal',
      description: 'Sign in to your account'
    },
    children: [
      {
        index: true,
        element: <Login />,
      }
    ]
  },
  {
    path: '/register',
    element: <AppProviders><AuthLayout /></AppProviders>,
    metadata: {
      title: 'Register - Assignment Portal',
      description: 'Create a new account'
    },
    children: [
      {
        index: true,
        element: <Register />,
      }
    ]
  },
  {
    path: '/dashboard',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Dashboard - Assignment Portal',
      description: 'Your personal dashboard'
    },
    children: [
      {
        index: true,
        element: <Dashboard />,
      }
    ]
  },
  {
    path: '/announcements',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Announcements - Assignment Portal',
      description: 'View all announcements'
    },
    children: [
      {
        index: true,
        element: <Announcements />,
      },
      {
        path: ':id',
        element: <Announcements />,
      }
    ]
  },
  {
    path: '/assignments',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Assignments - Assignment Portal',
      description: 'Manage your assignments'
    },
    children: [
      {
        index: true,
        element: <Assignments />,
      },
      {
        path: ':id',
        element: <Assignments />,
      },
      {
        path: 'create',
        element: <Assignments />,
      },
      {
        path: 'edit/:id',
        element: <Assignments />,
      }
    ]
  },
  {
    path: '/submissions',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Submissions - Assignment Portal',
      description: 'View your submissions'
    },
    children: [
      {
        index: true,
        element: <Submissions />,
      },
      {
        path: ':id',
        element: <Submissions />,
      }
    ]
  },
  {
    path: '/notifications',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Notifications - Assignment Portal',
      description: 'View your notifications'
    },
    children: [
      {
        index: true,
        element: <Notifications />,
      }
    ]
  },
  {
    path: '/admin',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Admin Panel - Assignment Portal',
      description: 'Administrative controls'
    },
    children: [
      {
        index: true,
        element: <AdminPanel />,
      },
      {
        path: 'users',
        element: <AdminPanel />,
      },
      {
        path: 'settings',
        element: <AdminPanel />,
      }
    ]
  },
  {
    path: '/grading',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Grading - Assignment Portal',
      description: 'Grade student submissions'
    },
    children: [
      {
        index: true,
        element: <Grading />,
      },
      {
        path: 'assignment/:assignmentId',
        element: <Grading />,
      }
    ]
  },
  {
    path: '/profile',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Profile - Assignment Portal',
      description: 'Your profile settings'
    },
    children: [
      {
        index: true,
        element: <Profile />,
      }
    ]
  },
  {
    path: '/settings',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Settings - Assignment Portal',
      description: 'Application settings'
    },
    children: [
      {
        index: true,
        element: <Settings />,
      }
    ]
  },
  {
    path: '/help',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    metadata: {
      title: 'Help - Assignment Portal',
      description: 'Get help and support'
    },
    children: [
      {
        index: true,
        element: <Help />,
      }
    ]
  },
  // Error routes
  {
    path: '/401',
    element: <AppProviders><Unauthorized /></AppProviders>,
    metadata: {
      title: 'Unauthorized - Assignment Portal',
      description: 'Access denied'
    }
  },
  {
    path: '/500',
    element: <AppProviders><ServerError /></AppProviders>,
    metadata: {
      title: 'Server Error - Assignment Portal',
      description: 'Something went wrong'
    }
  },
  {
    path: '/404',
    element: <AppProviders><NotFound /></AppProviders>,
    metadata: {
      title: 'Not Found - Assignment Portal',
      description: 'Page not found'
    }
  },
  // Catch-all route
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  }
];

// Create router with future flags
export const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  }
});

// Helper function to get route metadata
export const getRouteMetadata = (pathname) => {
  const findRoute = (routes, path) => {
    for (const route of routes) {
      if (route.path === path) {
        return route.metadata;
      }
      if (route.children) {
        const childMetadata = findRoute(route.children, path);
        if (childMetadata) return childMetadata;
      }
    }
    return null;
  };
  
  return findRoute(routes, pathname) || {
    title: 'Assignment Portal',
    description: 'Manage your assignments efficiently'
  };
};

export default router;