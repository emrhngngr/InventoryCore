const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const router = express.Router();

// Admin Giriş
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin bulunamadı." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Hatalı şifre." });

    const token = jwt.sign({ id: admin._id }, "adminsecretkey", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Sunucuda bir hata oluştu." });
  }
});

// Admin Kayıt (isteğe bağlı)
// router.post("/register", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin)
//       return res.status(400).json({ message: "Admin zaten kayıtlı." });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newAdmin = new Admin({ email, password: hashedPassword });
//     await newAdmin.save();

//     res.status(201).json({ message: "Admin kaydedildi." });
//   } catch (error) {
//     res.status(500).json({ message: "Sunucuda bir hata oluştu." });
//   }
// });

module.exports = router;
