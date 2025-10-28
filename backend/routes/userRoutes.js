const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController.js');
const { protect, admin, student } = require('../middleware/authMiddleware.js');

// Note: OTP functionality requires authController to be implemented

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/', protect, getAllUsers); // any logged-in user

// Example student-only content
router.get('/students', protect, student, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, this is student content.` });
});

// Example admin-only content
router.get('/admin', protect, admin, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, this is admin content.` });
});

module.exports = router;
