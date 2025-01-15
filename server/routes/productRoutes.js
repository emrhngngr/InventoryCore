const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const {
  createActivityLogger,
} = require("../middlewares/activityLogMiddleware");
const AssetValue = require("../models/AssetValue");
const Task = require("../models/Task");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Varlık Oluştur
router.post(
  "/",
  authMiddleware,
  authorizeRoles(["admin"]),
  createActivityLogger("create", "product"),
  async (req, res) => {
    const {
      name,
      category,
      dynamicAttributes,
      assignedTo,
      amount,
      criticalityDegree,
      privacyDegree,
    } = req.body;

    try {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      const newProduct = new Product({
        name,
        category,
        dynamicAttributes,
        assignedTo,
        amount,
        criticalityDegree,
        privacyDegree,
      });
      console.log("newProduct ==> ", newProduct);

      const savedProduct = await newProduct.save();
      await savedProduct.populate("category");

      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Varlığı Güncelle
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  createActivityLogger("update", "product"),
  async (req, res) => {
    try {
      const {
        name,
        category,
        dynamicAttributes,
        assignedTo,
        amount,
        criticalityDegree,
        privacyDegree,
        isAuto,
      } = req.body;
      const updatedAt = Date.now();
      let totalAssetValue = 0;

      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          category,
          dynamicAttributes,
          assignedTo,
          amount,
          criticalityDegree,
          privacyDegree,
          updatedAt,
          isAuto,
        },
        { new: true }
      ).populate("category");

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const existingAssetValues = await AssetValue.find({
        product: req.params.id,
      });

      totalAssetValue =
        parseInt(updatedProduct.privacyDegree) *
        parseInt(updatedProduct.criticalityDegree);

      if (existingAssetValues.length > 0) {
        await AssetValue.updateMany(
          { product: req.params.id },
          { totalAssetValue }
        );
      }

      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Varlığı Sil
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  createActivityLogger("delete", "product"),
  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      await AssetValue.deleteMany({ product: req.params.id });
      await Task.deleteMany({ assignedAsset: req.params.id });

      res.json({
        message: "Product and related AssetValues deleted successfully",
        deletedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/:id/confirm",
  authMiddleware,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { updatedAt: Date.now() },
        { new: true }
      ).populate("category");

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
