const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active announcement
router.get('/active', async (req, res) => {
  try {
    const activeAnnouncement = await Announcement.findOne({ isActive: true });
    res.status(200).json(activeAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new announcement
router.post('/', async (req, res) => {
  const announcement = new Announcement({
    content: req.body.content
  });

  try {
    const newAnnouncement = await announcement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update announcement
router.put('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Activate announcement
router.put('/activate/:id', async (req, res) => {
  try {
    await Announcement.updateMany({}, { isActive: false });
    
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;