import React from 'react';
import AnnouncementsComponent from '../components/Announcements';

const AnnouncementsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        All Announcements
      </h1>
      <AnnouncementsComponent limit={20} showViewAll={false} />
    </div>
  );
};

export default AnnouncementsPage;