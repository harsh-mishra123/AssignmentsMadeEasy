// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register user with hashed password
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate role - only allow 'student' or 'admin'
    let userRole = "student"; // default
    if (role && (role === "admin" || role === "student")) {
      userRole = role;
    }

    // Create user with specified role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Generate token for immediate login
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ 
      success: true,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      message: "Registration successful"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user (no changes needed here)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      message: "Login successful"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users (password excluded)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW: Update user role (admin only function)
const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Only admins can access this (already checked in routes)
  if (!role || !["student", "admin"].includes(role)) {
    return res.status(400).json({ 
      success: false, 
      message: "Valid role (student or admin) is required" 
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW: Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW: Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  getAllUsers,
  updateUserRole,
  getAllAdmins,
  getAllStudents
};