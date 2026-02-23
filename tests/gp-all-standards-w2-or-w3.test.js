// gp-all-standards-w2-or-w3.test.js — all standards must start with W2 or W3

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.standard) continue;
    if (!q.standard.startsWith('W2.') && !q.standard.startsWith('W3.')) {
      fail++;
      failures.push(`${file}: ${q.id} standard="${q.standard}" (must be W2 or W3)`);
    } else { pass++; }
  }
}

console.log(`gp-all-standards-w2-or-w3: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have W2 or W3 standard`);
