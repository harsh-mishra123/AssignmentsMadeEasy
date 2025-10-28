const Notification = require("../models/Notification");

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);

    if (!notif) {
      res.status(404);
      return next(new Error("Notification not found"));
    }

    // Ensure only recipient can mark read
    if (notif.user.toString() !== (req.user._id || req.user.id).toString()) {
      res.status(403);
      return next(new Error("Not authorized"));
    }

    notif.isRead = true;
    await notif.save();

    res.status(200).json({ success: true, notification: notif });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });
    res.status(200).json({ success: true, unreadCount: count });
  } catch (err) {
    next(err);
  }
};
module.exports = { getNotifications, markAsRead, markAllAsRead, getUnreadCount };
