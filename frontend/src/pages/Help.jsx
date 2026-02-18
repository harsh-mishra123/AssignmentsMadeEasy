import React from 'react';
import { Link } from 'react-router-dom';
import { FiHelpCircle, FiBook, FiMessageCircle, FiVideo } from 'react-icons/fi';

const Help = () => {
  const helpTopics = [
    {
      icon: FiBook,
      title: 'Getting Started',
      description: 'New to the platform? Learn the basics here.',
      link: '/help/getting-started'
    },
    {
      icon: FiVideo,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides.',
      link: '/help/tutorials'
    },
    {
      icon: FiMessageCircle,
      title: 'FAQs',
      description: 'Find answers to common questions.',
      link: '/help/faqs'
    },
    {
      icon: FiHelpCircle,
      title: 'Contact Support',
      description: 'Get help from our support team.',
      link: '/help/contact'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {helpTopics.map((topic, index) => {
          const Icon = topic.icon;
          return (
            <Link
              key={index}
              to={topic.link}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <Icon className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {topic.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Need immediate assistance?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Our support team is available 24/7 to help you with any issues.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Help;