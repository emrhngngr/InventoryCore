const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Token bulunamadı");
  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).send("Geçersiz token");
  }
};

module.exports = authMiddleware;
