// gp-all-rp-11-files-exist.test.js — definitively verify all 11 RP exam files exist on disk

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

let pass = 0;
let fail = 0;
const failures = [];

for (let i = 1; i <= 11; i++) {
  const f = `retake-practice-${i}.json`;
  if (fs.existsSync(path.join(DATA_DIR, f))) {
    pass++;
  } else {
    fail++;
    failures.push(`MISSING: ${f}`);
  }
}

console.log(`gp-all-rp-11-files-exist: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all 11 RP exam files confirmed present`);
