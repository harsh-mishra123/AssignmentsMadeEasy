import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;