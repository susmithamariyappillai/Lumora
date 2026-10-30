
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const EXPECTED = {
  women: 15,
  men: 12,
  beauty: 14,
  accessories: 18,
  'home-living': 12,
};

const args = process.argv.slice(2);

async function run() {
  const products = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, 'data', 'products.json'),
      'utf8'
    )
  );

  // Validate catalogue before database changes
  const counts = {};

  products.forEach((product) => {
    counts[product.category] =
      (counts[product.category] || 0) + 1;
  });

  for (const [category, count] of Object.entries(EXPECTED)) {
    if (counts[category] !== count) {
      throw new Error(
        `Catalogue problem: ${category} has ${counts[category] || 0} products, expected ${count}.`
      );
    }
  }

  if (new Set(products.map((p) => p.slug)).size !== products.length) {
    throw new Error('Catalogue problem: duplicate slugs.');
  }

  await connectDB();

  // Optional reset: deletes products only
  if (args.includes('--reset')) {
    const result = await Product.deleteMany({});
    console.log(
      `RESET: deleted ${result.deletedCount} existing products.`
    );
  }

  // Add or update catalogue products
  let created = 0;
  let updated = 0;

  for (const product of products) {
    const existing = await Product.findOne({
      slug: product.slug,
    });

    if (existing) {
      existing.set(product);
      await existing.save();
      updated++;
    } else {
      await Product.create(product);
      created++;
    }
  }

  console.log(`Created ${created}, updated ${updated}.`);

  const perCategory = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  console.log(
    'Products in database per category:',
    Object.fromEntries(
      perCategory.map((item) => [item._id, item.count])
    )
  );

  const publicDir = path.join(
    __dirname,
    '..',
    'frontend',
    'public'
  );

  const missing = products.filter((product) =>
    !fs.existsSync(
      path.join(publicDir, product.images[0])
    )
  );

  console.log(
    missing.length
      ? `Note: ${missing.length} product image files are missing.`
      : 'All product image files found.'
  );
}

run()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
