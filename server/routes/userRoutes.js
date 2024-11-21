const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Kullanıcı kaydı
// router.post('/register', async (req, res) => {
//     try {
//         const { name, email, password, isAdmin } = req.body;
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const newUser = new User({ name, email, password: hashedPassword, isAdmin });
//         await newUser.save();
//         res.status(201).send('Kullanıcı kaydedildi');
//     } catch (error) {
//         res.status(500).send('Kayıt başarısız');
//     }
// });

// Kullanıcı girişi
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Kullanıcı bulunamadı');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Şifre yanlış');
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Giriş başarısız');
    }
});

module.exports = router;
