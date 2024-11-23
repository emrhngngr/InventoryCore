const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send("Token bulunamadı");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id);
        
        if (!user) return res.status(401).send("Kullanıcı bulunamadı");
        
        req.user = user; // User bilgilerini req.user içine atıyoruz
        next();
    } catch (error) {
        res.status(401).send("Geçersiz token");
    }
};

// Role-Based Authorization Middleware
const authorizeRoles = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Yetkisiz erişim" });
            }

            // Eğer kullanıcı admin ise, tüm işlemler için yetkili sayılacak
            if (req.user.role === 'admin') {
                return next();
            }

            // Kullanıcı gerekli izinlere sahip mi kontrol et
            const hasRequiredPermissions = requiredPermissions.every(permission => 
                req.user.permissions.includes(permission)
            );

            if (hasRequiredPermissions) {
                next();
            } else {
                res.status(403).json({ message: "Bu işlemi yapmaya yetkiniz yok" });
            }
        } catch (error) {
            res.status(500).json({ message: "Yetkilendirme hatası" });
        }
    };
};

module.exports = { 
    authMiddleware, 
    authorizeRoles 
};
