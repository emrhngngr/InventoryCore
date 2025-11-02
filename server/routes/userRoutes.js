const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  createActivityLogger,
} = require("../middlewares/activityLogMiddleware");
const router = express.Router();
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const validateUser = require("../middlewares/validateUser");
const multer = require("multer");
const path = require("path");

// Multer settings for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
// User login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

  // Create JWT token
    const token = jwt.sign(
      {
          id: user._id,
          email: user.email,
          role: user.role,
      },
      process.env.JWT_SECRET,
      { 
          expiresIn: '24h', 
          algorithm: 'HS256'
      }
  );

  // Remove password from response and return the rest
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
});
router.get("/roles", async (req, res) => {
  try {
    const roles = User.getRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching roles." });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});
// Create user
router.post(
  "/",
  authMiddleware,
  
  createActivityLogger("create", "user"),
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (req.user.role !== "admin" && role === "admin") {
        return res.status(403).json({ message: "You do not have permission to add an admin." });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "This email is already registered" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        profilePicture: req.file ? req.file.path : null,
      });

      console.log("newUser ==> ", newUser);
      await newUser.save();

      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json(userResponse);
    } catch (error) {
      console.error("User creation error:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  }
);

// Get current user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("auth/me error:", error);
    res.status(500).json({ message: "Error fetching user info" });
  }
});

// Update user
router.put(
  "/:id",
  authMiddleware,
  upload.single("profilePicture"),
  createActivityLogger("update", "user"),

  async (req, res) => {
    try {
      const { name, email, role } = req.body;
      const updateData = { name, email, role };

      if (req.file) {
        updateData.profilePicture = req.file.path;
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(req.body.password, salt);
      }

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  }
);

// Delete user
router.delete(
  "/:id",
  authMiddleware,
  createActivityLogger("delete", "user"),

  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  }
);

module.exports = router;
