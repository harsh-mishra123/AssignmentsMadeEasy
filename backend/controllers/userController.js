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

    // Create user with role (default to student if not provided)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student", // default role
    });

    res.status(201).json({ 
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
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
      { id: user._id, role: user.role }, // include role in token for easy access in middleware
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
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
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getAllUsers };
