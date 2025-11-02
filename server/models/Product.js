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
  amount: { type: Number, required: false, default: 1 },
  criticalityDegree: { type: Number, required: false, min: 1, max: 5, default: 1 },
  privacyDegree: { type: Number, required: false, min: 1, max: 5, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAuto: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
