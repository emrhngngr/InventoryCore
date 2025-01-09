const mongoose = require('mongoose');

const AssetValueSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  weekNumber: {
    type: Number,
    required: true
  },
  totalAssetValue: {
    type: Number,
    default: 0
  },
  calculationDate: {
    type: Date,
    default: Date.now
  },
  weekRange: {
    type: String, // Örn: "01 Jan - 07 Jan"
    required: true
  }
});

module.exports = mongoose.model('AssetValue', AssetValueSchema);
