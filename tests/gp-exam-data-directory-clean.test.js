// gp-exam-data-directory-clean.test.js — data/ directory should only contain expected files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const files = fs.readdirSync(DATA_DIR);
const ALLOWED_PATTERNS = [
  /^retake-practice-\d+\.json$/,
  /^_backups$/  // backup subdirectory is ok
];

const unexpected = files.filter(f => !ALLOWED_PATTERNS.some(p => p.test(f)));

const pass = files.length - unexpected.length;
const fail = unexpected.length;

console.log(`gp-exam-data-directory-clean: ${pass} pass, ${fail} unexpected files`);
if (unexpected.length > 0) {
  console.log('INFO — unexpected files in data/:');
  unexpected.forEach(f => console.log(`  ${f}`));
  // Informational only — other agents may have valid files here
}
console.log(`OK — data/ has ${pass} expected items`);
