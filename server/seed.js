const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Announcement = require("./models/Announcement");
const Task = require("./models/Task");
const AssetValue = require("./models/AssetValue");
const ActivityLog = require("./models/ActivityLog");

dotenv.config();

// Helper function to get week number
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Helper function to get week range string
function getWeekRange(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const options = { day: '2-digit', month: 'short' };
  const start = startOfWeek.toLocaleDateString('en-US', options);
  const end = endOfWeek.toLocaleDateString('en-US', options);
  
  return `${start} - ${end}`;
}

const seedDatabase = async () => {
  try {
  // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection successful");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Announcement.deleteMany({});
    await Task.deleteMany({});
    await AssetValue.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log("🗑️  Old data cleared");

    // 1. Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("👤 Admin user created");

    // 2. Create sample users
    const users = await User.insertMany([
      {
        name: "System Group User",
        email: "system@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "system_group",
      },
      {
        name: "A Group User",
        email: "agroup@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "a_group",
      },
      {
        name: "Software Group User",
        email: "software@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "software_group",
      },
      {
        name: "Technical Service User",
        email: "technical@example.com",
        password: await bcrypt.hash("123456", 10),
        role: "technical_service",
      },
    ]);
    console.log("👥 Sample users created");

    // 3. Create categories
    const categories = await Category.insertMany([
      {
        name: "Computer",
        attributes: ["brand", "model", "processor", "ram", "storage"],
      },
      {
        name: "Printer",
        attributes: ["brand", "model", "type", "resolution"],
      },
      {
        name: "Monitor",
        attributes: ["brand", "model", "size", "resolution", "panel type"],
      },
      {
        name: "Network Equipment",
        attributes: ["brand", "model", "type", "port count"],
      },
      {
        name: "Phone",
        attributes: ["brand", "model", "extension"],
      },
      {
        name: "Furniture",
        attributes: ["type", "color", "material"],
      },
    ]);
    console.log("📦 Categories created");

    // 4. Create sample products with varied creation dates
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

    const products = await Product.insertMany([
      {
        name: "Dell OptiPlex 7080",
        category: categories[0]._id, // Computer
        dynamicAttributes: {
          brand: "Dell",
          model: "OptiPlex 7080",
          processor: "Intel Core i7-10700",
          ram: "16GB DDR4",
          storage: "512GB SSD",
        },
        assignedTo: "software_group",
        amount: 5,
        criticalityDegree: 4,
        privacyDegree: 3,
        createdAt: twoWeeksAgo,
        updatedAt: twoWeeksAgo, // Not updated - needs review
      },
      {
        name: "HP LaserJet Pro M404dn",
        category: categories[1]._id, // Printer
        dynamicAttributes: {
          brand: "HP",
          model: "LaserJet Pro M404dn",
          type: "Laser",
          resolution: "1200x1200 DPI",
        },
        assignedTo: "a_group",
        amount: 2,
        criticalityDegree: 3,
        privacyDegree: 2,
        createdAt: oneWeekAgo,
        updatedAt: threeDaysAgo, // Updated recently
      },
      {
        name: "LG 27UL850",
        category: categories[2]._id, // Monitor
        dynamicAttributes: {
          brand: "LG",
          model: "27UL850",
          size: "27 inch",
          resolution: "3840x2160 (4K)",
          "panel type": "IPS",
        },
        assignedTo: "software_group",
        amount: 10,
        criticalityDegree: 3,
        privacyDegree: 2,
        createdAt: threeWeeksAgo,
        updatedAt: threeWeeksAgo, // Very old - needs update
      },
      {
        name: "Cisco Catalyst 2960",
        category: categories[3]._id, // Network Equipment
        dynamicAttributes: {
          brand: "Cisco",
          model: "Catalyst 2960",
          type: "Switch",
          "port count": "24",
        },
        assignedTo: "system_group",
        amount: 3,
        criticalityDegree: 5,
        privacyDegree: 4,
        createdAt: oneWeekAgo,
        updatedAt: now, // Just updated
      },
      {
        name: "Cisco IP Phone 7841",
        category: categories[4]._id, // Phone
        dynamicAttributes: {
          brand: "Cisco",
          model: "IP Phone 7841",
          extension: "1234",
        },
        assignedTo: "system_group",
        amount: 15,
        criticalityDegree: 3,
        privacyDegree: 2,
        createdAt: twoWeeksAgo,
        updatedAt: oneWeekAgo, // Slightly old
      },
      {
        name: "Office Desk",
        category: categories[5]._id, // Furniture
        dynamicAttributes: {
          type: "Desk",
          color: "White",
          material: "Wood",
        },
        assignedTo: "a_group",
        amount: 20,
        criticalityDegree: 2,
        privacyDegree: 1,
        createdAt: threeWeeksAgo,
        updatedAt: twoWeeksAgo, // Old - needs update
      },
    ]);
    console.log("🏷️  Sample products created");

    // 5. Create sample announcement
    await Announcement.create({
      title: "Welcome!",
      content: "Welcome to the Inventory Management System. You can easily track all your equipment with this system.",
      createdBy: adminUser._id,
      isActive: true,
    });
    console.log("📢 Sample announcement created");

    // 6. Create sample tasks
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Task.insertMany([
      {
        title: "Update Network Switch Firmware",
        description: "Update the Cisco Catalyst 2960 switch firmware to the latest version for security improvements.",
        assignedTo: "system_group",
        assignedAsset: products[3]._id, // Cisco Catalyst 2960
        deadline: nextWeek,
        riskValue: 8,
        status: "pending",
        createdBy: adminUser._id,
      },
      {
        title: "Install Software Updates",
        description: "Install latest Windows updates and security patches on all Dell OptiPlex computers.",
        assignedTo: "software_group",
        assignedAsset: products[0]._id, // Dell OptiPlex 7080
        deadline: tomorrow,
        riskValue: 6,
        status: "pending",
        createdBy: adminUser._id,
      },
      {
        title: "Printer Maintenance",
        description: "Perform routine maintenance on HP LaserJet printers including cleaning and toner check.",
        assignedTo: "technical_service",
        assignedAsset: products[1]._id, // HP LaserJet
        deadline: nextWeek,
        riskValue: 3,
        status: "pending",
        createdBy: adminUser._id,
      },
    ]);
    console.log("📋 Sample tasks created");

    // 7. Create sample asset values for tracking
    const currentWeek = getWeekNumber(new Date());
    const assetValues = [];
    
    // Create asset values for each product for the last 4 weeks
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      for (let weekOffset = 3; weekOffset >= 0; weekOffset--) {
        const weekNum = currentWeek - weekOffset;
        const calculationDate = new Date();
        calculationDate.setDate(calculationDate.getDate() - (weekOffset * 7));
        
        // Calculate total asset value
        const totalValue = (product.criticalityDegree || 1) * (product.privacyDegree || 1) * (product.amount || 1);
        
        assetValues.push({
          product: product._id,
          weekNumber: weekNum,
          totalAssetValue: Math.round(totalValue), // Integer value only
          calculationDate: calculationDate,
          weekRange: getWeekRange(calculationDate)
        });
      }
    }
    
    await AssetValue.insertMany(assetValues);
    console.log("📊 Sample asset values created");

    console.log("\n✨ Database seeded successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 Admin:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");
    console.log("\n👤 System Group:");
    console.log("   Email: system@example.com");
    console.log("   Password: 123456");
    console.log("\n👤 A Group:");
    console.log("   Email: agroup@example.com");
    console.log("   Password: 123456");
    console.log("\n👤 Software Group:");
    console.log("   Email: software@example.com");
    console.log("   Password: 123456");
    console.log("\n👤 Technical Service:");
    console.log("   Email: technical@example.com");
    console.log("   Password: 123456");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedDatabase();
