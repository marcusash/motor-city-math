// gp-shared-dir-key-files-exist.test.js — shared/ directory must have required CSS and JS

const fs = require('fs');
const path = require('path');

const SHARED_DIR = path.join(__dirname, '..', 'shared');

const REQUIRED_FILES = ['styles.css', 'scripts.js'];

let pass = 0;
let fail = 0;
const failures = [];

for (const file of REQUIRED_FILES) {
  const filePath = path.join(SHARED_DIR, file);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    pass++;
    console.log(`  FOUND: shared/${file} (${size} bytes)`);
  } else {
    fail++;
    failures.push(`shared/${file} is missing`);
  }
}

console.log(`gp-shared-dir-key-files-exist: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} required shared files present`);
