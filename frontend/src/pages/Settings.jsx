import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import { FiBell, FiMoon, FiSun, FiGlobe } from 'react-icons/fi';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y dark:divide-gray-700">
        {/* Appearance Settings */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiBell className="h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="toggle"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiMail className="h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-300">Email Updates</span>
              </div>
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
                className="toggle"
              />
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language</h2>
          <div className="flex items-center space-x-3">
            <FiGlobe className="h-5 w-5" />
            <select className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;