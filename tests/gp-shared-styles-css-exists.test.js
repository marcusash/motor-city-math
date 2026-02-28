// gp-shared-styles-css-exists.test.js — shared/styles.css must exist (critical shared dependency)

const fs = require('fs');
const path = require('path');

const STYLES_FILE = path.join(__dirname, '..', 'shared', 'styles.css');

console.log(`gp-shared-styles-css-exists: checking ${STYLES_FILE}`);
if (!fs.existsSync(STYLES_FILE)) {
  console.log(`  FAIL: shared/styles.css does not exist`);
  process.exit(1);
}

const stat = fs.statSync(STYLES_FILE);
const sizeKB = (stat.size / 1024).toFixed(1);
console.log(`  Found: ${sizeKB}KB`);
if (stat.size < 1024) {
  console.log(`  FAIL: shared/styles.css is too small (${sizeKB}KB) — may be corrupted`);
  process.exit(1);
}
console.log(`OK — shared/styles.css exists and is ${sizeKB}KB (healthy)`);
