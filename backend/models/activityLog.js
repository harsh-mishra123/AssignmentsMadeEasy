const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    referenceType: { type: String }, // e.g., "Assignment", "Submission"
    referenceId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
