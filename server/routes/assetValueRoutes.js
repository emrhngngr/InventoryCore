const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const AssetValue = require("../models/AssetValue");
const Product = require("../models/Product");
const excel = require("excel4node");


router.get("/download-excel", async (req, res) => {
  try {
    const riskValues = await AssetValue.find()
      .populate({
        path: 'product',
        model: 'Product',
        select: 'name criticalityDegree privacyDegree assignedTo amount'
      })
      .sort({ weekNumber: 1 });
    
    const wb = new excel.Workbook();
    const ws = wb.addWorksheet('Risk Values');
    
    const headerStyle = wb.createStyle({
      font: {
        bold: true,
        size: 12,
      },
      alignment: {
        horizontal: 'center',
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#E0E0E0',
      },
    });

    const headers = [
      'Hafta Aralığı',
      'Varlık Adı',
      'Risk Değeri',
      'Kritiklik Derecesi',
      'Gizlilik Derecesi',
      'Atanan Grup',
      'Miktar'
    ];

    headers.forEach((header, idx) => {
      ws.cell(1, idx + 1)
        .string(header)
        .style(headerStyle);
    });

    riskValues.forEach((value, idx) => {
      const row = idx + 2;
      
      ws.cell(row, 1).string(value.weekRange || '');
      ws.cell(row, 2).string(value.product?.name || 'Bilinmeyen');
      ws.cell(row, 3).number(value.totalAssetValue || 0);
      ws.cell(row, 4).string(value.product?.criticalityDegree || '');
      ws.cell(row, 5).string(value.product?.privacyDegree || '');
      ws.cell(row, 6).string(value.product?.assignedTo || '');
      ws.cell(row, 7).string(value.product?.amount?.toString() || '');
    });

    headers.forEach((_, idx) => {
      ws.column(idx + 1).setWidth(20);
    });
    
    // Set response headers
    res.setHeader(
      'Content-Type', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition', 
      'attachment; filename=varlik-risk-degerleri.xlsx'
    );
    
    wb.write('varlik-risk-degerleri.xlsx', res);
  } catch (error) {
    console.error('Excel indirme hatası:', error);
    res.status(500).json({ error: "Excel dosyası oluşturulurken bir hata oluştu." });
  }
});

router.post("/calculate-risk", async (req, res) => {
  try {
    const weekNumber = req.body.weekNumber || 1;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const formatDate = (date) =>
      date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });

    const weekRange = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

    const products = await Product.find();

    const tasks = await Task.find({ status: { $ne: "approved" } })
      .populate("assignedAsset", "criticalityDegree privacyDegree");

    const riskSums = products.reduce((acc, product) => {
      // Başlangıç risk değerini sıfırla
      acc[product._id] = 0;

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
