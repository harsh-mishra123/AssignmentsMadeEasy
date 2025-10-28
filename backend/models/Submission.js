const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Submission content is required"],
    },
    feedback: {
      type: String,
      default: null,
    },
    fileUrl: {
      type: String,
      default: null, // File path for uploaded submission
    },
    grade: {
      type: String,
      default: null, // Admin will grade later
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
