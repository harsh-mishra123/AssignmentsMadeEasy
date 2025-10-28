import React from 'react';

const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizes[size]}`} />
    </div>
  );
};

// Full screen loader
export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader size="xl" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

// Inline loader with text
export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Loader size="sm" />
      <span className="text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  );
};

export default Loader;