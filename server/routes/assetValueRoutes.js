// routes/assetValueRoutes.js
const express = require('express');
const router = express.Router();
const AssetValue = require('../models/AssetValue');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const moment = require('moment');

// Haftalık varlık değerlerini hesaplama fonksiyonu
async function calculateWeeklyAssetValues() {
  try {
    // Şu anki haftanın numarasını hesapla
    const currentWeekNumber = moment().week();

    // Tüm kategorileri al
    const categories = await Category.find();

    for (let category of categories) {
      // Bu kategorideki tüm ürünleri çek
      const products = await Product.find({ category: category._id });

      // Toplam varlık değerini hesapla
      const totalAssetValue = products.reduce((total, product) => {
        // Kritiklik ve gizlilik derecesini çarp
        const criticalityValue = parseInt(product.criticalityDegree || 1);
        const privacyValue = parseInt(product.privacyDegree || 1);
        const assetValue = criticalityValue * privacyValue;
        return total + assetValue;
      }, 0);

      // Hesaplanan değeri kaydet
      await AssetValue.findOneAndUpdate(
        { 
          category: category._id, 
          weekNumber: currentWeekNumber 
        },
        { 
          totalAssetValue: totalAssetValue,
          calculationDate: new Date()
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Haftalık varlık değeri hesaplamasında hata:', error);
  }
}

// Haftalık varlık değerlerini hesaplama route'u
router.post('/calculate', 
//   authMiddleware,
//   authorizeRoles(['read_products']),
  async (req, res) => {
    try {
      await calculateWeeklyAssetValues();
      res.json({ message: 'Haftalık varlık değerleri hesaplandı' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Tüm haftalık varlık değerlerini getirme
router.get('/', 
//   authMiddleware,
//   authorizeRoles(['read_products']),
  async (req, res) => {
    try {
      const assetValues = await AssetValue.find()
        .populate('category')
        .sort({ weekNumber: 1 });
      res.json(assetValues);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Belirli bir kategorinin haftalık varlık değerlerini getirme
router.get('/category/:categoryId', 
//   authMiddleware,
//   authorizeRoles(['read_products']),
  async (req, res) => {
    try {
      const assetValues = await AssetValue.find({ 
        category: req.params.categoryId 
      })
        .populate('category')
        .sort({ weekNumber: 1 });
      res.json(assetValues);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;