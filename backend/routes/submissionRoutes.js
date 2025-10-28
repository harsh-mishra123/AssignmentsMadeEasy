const express = require("express");
const router = express.Router();
const { protect, student, admin } = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js"); // multer setup
const {
  submitAssignment,
  getSubmissionsByAssignment,
  getMySubmissions,
  getAllSubmissions,
  updateSubmission,
  gradeSubmission,
} = require("../controllers/submissionController.js");

// Student submits an assignment (with file)
router.post(
  "/",
  protect,
  student,
  upload.single("file"), // key must match Postman form-data key
  submitAssignment
);

// Admin gets all submissions (must come before my-submissions to avoid conflicts)
router.get("/", protect, admin, getAllSubmissions);

// Student views their own submissions (must come before /:submissionId)
router.get("/my-submissions", protect, getMySubmissions);

// Student updates their submission (with optional file)
router.put(
  "/:submissionId",
  protect,
  student,
  upload.single("file"),
  updateSubmission
);

// Admin views all submissions for an assignment
router.get("/assignment/:assignmentId", protect, admin, getSubmissionsByAssignment);

// Admin grades a submission
router.put(
  "/:submissionId/grade",
  protect,
  admin,
  gradeSubmission
);

module.exports = router;
