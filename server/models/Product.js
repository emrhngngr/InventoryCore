const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  dynamicAttributes: { type: Map, of: String },
  amount: { type: String, required: false },
  criticalityDegree: { type: String, required: false },
  privacyDegree: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
