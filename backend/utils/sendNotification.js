const Notification = require('../models/Notification');

const sendNotification = async ({ userId, message, type = 'info' }) => {
  try {
    await Notification.create({
      user: userId,
      message,
      type,
      isRead: false,
    });
    console.log(`Notification sent to user ${userId}: ${message}`);
  } catch (err) {
    console.error('Failed to send notification:', err.message);
    throw err;
  }
};

module.exports = sendNotification;