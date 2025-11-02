const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const AssetValue = require('./models/AssetValue');

dotenv.config();

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find().lean();

    for (const p of products) {
      const values = await AssetValue.find({ product: p._id }).sort({ weekNumber: 1 }).lean();
      console.log('\n---');
      console.log(`Product: ${p.name} (id: ${p._id})`);
      if (!values.length) {
        console.log('  No asset values found');
        continue;
      }
      console.log(`  AssetValue count: ${values.length}`);
      values.forEach(v => {
        console.log(`    week: ${v.weekNumber}  totalAssetValue: ${v.totalAssetValue}  date: ${new Date(v.calculationDate).toISOString().split('T')[0]}  weekRange: ${v.weekRange}`);
      });
    }

    await mongoose.disconnect();
    console.log('\nDone');
  } catch (err) {
    console.error('Error inspecting asset values:', err);
    process.exit(1);
  }
}

inspect();
