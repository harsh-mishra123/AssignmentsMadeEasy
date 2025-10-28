import React from 'react';
import useNotifications from '../hooks/useNotifications';
import { InlineLoader } from '../components/Loader';
import Button from '../components/Button';

const Notifications = () => {
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  if (loading) return <InlineLoader text="Loading notifications..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        {notifications.some(n => !n.read) && (
          <Button onClick={markAllAsRead} size="sm">
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                !notification.read 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mt-4">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;