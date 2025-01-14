const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { name, email, password, adminCreationKey } = req.body;

    const ADMIN_CREATION_KEY =
      process.env.ADMIN_CREATION_KEY;

    if (adminCreationKey !== ADMIN_CREATION_KEY) {
      return res.status(403).json({ message: "Invalid admin creation key" });
    }

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

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
