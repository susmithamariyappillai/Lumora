
const fs = require('fs');
const path = require('path');

// Source file
const from = path.join(__dirname, '..', 'data', 'products.json');

// Destination file
const to = path.join(
  __dirname,
  '..',
  '..',
  'frontend',
  'src',
  'data',
  'products.json'
);

// Copy file
fs.copyFileSync(from, to);

console.log('Products copied successfully');