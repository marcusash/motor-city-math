// gp-w3c-and-w3d-present.test.js — W3.c and W3.d should both be present (they're major standards)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const targets = ['W3.c', 'W3.d'];
const counts = { 'W3.c': 0, 'W3.d': 0 };

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (counts[q.standard] !== undefined) counts[q.standard]++;
  }
}

console.log(`gp-w3c-and-w3d-present: W3.c=${counts['W3.c']}, W3.d=${counts['W3.d']}`);

let fail = 0;
for (const t of targets) {
  if (counts[t] === 0) {
    fail++;
    console.log(`  FAIL: ${t} has 0 questions — critical gap in standards coverage`);
  } else {
    console.log(`  ${t}: ${counts[t]} questions (${(counts[t]/165*100).toFixed(1)}%)`);
  }
}

if (fail > 0) { process.exit(1); }
console.log(`OK — W3.c and W3.d both present in exam bank`);
