const express = require('express');
const router = express.Router();
const Category = require('../models/Category');  // Assuming you have a Category model
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware')

// Get all categories
router.get('/',
  authMiddleware, 
  authorizeRoles(['read_categories']),
   async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new category
router.post('/',
  authMiddleware, 
  authorizeRoles(['create_categories']),
   async (req, res) => {
  const category = new Category({
    name: req.body.name,
    attributes: req.body.attributes
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a category
router.put('/:id', 
  authMiddleware, 
  authorizeRoles(['edit_categories']),
  async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id, 
      {
        name: req.body.name,
        attributes: req.body.attributes
      }, 
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a category
router.delete('/:id',
  authMiddleware, 
  authorizeRoles(['delete_categories']),
   async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.json({ message: 'Kategori silindi', deletedCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;