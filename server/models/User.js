const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "product_viewer", "product_manager", "category_manager","user_manager","admin"],
      default: "user",
    },
    permissions: [
      {
        type: String,
        enum: [
          "read_products",
          "create_products",
          "edit_products",
          "delete_products",
          "read_categories",
          "create_categories",
          "edit_categories",
          "delete_categories",
          "read_users",
          "manage_users",
        ],
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add a method to check if user has a specific permission
userSchema.methods.hasPermission = function (permission) {
  return this.permissions.includes(permission) || this.role === "admin";
};

module.exports = mongoose.model("User", userSchema);
