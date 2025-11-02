const mongoose = require("mongoose");

const database = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.log("MongoDB connection error:", err));
};

module.exports = database;
