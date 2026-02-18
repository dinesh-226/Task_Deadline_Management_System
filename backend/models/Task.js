const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedIntern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    submissionFile: {
      type: String,
      default: ""
    },
    submittedBy: {
      type: require("mongoose").Schema.Types.ObjectId,
      ref: "User"
    },
    submittedFile: {
    fileName: String,
    filePath: String,
    uploadedAt: Date
  }


  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
