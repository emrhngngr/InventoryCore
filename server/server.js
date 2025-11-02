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

app.use((req, res, next) => {
  res.status(404).json({ message: "Page not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An error occurred, please try again later" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
