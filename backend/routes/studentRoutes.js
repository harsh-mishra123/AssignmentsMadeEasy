const express = require("express");
const router = express.Router();
const { protect, student } = require("../middleware/authMiddleware.js");
const {
  getAssignments,
  getMySubmissions,
} = require("../controllers/assignmentController.js");

// Student views all assignments
router.get("/assignments", protect, student, getAssignments);

// Student views their own submissions
router.get("/submissions", protect, student, getMySubmissions);

module.exports = router;
