const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).json({ message: "Yetkisiz erişim." });

  try {
    const verified = jwt.verify(token, "adminsecretkey");
    req.admin = verified.id; // Admin ID'yi isteğe ekle
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token." });
  }
};

module.exports = authAdmin;
