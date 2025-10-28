const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require("../controllers/notificationController.js");

// Get all notifications
router.get("/", protect, getNotifications);

// Get unread notifications count
router.get("/unread-count", protect, getUnreadCount);

// Mark a single notification as read
router.put("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.put("/read-all", protect, markAllAsRead);

module.exports = router;
