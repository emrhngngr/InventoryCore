const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

async function checkDates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const products = await Product.find().lean();

    console.log('Product Dates (to verify varied creation/update times):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    products.forEach(p => {
      const created = new Date(p.createdAt);
      const updated = new Date(p.updatedAt);
      const daysSinceUpdate = Math.floor((now - updated) / (1000 * 60 * 60 * 24));
      const needsUpdate = updated < oneWeekAgo ? '⚠️ NEEDS UPDATE' : '✅ Current';
      
      console.log(`\n${p.name}`);
      console.log(`  Created:  ${created.toISOString().split('T')[0]}`);
      console.log(`  Updated:  ${updated.toISOString().split('T')[0]} (${daysSinceUpdate} days ago)`);
      console.log(`  Status:   ${needsUpdate}`);
    });

    await mongoose.disconnect();
    console.log('\n\nDone');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDates();
