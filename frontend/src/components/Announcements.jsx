import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRealtimeAnnouncements } from '../hooks/useRealtimeAnnouncements';
import Button from './Button';
import { InlineLoader } from './Loader';

const Announcements = ({ limit = 5, showViewAll = true }) => {
  const { isAdmin } = useAuth();
  const { 
    announcements, 
    loading, 
    error,
    isConnected,
    newAnnouncementIds,
    createAnnouncement,
    requestNotificationPermission 
  } = useRealtimeAnnouncements(limit);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: 'all'
  });

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🔵';
      default: return '⚪';
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    setCreating(true);
    try {
      await createAnnouncement(newAnnouncement);
      setNewAnnouncement({
        title: '',
        content: '',
        priority: 'medium',
        targetAudience: 'all'
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <InlineLoader text="Loading announcements..." />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements
            </h2>
            {isConnected ? (
              <span className="flex items-center text-xs text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Live
              </span>
            ) : (
              <span className="flex items-center text-xs text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                Connecting...
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {isAdmin() && (
              <Button
                size="sm"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? 'Cancel' : 'New Announcement'}
              </Button>
            )}
            {showViewAll && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = '/announcements'}
              >
                View All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && isAdmin() && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Create New Announcement
          </h3>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content *
              </label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Write your announcement here..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Audience
                </label>
                <select
                  value={newAnnouncement.targetAudience}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Everyone</option>
                  <option value="students">Students Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={creating}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
              >
                Post Announcement
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="p-6">
        {error ? (
          <div className="text-center py-8 text-red-600">
            <p>Error loading announcements: {error}</p>
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => {
              const isNew = newAnnouncementIds.includes(announcement._id);
              
              return (
                <div
                  key={announcement._id}
                  className={`p-4 rounded-lg border transition-all ${
                    getPriorityColor(announcement.priority)
                  } ${
                    isNew ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">
                      {getPriorityIcon(announcement.priority)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {announcement.title}
                          </h3>
                          {isNew && (
                            <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full animate-bounce">
                              NEW
                            </span>
                          )}
                          {announcement.priority === 'urgent' && (
                            <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                              URGENT
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <span>Posted by {announcement.createdBy?.name || 'Admin'}</span>
                        {announcement.targetAudience !== 'all' && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="capitalize">
                              For: {announcement.targetAudience}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">No announcements yet</p>
            {isAdmin() && (
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setShowCreateForm(true)}
              >
                Create First Announcement
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;