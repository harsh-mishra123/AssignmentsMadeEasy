// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // still used for normal login
  role: { type: String, enum: ["student", "admin"], default: "student" },
  
  // OTP login fields
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
