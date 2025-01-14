const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token bulunamadı. Giriş yapın." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Token doğrulama
    const user = await User.findById(verified.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Kullanıcı bulunamadı. Giriş yapın." });
    }

    req.user = user; // Kullanıcıyı `req.user`'a atıyoruz
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Oturum süresi doldu. Lütfen tekrar giriş yapın." });
    }
    res.status(401).json({ message: "Geçersiz token" });
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
      if (req.user.role === "admin") {
        return next();
      }

    } catch (error) {
      res.status(500).json({ message: "Yetkilendirme hatası" });
    }
  };
};

module.exports = {
  authMiddleware,
  authorizeRoles,
};
