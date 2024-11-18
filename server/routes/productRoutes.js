const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Ürün ekleme
router.post("/", authMiddleware, async (req, res) => {
  const { name, stock, price } = req.body;
  try {
    const newProduct = new Product({ name, stock, price });
    await newProduct.save();
    res.status(201).send("Ürün eklendi");
  } catch (error) {
    res.status(500).send("Ürün eklenemedi");
  }
});

// Tüm ürünleri listeleme
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Ürün güncelleme
router.put("/:id", authMiddleware, async (req, res) => {
  const { name, stock, price } = req.body;
  try {
    await Product.findByIdAndUpdate(req.params.id, { name, stock, price });
    res.send("Ürün güncellendi");
  } catch (error) {
    res.status(500).send("Ürün güncellenemedi");
  }
});

// Ürün silme
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send("Ürün silindi");
  } catch (error) {
    res.status(500).send("Ürün silinemedi");
  }
});

module.exports = router;
