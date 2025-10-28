// controllers/authController.js
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// @desc Send OTP to email
// @route POST /api/users/send-otp
// @access Public
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  let user = await User.findOne({ email });

  if (!user) {
    // Auto-create if new user
    user = await User.create({ name: email.split("@")[0], email });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
  await user.save();

  await sendEmail(user.email, "Your OTP Code", `Your OTP is: ${otp}`);

  res.status(200).json({ message: "OTP sent to email" });
};

// @desc Verify OTP and login
// @route POST /api/users/verify-otp
// @access Public
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // clear OTP after success
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

module.exports = { sendOtp, verifyOtp };

