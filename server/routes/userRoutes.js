const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware')

// User Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Kullanıcı bulunamadı" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Geçersiz şifre" });
        }

        // Create JWT Token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                permissions: user.permissions 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Remove sensitive information before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Giriş sırasında bir hata oluştu" });
    }
});
//get all
router.get('/', 
    authMiddleware, 
    authorizeRoles(['read_users', 'manage_users']), 
    async (req, res) => {
        try {
            // Exclude password when sending user data
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Kullanıcıları getirirken hata oluştu" });
        }
    }
);
//add user
router.post('/', 
    authMiddleware, 
    authorizeRoles(['manage_users']), 
    async (req, res) => {
        try {
            const { name, email, password, role, permissions } = req.body;

            // Check if user already exists
            if (req.user.role !== 'admin' && role === 'admin') {
                return res.status(403).json({ message: 'Admin ekleme yetkiniz yok.' });
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı" });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role,
                permissions: role === 'admin' ? 
                    ['read_products', 'create_products', 'edit_products', 'delete_products', 'read_users', 'manage_users'] 
                    : permissions
            });

            await newUser.save();

            // Remove password before sending response
            const userResponse = newUser.toObject();
            delete userResponse.password;

            res.status(201).json(userResponse);
        } catch (error) {
            console.error('User creation error:', error);
            res.status(500).json({ message: "Kullanıcı oluşturulurken hata oluştu" });
        }
    }
);


//şu anki kişinin bilgilerini al
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.json(user);
    } catch (error) {
        console.error('auth/me error:', error);
        res.status(500).json({ message: "Kullanıcı bilgileri alınırken hata oluştu" });
    }
});

// Update user
router.put('/:id', 
    authMiddleware, 
    authorizeRoles(['manage_users']), 
    async (req, res) => {
        try {
            const { name, email, role, permissions } = req.body;
            const updateData = { name, email, role, permissions };

            // If password is provided, hash it
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(req.body.password, salt);
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: "Kullanıcı bulunamadı" });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Kullanıcı güncellenirken hata oluştu" });
        }
    }
);

//delete user
router.delete('/:id', 
    authMiddleware, 
    authorizeRoles(['manage_users']), 
    async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "Kullanıcı bulunamadı" });
            }
            res.json({ message: "Kullanıcı başarıyla silindi" });
        } catch (error) {
            res.status(500).json({ message: "Kullanıcı silinirken hata oluştu" });
        }
    }
);

module.exports = router;
