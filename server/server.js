const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./config/database.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

database();

app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/products", require("./routes/productRoutes"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
