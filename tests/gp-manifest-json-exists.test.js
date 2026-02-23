// gp-manifest-json-exists.test.js — data/manifest.json must exist

const fs = require('fs');
const path = require('path');

const MANIFEST = path.join(__dirname, '..', 'data', 'manifest.json');

if (!fs.existsSync(MANIFEST)) {
  console.log(`gp-manifest-json-exists: 0 pass, 1 fail`);
  console.log(`  FAIL: data/manifest.json does not exist`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
console.log(`gp-manifest-json-exists: 1 pass, 0 fail`);
console.log(`  manifest has ${Array.isArray(data) ? data.length : Object.keys(data).length} entries`);
console.log(`OK — data/manifest.json exists and is valid JSON`);
