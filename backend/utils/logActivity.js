const ActivityLog = require('../models/activityLog');

const logActivity = async ({ user, action, referenceType, referenceId }) => {
  try {
    await ActivityLog.create({ user, action, referenceType, referenceId });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = logActivity;
