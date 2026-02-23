// gp-data-dir-exists.test.js — data/ directory must exist with all 11 RP exam files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  console.log(`gp-data-dir-exists: FAIL — data/ directory does not exist`);
  process.exit(1);
}

const rpFiles = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f));
const EXPECTED = 11;

console.log(`gp-data-dir-exists: ${rpFiles.length} RP exam files in data/ (expected ${EXPECTED})`);
if (rpFiles.length !== EXPECTED) {
  console.log(`  FAIL: expected ${EXPECTED} RP files, found ${rpFiles.length}`);
  process.exit(1);
}
console.log(`OK — data/ directory exists with all ${EXPECTED} retake practice exam files`);
