// gp-shared-scripts-js-exists.test.js — shared/scripts.js must exist (critical shared dependency)

const fs = require('fs');
const path = require('path');

const SCRIPTS_FILE = path.join(__dirname, '..', 'shared', 'scripts.js');

console.log(`gp-shared-scripts-js-exists: checking ${SCRIPTS_FILE}`);
if (!fs.existsSync(SCRIPTS_FILE)) {
  console.log(`  FAIL: shared/scripts.js does not exist`);
  process.exit(1);
}

const stat = fs.statSync(SCRIPTS_FILE);
const sizeKB = (stat.size / 1024).toFixed(1);
console.log(`  Found: ${sizeKB}KB`);
if (stat.size < 1024) {
  console.log(`  FAIL: shared/scripts.js is too small (${sizeKB}KB) — may be corrupted`);
  process.exit(1);
}
console.log(`OK — shared/scripts.js exists and is ${sizeKB}KB (healthy)`);
