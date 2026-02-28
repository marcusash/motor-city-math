// gp-all-json-valid.test.js — verify all data/*.json files parse cleanly

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const jsonFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('.json') && !f.startsWith('_'))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of jsonFiles) {
  const filePath = path.join(DATA_DIR, file);
  try {
    JSON.parse(fs.readFileSync(filePath, 'utf8'));
    pass++;
  } catch (e) {
    fail++;
    issues.push(`INVALID: ${file} — ${e.message}`);
  }
}

console.log(`gp-all-json-valid: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} JSON files in data/ are valid`);
