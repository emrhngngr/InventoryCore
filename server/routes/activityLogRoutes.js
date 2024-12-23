const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");

// Get all activity logs (only admin can access)
router.get("/", authMiddleware, authorizeRoles(["admin"]), async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Loglar getirilirken hata oluştu" });
  }
});

// Filter logs by date range
router.get("/filter", authMiddleware, authorizeRoles(["admin"]), async (req, res) => {
  try {
    const { startDate, endDate, userId, action, resourceType } = req.query;
    
    let query = {};
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (userId) query.user = userId;
    if (action) query.action = action;
    if (resourceType) query.resourceType = resourceType;
    
    const logs = await ActivityLog.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Loglar filtrelenirken hata oluştu" });
  }
});

module.exports = router;

