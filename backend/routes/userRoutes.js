// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getAllUsers,
  updateUserRole,
  getAllAdmins,
  getAllStudents
} = require('../controllers/userController.js');
const { protect, admin, student } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (any logged-in user)
router.get('/', protect, getAllUsers);

// NEW: Get all admins (public or protected - your choice)
router.get('/admins', getAllAdmins);

// NEW: Get all students (public or protected - your choice)
router.get('/students-list', getAllStudents);

// NEW: Update user role (admin only)
router.put('/:userId/role', protect, admin, updateUserRole);

// Example student-only content
router.get('/student-content', protect, student, (req, res) => {
  res.json({ 
    success: true,
    message: `Hello ${req.user.name}, this is student content.` 
  });
});

// Example admin-only content
router.get('/admin-content', protect, admin, (req, res) => {
  res.json({ 
    success: true,
    message: `Hello ${req.user.name}, this is admin content.` 
  });
});

module.exports = router;