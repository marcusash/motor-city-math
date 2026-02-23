// gp-all-rp-files-present.test.js — verify all 11 RP exam files exist and none are accidentally deleted

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const EXPECTED_COUNT = 11;

const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

// Verify 1-11 all exist
const missing = [];
for (let i = 1; i <= EXPECTED_COUNT; i++) {
  const expected = `retake-practice-${i}.json`;
  if (!RP_FILES.includes(expected)) {
    missing.push(expected);
  }
}

const pass = EXPECTED_COUNT - missing.length;
const fail = missing.length;

console.log(`gp-all-rp-files-present: ${pass} pass, ${fail} fail`);
if (missing.length) {
  missing.forEach(f => console.log(`  MISSING: ${f}`));
  process.exit(1);
}
console.log(`OK — all ${EXPECTED_COUNT} exam files present (RP1-RP11)`);
