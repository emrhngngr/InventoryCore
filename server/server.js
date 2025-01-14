const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./config/database.js");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

database();

app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes.js"));
// app.use("/api/create-admin", require("./routes/adminCreationRoute.js"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/asset-values", require("./routes/assetValueRoutes.js"));
app.use("/api/announcements", require("./routes/announcementRoutes.js"));
app.use("/api/activity-logs", require("./routes/activityLogRoutes.js"));
app.use("/api/tasks", require("./routes/taskRoutes.js"));

// Tüm diğer route'lara uymayan istekler için
app.use((req, res, next) => {
  res.status(404).json({ message: "Sayfa bulunamadı" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Bir hata oluştu, lütfen daha sonra tekrar deneyin" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
