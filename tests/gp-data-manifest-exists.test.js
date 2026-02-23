// gp-data-manifest-exists.test.js — data/manifest.json must exist for exam discovery

const fs = require('fs');
const path = require('path');

const MANIFEST = path.join(__dirname, '..', 'data', 'manifest.json');

console.log(`gp-data-manifest-exists: checking manifest.json`);
if (!fs.existsSync(MANIFEST)) {
  console.log(`  FAIL: data/manifest.json does not exist`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const keys = Object.keys(data);
console.log(`  Found: ${keys.length} top-level keys (${keys.slice(0,3).join(', ')}...)`);
console.log(`OK — data/manifest.json exists and is valid JSON`);
