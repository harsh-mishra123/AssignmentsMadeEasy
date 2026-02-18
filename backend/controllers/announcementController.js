const Announcement = require('../models/Announcement');
const User = require('../models/User');
const Notification = require('../models/Notification');
const logActivity = require('../utils/logActivity');

// @desc    Create new announcement (Admin only) with REAL-TIME emission
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority, targetAudience, expiresAt } = req.body;

    if (!title || !content) {
      res.status(400);
      return next(new Error('Title and content are required'));
    }

    // Create announcement
    const announcement = await Announcement.create({
      title,
      content,
      createdBy: req.user._id,
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      expiresAt: expiresAt || null
    });

    // Populate creator details
    await announcement.populate('createdBy', 'name email');

    // Create notifications for target users
    let targetUsers = [];
    if (targetAudience === 'all') {
      targetUsers = await User.find({}).select('_id');
    } else if (targetAudience === 'students') {
      targetUsers = await User.find({ role: 'student' }).select('_id');
    } else if (targetAudience === 'admins') {
      targetUsers = await User.find({ role: 'admin' }).select('_id');
    }

    // Create database notifications
    if (targetUsers.length > 0) {
      const notifications = targetUsers.map(user => ({
        user: user._id,
        message: `📢 New announcement: ${title}`,
        type: 'announcement',
        metadata: {
          announcementId: announcement._id,
          priority
        },
        isRead: false
      }));

      await Notification.insertMany(notifications);
    }

    // 🔥 EMIT REAL-TIME ANNOUNCEMENT VIA SOCKET.IO
    const io = req.app.get('io');
    if (io) {
      // Prepare the data to send
      const announcementData = {
        _id: announcement._id,
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        targetAudience: announcement.targetAudience,
        createdBy: {
          _id: announcement.createdBy._id,
          name: announcement.createdBy.name,
          email: announcement.createdBy.email
        },
        createdAt: announcement.createdAt,
        isNew: true
      };

      // Emit based on target audience
      if (targetAudience === 'all') {
        // Broadcast to all connected users
        io.emit('new-announcement', {
          announcement: announcementData,
          timestamp: new Date()
        });
        console.log(`📢 Real-time announcement broadcast to all users: ${title}`);
        
      } else if (targetAudience === 'students') {
        io.to('role:student').emit('new-announcement', {
          announcement: announcementData,
          timestamp: new Date()
        });
        console.log(`📢 Real-time announcement sent to students: ${title}`);
        
      } else if (targetAudience === 'admins') {
        io.to('role:admin').emit('new-announcement', {
          announcement: announcementData,
          timestamp: new Date()
        });
        console.log(`📢 Real-time announcement sent to admins: ${title}`);
      }
    }

    // Log activity
    await logActivity({
      user: req.user._id,
      action: `Created announcement: ${title}`,
      referenceType: 'Announcement',
      referenceId: announcement._id,
    });

    res.status(201).json({
      success: true,
      announcement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent announcements
// @route   GET /api/announcements/recent
// @access  Private
const getRecentAnnouncements = async (req, res, next) => {
  try {
    const filter = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    // Filter by user role
    if (req.user.role === 'student') {
      filter.targetAudience = { $in: ['all', 'students'] };
    } else if (req.user.role === 'admin') {
      filter.targetAudience = { $in: ['all', 'admins'] };
    }

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      announcements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all announcements (with pagination)
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };

    if (req.user.role === 'student') {
      filter.targetAudience = { $in: ['all', 'students'] };
    } else if (req.user.role === 'admin') {
      filter.targetAudience = { $in: ['all', 'admins'] };
    }

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      success: true,
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnnouncement,
  getRecentAnnouncements,
  getAnnouncements
};