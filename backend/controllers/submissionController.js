const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Student submits an assignment (with file upload)
// @route   POST /api/submissions
// @access  Private (Student)
const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId, content } = req.body;

    if (!assignmentId || !content) {
      res.status(400);
      return next(new Error("All fields are required"));
    }

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      res.status(404);
      return next(new Error("Assignment not found"));
    }

    // Check deadline
    const now = new Date();
    if (now > assignment.dueDate) {
      res.status(400);
      return next(new Error("Cannot submit after the due date"));
    }

    // Prevent duplicate submissions
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    if (existing) {
      res.status(400);
      return next(new Error("Already submitted this assignment"));
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      content,
      fileUrl: req.file ? req.file.path : null,
    });

    // Notify all admins about new submission
    const admins = await User.find({ role: 'admin' }).select('_id');
    if (admins && admins.length) {
      const adminNotifs = admins.map(admin => ({
        user: admin._id,
        message: `New submission by ${req.user.name} for "${assignment.title}".`,
        type: 'submission',
        isRead: false,
      }));
      await Notification.insertMany(adminNotifs);
    }

    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for an assignment (Admin only)
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private (Admin)
const getSubmissionsByAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email");

    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user submissions (students see their own, admins see all)
// @route   GET /api/submissions/my-submissions
// @access  Private (Student/Admin)
const getMySubmissions = async (req, res, next) => {
  try {
    let submissions;

    if (req.user.role === "admin") {
      submissions = await Submission.find({})
        .populate("assignment", "title dueDate")
        .populate("student", "name email")
        .sort({ createdAt: -1 });
    } else {
      submissions = await Submission.find({ student: req.user._id })
        .populate("assignment", "title dueDate")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};

// @desc    Student updates their submission
// @route   PUT /api/submissions/:submissionId
// @access  Private (Student)
const updateSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { content } = req.body;

    const submission = await Submission.findOne({
      _id: submissionId,
      student: req.user._id,
    });

    if (!submission) {
      res.status(404);
      return next(new Error("Submission not found or not authorized"));
    }

    // Update content if provided
    if (content) submission.content = content;

    // Update file if uploaded
    if (req.file) {
      submission.fileUrl = req.file.path;
    }

    await submission.save();

    res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin grades a submission
// @route   PUT /api/submissions/:submissionId/grade
// @access  Private (Admin)
const gradeSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    if (!grade || typeof grade !== "string") {
      res.status(400);
      return next(new Error("Valid grade is required"));
    }

    const submission = await Submission.findById(submissionId)
      .populate("student", "name email")
      .populate("assignment", "title");
    
    if (!submission) {
      res.status(404);
      return next(new Error("Submission not found"));
    }

    submission.grade = grade;
    if (feedback) {
      submission.feedback = feedback;
    }
    
    await submission.save();

    // Create notification for the student
    await Notification.create({
      user: submission.student._id,
      message: ` Your submission for "${submission.assignment.title}" has been graded: ${grade}`,
      type: "grade",
      isRead: false,
    });

    res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
};


// @desc    Get all submissions (Admin only)
// @route   GET /api/submissions
// @access  Private (Admin)
const getAllSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({})
      .populate("assignment", "title dueDate")
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAssignment,
  getSubmissionsByAssignment,
  getMySubmissions,
  getAllSubmissions,
  updateSubmission,
  gradeSubmission,
};
