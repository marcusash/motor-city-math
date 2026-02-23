// gp-shared-dir-has-key-files.test.js — shared/ directory must contain styles.css and scripts.js

const fs = require('fs');
const path = require('path');

const SHARED_DIR = path.join(__dirname, '..', 'shared');
const REQUIRED_SHARED = ['styles.css', 'scripts.js'];

let pass = 0;
let fail = 0;
const failures = [];

for (const file of REQUIRED_SHARED) {
  const fullPath = path.join(SHARED_DIR, file);
  if (!fs.existsSync(fullPath)) {
    fail++; failures.push(`shared/${file}: not found`);
  } else {
    const size = fs.statSync(fullPath).size;
    if (size < 500) {
      fail++; failures.push(`shared/${file}: suspiciously small (${size} bytes)`);
    } else {
      pass++;
    }
  }
}

const allShared = fs.existsSync(SHARED_DIR) ? fs.readdirSync(SHARED_DIR).length : 0;
console.log(`gp-shared-dir-has-key-files: ${pass} pass, ${fail} fail (${allShared} total shared files)`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} required shared files exist`);
