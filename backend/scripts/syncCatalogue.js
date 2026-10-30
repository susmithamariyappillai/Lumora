// Copies the ONE master catalogue (backend/data/products.json) to the frontend,
// so demo mode and the database always use the same products.
const fs = require('fs');
const path = require('path');
const from = path.join(__dirname, '..', 'data', 'products.json');
const to = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'products.json');
fs.copyFileSync(from, to);
console.log('Catalogue copied to frontend/src/data/products.json');
