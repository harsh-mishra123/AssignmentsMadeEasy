import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Assignment Portal
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your assignments efficiently
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;