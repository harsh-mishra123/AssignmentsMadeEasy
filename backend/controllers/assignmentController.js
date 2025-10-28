const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Notification = require("../models/Notification");
const logActivity = require('../utils/logActivity');

// Admin creates an assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !dueDate) {
      return res
        .status(400)
        .json({ message: "Title and due date are required" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      createdBy: req.user._id, // comes from protect middleware
    });

    // 🔔 Notify all students about new assignment
    const students = await User.find({ role: "student" }).select("_id");
    if (students && students.length > 0) {
      const notifications = students.map((s) => ({
        user: s._id,
        message: `📘 New assignment: ${title} — due ${new Date(
          dueDate
        ).toLocaleString()}`,
        type: "assignment",
        isRead: false,
      }));

      await Notification.insertMany(notifications);
    }

    // Log activity
    await logActivity({
      user: req.user._id,
      action: `Created assignment ${assignment.title}`,
      referenceType: 'Assignment',
      referenceId: assignment._id,
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all assignments (for students/admin) with optional search and filter
const getAssignments = async (req, res, next) => {
  try {
    const { search, dueDate } = req.query;
    let filter = {};

    if (search) filter.title = { $regex: search, $options: 'i' };
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

    const assignments = await Assignment.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json(assignments);
  } catch (err) {
    next(err);
  }
};

// These submission functions are now handled by submissionController.js

// Admin views all submissions for an assignment
const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student views their own submissions
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate("assignment", "title description dueDate")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





module.exports = {
  createAssignment,
  getAssignments,
  getSubmissions,
  getMySubmissions,
};
