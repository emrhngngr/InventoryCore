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
    feedback: {
      type: String,
    },
    assignedTo: {
      type: String,
      enum: ["system_group", "a_group", "software_group", "technical_service"],
      required: true,
    },
    assignedAsset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    deadline: {
      type: Date,
      required: true,
    },
    riskValue: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["pending", "completed", "reviewing", "approved"],
      default: "pending",
    },
    completionNote: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);