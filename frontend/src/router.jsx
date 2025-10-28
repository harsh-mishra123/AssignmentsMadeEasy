import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

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

// Wrapper component for providers
const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppProviders><Home /></AppProviders>,
  },
  {
    path: '/auth',
    element: <AppProviders><AuthLayout /></AppProviders>,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register', 
        element: <Register />,
      },
    ],
  },
  {
    path: '/login',
    element: <AppProviders><AuthLayout /></AppProviders>,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: '/register',
    element: <AppProviders><AuthLayout /></AppProviders>,
    children: [
      {
        index: true,
        element: <Register />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/assignments',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    children: [
      {
        index: true,
        element: <Assignments />,
      },
    ],
  },
  {
    path: '/submissions',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    children: [
      {
        index: true,
        element: <Submissions />,
      },
    ],
  },
  {
    path: '/notifications',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    children: [
      {
        index: true,
        element: <Notifications />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    children: [
      {
        index: true,
        element: <AdminPanel />,
      },
    ],
  },
  {
    path: '/grading',
    element: <AppProviders><DashboardLayout /></AppProviders>,
    children: [
      {
        index: true,
        element: <Grading />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;