// middlewares/validateUser.js
const validateUser = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tüm alanları doldurunuz" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Şifre en az 6 karakter olmalıdır" });
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Geçerli bir email adresi giriniz" });
  }

  next();
};

module.exports = validateUser;
