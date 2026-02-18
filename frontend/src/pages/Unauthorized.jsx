import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-yellow-600 dark:text-yellow-500">401</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">Unauthorized Access</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
          You don't have permission to access this page.
        </p>
        <Link to="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
