const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const AssetValue = require('../models/AssetValue');

// POST Route: Toplam risk değerlerini hesapla ve kaydet
router.post('/calculate-risk', async (req, res) => {
  try {
    // Tüm taskleri çek
    const tasks = await Task.find();

    // Product ID'ye göre riskValue toplamlarını hesapla
    const riskSums = tasks.reduce((acc, task) => {
      if (task.assignedAsset && task.status !== "approved") {
        acc[task.assignedAsset] = (acc[task.assignedAsset] || 0) + task.riskValue;
      }
      return acc;
    }, {});

    // AssetValue koleksiyonunu güncelle
    const updates = await Promise.all(
      Object.entries(riskSums).map(async ([productId, totalRisk]) => {
        return AssetValue.findOneAndUpdate(
          { product: productId, weekNumber: req.body.weekNumber || 1 },
          { totalAssetValue: totalRisk },
          { upsert: true, new: true }
        );
      })
    );

    res.status(200).json({ message: 'Risk values calculated and updated.', updates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET Route: Her ürün için toplam risk değerlerini getir
router.get('/risk-values', async (req, res) => {
  try {
    // AssetValue koleksiyonundan tüm değerleri çek
    const riskValues = await AssetValue.find().populate('product', 'name'); // Product adını almak için populate
    res.status(200).json(riskValues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
