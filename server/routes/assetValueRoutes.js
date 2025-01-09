const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const AssetValue = require('../models/AssetValue');


const getWeekRange = (year, week) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (week - 1) * 7;
  const startOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset - firstDayOfYear.getDay() + 1));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return `${startOfWeek.toLocaleDateString('tr-TR')} - ${endOfWeek.toLocaleDateString('tr-TR')}`;
};


// POST Route: Toplam risk değerlerini hesapla ve kaydet
router.post('/calculate-risk', async (req, res) => {
  try {
    const tasks = await Task.find();
    const allProductIds = new Set(tasks.map(task => task.assignedAsset).filter(Boolean));

    const riskSums = tasks.reduce((acc, task) => {
      if (task.assignedAsset) {
        acc[task.assignedAsset] = (acc[task.assignedAsset] || 0) + 
          (task.status !== "approved" ? task.riskValue : 0);
      }
      return acc;
    }, {});

    const currentYear = new Date().getFullYear();
    const weekNumber = req.body.weekNumber || 1;
    const weekRange = getWeekRange(currentYear, weekNumber);

    allProductIds.forEach(productId => {
      if (!(productId in riskSums)) riskSums[productId] = 0;
    });

    const updates = await Promise.all(
      Object.entries(riskSums).map(async ([productId, totalRisk]) => {
        return AssetValue.findOneAndUpdate(
          { product: productId, weekNumber },
          { totalAssetValue: totalRisk, weekRange },
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
