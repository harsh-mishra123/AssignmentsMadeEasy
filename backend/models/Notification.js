// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['assignment', 'grade', 'submission', 'info'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
