// middlewares/activityLogMiddleware.js
const ActivityLog = require("../models/ActivityLog");

const logActivity = async (req, user, action, resourceType, resourceId, details = {}) => {
  try {
    const log = new ActivityLog({
      user: user._id,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    await log.save();
  } catch (error) {
    console.error('Activity log creation error:', error);
  }
};

// Middleware factory function
const createActivityLogger = (action, resourceType) => {
  return async (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const resourceId = data._id || req.params.id;
        logActivity(req, req.user, action, resourceType, resourceId, data);
      }
      return originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  logActivity,
  createActivityLogger
};