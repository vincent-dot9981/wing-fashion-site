const fs = require('fs');
const data = fs.readFileSync('js/products.js', 'utf8');
const urls = [...data.matchAll(/"pdp_url": "([^"]+)"/g)].map(m => m[1]);
const unique = [...new Set(urls)];
const shuffled = unique.sort(() => Math.random() - 0.5);
const picks = shuffled.slice(0, 3);
picks.forEach(u => console.log(u));
