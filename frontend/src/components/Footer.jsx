import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Assignment Portal. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
            >
              Support
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            Built with React, Tailwind CSS, and Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;