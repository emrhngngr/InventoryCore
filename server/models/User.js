const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["system_group", "a_group", "software_group", "technical_service", "admin"],
      default: "system_group",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    profilePicture: {
      type: String, // Store the file path or URL
      default: null
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("User", userSchema);
