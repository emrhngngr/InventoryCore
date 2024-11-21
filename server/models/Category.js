const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  attributes: { type: [String], required: true }, // Dinamik alanlar
});

module.exports = mongoose.model("Category", CategorySchema);
