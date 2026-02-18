// frontend/src/pages/ServerError.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const ServerError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-600 dark:text-red-500">500</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">Server Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
          Something went wrong on our end. Please try again later.
        </p>
        <Link to="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServerError;