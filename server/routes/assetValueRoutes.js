const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const AssetValue = require("../models/AssetValue");
const Product = require("../models/Product");

router.post("/calculate-risk", async (req, res) => {
  try {
    const weekNumber = req.body.weekNumber || 1;

    // Haftanın başlangıç ve bitiş tarihlerini hesaplama
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Pazartesi
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Pazar
    endOfWeek.setHours(23, 59, 59, 999);

    // weekRange'i istenen formatta oluştur
    const formatDate = (date) =>
      date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });

    const weekRange = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

    // Tüm product'ları getir
    const products = await Product.find();

    // Tüm taskleri, ilgili product'larla birlikte çek
    const tasks = await Task.find({ status: { $ne: "approved" } }) // Sadece onaylanmamış taskler
      .populate("assignedAsset", "criticalityDegree privacyDegree");

    // Risk hesaplama
    const riskSums = products.reduce((acc, product) => {
      // Başlangıç risk değerini sıfırla
      acc[product._id] = 0;

      // İlgili product için tasklerden risk hesapla
      tasks.forEach((task) => {
        if (
          task.assignedAsset &&
          String(task.assignedAsset._id) === String(product._id)
        ) {
          const criticalityDegree = parseFloat(product.criticalityDegree || 0);
          const privacyDegree = parseFloat(product.privacyDegree || 0);
          const taskRiskValue = criticalityDegree * privacyDegree;

          // Eğer deadline geçmişse risk puanını çarp
          if (new Date(task.deadline) <= Date.now()) {
            acc[product._id] += taskRiskValue * 2;
          } else {
            acc[product._id] += taskRiskValue;
          }
        }
      });

      return acc;
    }, {});

    // AssetValue güncellemesi
    const updates = await Promise.all(
      Object.entries(riskSums).map(async ([productId, totalRisk]) => {
        return AssetValue.findOneAndUpdate(
          { product: productId, weekNumber },
          { totalAssetValue: totalRisk, weekRange },
          { upsert: true, new: true }
        );
      })
    );

    res
      .status(200)
      .json({ message: "Risk values calculated and updated.", updates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET Route: Her ürün için toplam risk değerlerini getir
router.get("/risk-values", async (req, res) => {
  try {
    // AssetValue koleksiyonundan tüm değerleri çek
    const riskValues = await AssetValue.find().populate("product", "name"); // Product adını almak için populate
    res.status(200).json(riskValues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
