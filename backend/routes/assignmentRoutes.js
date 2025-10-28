const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware.js");
const {
  createAssignment,
  getAssignments,
  getSubmissions,
} = require("../controllers/assignmentController.js");

// Admin routes
router.post("/", protect, admin, createAssignment);
router.get("/:assignmentId/submissions", protect, admin, getSubmissions);

// All authenticated users
router.get("/", protect, getAssignments);

module.exports = router;
