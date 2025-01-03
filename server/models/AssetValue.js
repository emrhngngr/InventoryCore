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
});

module.exports = mongoose.model('AssetValue', AssetValueSchema);
