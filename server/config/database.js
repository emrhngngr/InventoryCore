const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB bağlantısı başarılı"))
    .catch((err) => console.log("MongoDB bağlantı hatası:", err));
};

module.exports = database;
