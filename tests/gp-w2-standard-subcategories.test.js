// gp-w2-standard-subcategories.test.js — W2 standards must use valid subcategories (W2.a through W2.e)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const VALID_W2 = new Set(['W2.a', 'W2.b', 'W2.c', 'W2.d', 'W2.e']);
let pass = 0;
let fail = 0;
const failures = [];
const subcatCount = {};

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!q.standard || !q.standard.startsWith('W2')) continue;
    subcatCount[q.standard] = (subcatCount[q.standard] || 0) + 1;
    if (!VALID_W2.has(q.standard)) {
      fail++; failures.push(`${file}: Q${q.id} has invalid W2 standard="${q.standard}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-w2-standard-subcategories: ${pass} pass, ${fail} fail`);
console.log(`  W2 distribution: ${JSON.stringify(subcatCount)}`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} W2 standards use valid subcategories`);
