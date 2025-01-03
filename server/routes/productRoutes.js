const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware')
const { createActivityLogger } = require('../middlewares/activityLogMiddleware');

// Get all products with populated category
router.get("/",
  authMiddleware, 
  // authorizeRoles(['read_products']),
   async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post("/", 
  authMiddleware, 
  // authorizeRoles(['create_products']),
  createActivityLogger('create', 'product'),
  async (req, res) => {
  const { name, category, dynamicAttributes, assignedTo, amount, criticalityDegree, privacyDegree } = req.body;

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
      privacyDegree
    });
    console.log("newProduct ==> ", newProduct);
    
    const savedProduct = await newProduct.save();
    await savedProduct.populate('category');
    
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.put("/:id",
  authMiddleware, 
  // authorizeRoles(['edit_products']),
  createActivityLogger('update', 'product'),
   async (req, res) => {
  try {
    const { name, category, dynamicAttributes, assignedTo, amount, criticalityDegree, privacyDegree, isAuto} = req.body;
    const updatedAt = Date.now()

    // Validate category exists
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
        isAuto
      }, 
      { new: true }
    ).populate('category');

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete("/:id",
  authMiddleware, 
  // authorizeRoles(['delete_products']),
  createActivityLogger('delete', 'product'),
   async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/confirm", 
  authMiddleware, 
  // authorizeRoles(['update_products']),
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id, 
        { updatedAt: Date.now() }, 
        { new: true }
      ).populate('category');

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

module.exports = router;