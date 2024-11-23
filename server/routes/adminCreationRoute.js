const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Route for creating initial admin (should be protected in production)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, adminCreationKey } = req.body;

    // Add a secure admin creation key in production
    const ADMIN_CREATION_KEY =
      process.env.ADMIN_CREATION_KEY;

    // Validate admin creation key
    if (adminCreationKey !== ADMIN_CREATION_KEY) {
      return res.status(403).json({ message: "Invalid admin creation key" });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      permissions: [
        "read_products",
        "create_products",
        "edit_products",
        "delete_products",
        "read_users",
        "manage_users",
      ],
    });

    // Save admin user
    await adminUser.save();

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ message: "Server error during admin creation" });
  }
});

module.exports = router;
