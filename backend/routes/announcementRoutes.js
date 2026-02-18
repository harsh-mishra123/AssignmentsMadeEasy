const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createAnnouncement,
  getRecentAnnouncements,
  getAnnouncements
} = require('../controllers/announcementController');

// Public routes (authenticated users)
router.get('/recent', protect, getRecentAnnouncements);
router.get('/', protect, getAnnouncements);

// Admin only routes
router.post('/', protect, admin, createAnnouncement);

module.exports = router;