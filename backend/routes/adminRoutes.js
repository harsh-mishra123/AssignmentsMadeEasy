const express = require("express");
const {
  createAssignment,
  getSubmissions,
} = require("../controllers/assignmentController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin creates a new assignment
router.post("/assignments", protect, admin, createAssignment);

// Admin gets all submissions for a particular assignment
router.get("/assignments/:assignmentId/submissions", protect, admin, getSubmissions);

module.exports = router;
