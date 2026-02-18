import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { FiUser, FiMail, FiCalendar, FiAward } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <FiUser className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FiMail className="h-5 w-5 text-gray-500" />
            <span className="text-gray-900 dark:text-white">{user?.email}</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FiCalendar className="h-5 w-5 text-gray-500" />
            <span className="text-gray-900 dark:text-white">Member since {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FiAward className="h-5 w-5 text-gray-500" />
            <span className="text-gray-900 dark:text-white">Account Status: Active</span>
          </div>
        </div>

        <div className="mt-6">
          <Button>Edit Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;