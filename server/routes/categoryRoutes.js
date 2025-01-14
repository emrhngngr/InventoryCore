const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); 
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware')
const { createActivityLogger } = require('../middlewares/activityLogMiddleware');

// Get all categories
router.get('/',
  authMiddleware, 
   async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Kategori Oluştur
router.post('/',
  authMiddleware, 
  createActivityLogger('create', 'category'),
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

// Kategori Güncelle
router.put('/:id', 
  authMiddleware, 
  createActivityLogger('update', 'category'),

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

// Kategori Sil
router.delete('/:id',
  authMiddleware, 
  createActivityLogger('delete', 'category'),
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