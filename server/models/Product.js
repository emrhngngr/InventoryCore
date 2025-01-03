const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  dynamicAttributes: { type: Map, of: String },
  assignedTo: {
    type: String,
    enum: [
      "system_group",
      "a_group",
      "software_group",
      "technical_service",
      "admin",
    ],
  },
  amount: { type: String, required: false },
  criticalityDegree: { type: String, required: false },
  privacyDegree: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAuto: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
