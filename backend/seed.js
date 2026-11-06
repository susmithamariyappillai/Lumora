require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const Product = require('./models/Product');

// Expected product count
const EXPECTED = {
  women: 15,
  men: 12,
  beauty: 14,
  accessories: 18,
  'home-living': 12
};

async function run() {

  // Read products from JSON file
  const file = path.join(__dirname, 'data', 'products.json');
  const products = JSON.parse(
    fs.readFileSync(file, 'utf8')
  );

  // Connect database
  await connectDB();

  // Save products
  for (const product of products) {

    const existing = await Product.findOne({
      slug: product.slug
    });

    if (existing) {
      existing.set(product);
      await existing.save();
    } else {
      await Product.create(product);
    }
  }

  console.log('Products saved successfully');
}

run()
  .catch((err) => {
    console.log(err.message);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });