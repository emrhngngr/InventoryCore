const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token not found. Please login." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Token verification
    const user = await User.findById(verified.id);

    if (!user) {
      return res.status(401).json({ message: "User not found. Please login." });
    }

    req.user = user; // Attach user to req.user
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

// Role-Based Authorization Middleware
const authorizeRoles = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      console.log("req.user ==> ", req.user);
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      // If user is admin, allow all actions
      if (req.user.role === "admin") {
        return next();
      }

    } catch (error) {
      res.status(500).json({ message: "Authorization error" });
    }
  };
};

module.exports = {
  authMiddleware,
  authorizeRoles,
};
