const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Task = require('./models/Task');

dotenv.config();

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find().lean();

    for (const p of products) {
      const tasks = await Task.find({ assignedAsset: p._id }).lean();
      console.log('\n---');
      console.log(`Product: ${p.name} (id: ${p._id})`);
      if (!tasks.length) {
        console.log('  No tasks found');
        continue;
      }
      console.log(`  Task count: ${tasks.length}`);
      tasks.forEach(t => {
        console.log(`    title: ${t.title}  assignedTo: ${t.assignedTo}  deadline: ${new Date(t.deadline).toISOString().split('T')[0]}  risk: ${t.riskValue}`);
      });
    }

    await mongoose.disconnect();
    console.log('\nDone');
  } catch (err) {
    console.error('Error inspecting tasks:', err);
    process.exit(1);
  }
}

inspect();
